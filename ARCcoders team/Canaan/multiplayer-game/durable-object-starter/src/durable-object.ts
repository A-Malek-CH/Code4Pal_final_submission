export interface Env {
    GAME_ROOM: DurableObjectNamespace;
}

interface Player {
    id: string;
    ws: WebSocket;
    score: number;
    currentAnswer?: {
        coordinates: [number, number];
        year: number;
    };
}

interface GameEvent {
    id: string;
    name: string;
    description?: string;
    actualYear: number;
    actualCoordinates: [number, number];
}

interface GameState {
    gameId: string;
    players: { id: string; score: number }[];
    events: GameEvent[];
    currentEventIndex: number;
    roundStatus: 'waiting' | 'active' | 'finished';
    roundTimer: number;
    currentEvent?: GameEvent;
}

export class GameRoom {
    state: DurableObjectState;
    players: Player[] = [];
    gameState!: GameState;
    roundInterval?: number;

    constructor(state: DurableObjectState, env: Env) {
        this.state = state;
        this.state.blockConcurrencyWhile(async () => {
            const storedState = await this.state.storage.get<GameState>("gameState");
            this.gameState = storedState || this.initializeGameState();
        });
    }

    initializeGameState(): GameState {
        return {
            gameId: '',
            players: [],
            events: [
                {
                    id: "french-revolution",
                    name: "French Revolution Begins",
                    description: "The French Revolution started with the storming of the Bastille",
                    actualYear: 1789,
                    actualCoordinates: [48.8566, 2.3522], // Paris
                },
                {
                    id: "battle-waterloo",
                    name: "Battle of Waterloo",
                    description: "Napoleon's final defeat at the Battle of Waterloo",
                    actualYear: 1815,
                    actualCoordinates: [50.6799, 4.4116], // Waterloo, Belgium
                },
                {
                    id: "congress-vienna",
                    name: "Congress of Vienna",
                    description: "European powers redraw the map of Europe after Napoleon",
                    actualYear: 1815,
                    actualCoordinates: [48.2082, 16.3738], // Vienna
                },
                {
                    id: "industrial-revolution",
                    name: "Industrial Revolution Peak",
                    description: "The height of industrial development in Britain",
                    actualYear: 1840,
                    actualCoordinates: [53.4808, -2.2426], // Manchester
                },
                {
                    id: "unification-italy",
                    name: "Italian Unification",
                    description: "The unification of Italy under the Kingdom of Sardinia",
                    actualYear: 1861,
                    actualCoordinates: [45.0703, 7.6869], // Turin
                },
            ],
            currentEventIndex: -1,
            roundStatus: 'waiting',
            roundTimer: 0,
        };
    }

    async fetch(request: Request) {
        const upgradeHeader = request.headers.get('Upgrade');
        if (!upgradeHeader || upgradeHeader !== 'websocket') {
            return new Response('Expected Upgrade: websocket', { status: 426 });
        }

        const webSocketPair = new WebSocketPair();
        const { 0: client, 1: server } = webSocketPair;

        server.accept();

        const playerId = request.headers.get('Sec-WebSocket-Key') || `player-${Math.random().toString(36).substr(2, 9)}`;
        this.handleSession(server, playerId);

        return new Response(null, {
            status: 101,
            webSocket: client,
        });
    }

    handleSession(ws: WebSocket, playerId: string) {
        const player: Player = { id: playerId, ws, score: 0 };
        this.players.push(player);
        this.gameState.players.push({ id: playerId, score: 0 });

        ws.addEventListener('message', async (event) => {
            await this.handleMessage(player, JSON.parse(event.data as string));
        });

        ws.addEventListener('close', () => {
            this.players = this.players.filter(p => p.id !== playerId);
            this.gameState.players = this.gameState.players.filter(p => p.id !== playerId);
            this.broadcastGameState();
        });

        if (this.players.length >= 2 && this.gameState.roundStatus === 'waiting') {
            this.startRound();
        }
        this.broadcastGameState();
    }

    async handleMessage(player: Player, message: any) {
        if (message.type === 'submitAnswer') {
            player.currentAnswer = {
                coordinates: message.payload.userCoordinates,
                year: message.payload.userYear,
            };

            const allPlayersAnswered = this.players.every(p => p.currentAnswer);
            if (allPlayersAnswered) {
                this.endRound();
            }
        }
    }

    startRound() {
        this.gameState.currentEventIndex++;
        if (this.gameState.currentEventIndex >= this.gameState.events.length) {
            this.gameOver();
            return;
        }

        this.gameState.roundStatus = 'active';
        this.gameState.currentEvent = this.gameState.events[this.gameState.currentEventIndex];
        this.gameState.roundTimer = 30;
        this.players.forEach(p => p.currentAnswer = undefined);

        this.broadcastGameState();

        this.roundInterval = setInterval(() => {
            this.gameState.roundTimer--;
            if (this.gameState.roundTimer <= 0) {
                this.endRound();
            }
            this.broadcastGameState();
        }, 1000);
    }

    endRound() {
        if (this.roundInterval) clearInterval(this.roundInterval);
        this.gameState.roundStatus = 'finished';

        const playerResults = this.players.map(player => {
            const scoreThisRound = this.calculateScore(player.currentAnswer);
            player.score += scoreThisRound;
            const playerState = this.gameState.players.find(p => p.id === player.id);
            if (playerState) playerState.score = player.score;

            return {
                id: player.id,
                scoreThisRound,
                answer: player.currentAnswer,
            };
        });

        const currentEvent = this.gameState.events[this.gameState.currentEventIndex];

        this.broadcast('roundResult', {
            correctAnswer: {
                coordinates: currentEvent.actualCoordinates,
                year: currentEvent.actualYear,
            },
            playerResults,
        });

        setTimeout(() => {
            this.startRound();
        }, 5000);
    }

    gameOver() {
        this.broadcast('gameOver', {
            finalScores: this.gameState.players.map(p => ({ id: p.id, score: p.score }))
        });
        this.gameState.currentEventIndex = -1;
        this.gameState.roundStatus = 'waiting';
        this.players.forEach(p => p.score = 0);
        this.gameState.players.forEach(p => p.score = 0);
    }

    calculateScore(answer?: { coordinates: [number, number]; year: number }): number {
        if (!answer) return 0;

        const event = this.gameState.events[this.gameState.currentEventIndex];
        if (!event) return 0;

        // Haversine formula for distance
        const R = 6371; // Radius of the Earth in km
        const dLat = (answer.coordinates[0] - event.actualCoordinates[0]) * Math.PI / 180;
        const dLon = (answer.coordinates[1] - event.actualCoordinates[1]) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(event.actualCoordinates[0] * Math.PI / 180) * Math.cos(answer.coordinates[0] * Math.PI / 180) * 
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // distance in km

        const maxDistance = 2000; // km
        const locationScore = Math.max(0, 50 - (distance / maxDistance) * 50);

        const yearDiff = Math.abs(event.actualYear - answer.year);
        const maxYearDiff = 100; // years
        const timeScore = Math.max(0, 50 - (yearDiff / maxYearDiff) * 50);

        return Math.round(locationScore + timeScore);
    }

    broadcastGameState() {
        const minimalState = { ...this.gameState };
        // @ts-ignore
        delete minimalState.events;
        this.broadcast('gameStateUpdate', minimalState);
    }

    broadcast(type: string, payload: any) {
        this.players.forEach(p => {
            try {
                p.ws.send(JSON.stringify({ type, payload }));
            } catch (e) {
                console.error("Failed to send message to player", p.id, e);
            }
        });
    }
}
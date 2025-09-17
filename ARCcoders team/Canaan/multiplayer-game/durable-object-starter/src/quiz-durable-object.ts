
export interface Env {
  QUIZ_GAME_SESSIONS: DurableObjectNamespace;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  answeredQuestions: Set<string>;
  isReady: boolean;
  websocket?: WebSocket;
}

export interface QuizSession {
  id: string;
  players: Map<string, Player>;
  currentQuestionId: string | null;
  questionStartTime: number;
  isActive: boolean;
  level: number;
  answers: Map<string, { playerId: string; answer: string; timestamp: number; isCorrect: boolean }>;
}

export class QuizGameDO {
  private session: QuizSession;
  private storage: DurableObjectStorage;
  private env: Env;

  constructor(state: DurableObjectState, env: Env) {
    this.storage = state.storage;
    this.env = env;
    this.session = {
      id: '',
      players: new Map(),
      currentQuestionId: null,
      questionStartTime: 0,
      isActive: false,
      level: 1,
      answers: new Map(),
    };
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // --- THIS IS THE ONLY LINE THAT HAS BEEN CHANGED ---
    if (url.pathname.endsWith('/websocket')) {
      return this.handleWebSocket(request);
    }

    if (request.method === 'POST') {
      const data = await request.json();

      switch (data.action) {
        case 'join':
          return this.handleJoin(data);
        case 'answer':
          return this.handleAnswer(data);
        case 'start_question':
          return this.handleStartQuestion(data);
        case 'get_session':
          return this.handleGetSession();
        default:
          return new Response('Invalid action', { status: 400 });
      }
    }

    return new Response('Method not allowed', { status: 405 });
  }

  private async handleWebSocket(request: Request): Promise<Response> {
    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);

    server.accept();

    server.addEventListener('message', async (event) => {
      try {
        const data = JSON.parse(event.data as string);
        await this.handleWebSocketMessage(data, server);
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  private async handleWebSocketMessage(data: any, websocket: WebSocket) {
    const { action, playerId } = data;

    if (action === 'register') {
      const player = this.session.players.get(playerId);
      if (player) {
        player.websocket = websocket;
        this.session.players.set(playerId, player);
        await this.broadcastSessionUpdate();
      }
    }
  }

  private async handleJoin(data: { playerId: string; playerName: string; sessionId: string }): Promise<Response> {
    const { playerId, playerName, sessionId } = data;

    if (!this.session.id) {
      this.session.id = sessionId;
      await this.storage.put('session', this.session);
    }

    if (this.session.players.size >= 2) {
      return new Response(JSON.stringify({ error: 'Session is full' }), { status: 400 });
    }

    const player: Player = {
      id: playerId,
      name: playerName,
      score: 0,
      answeredQuestions: new Set(),
      isReady: false,
    };

    this.session.players.set(playerId, player);
    await this.storage.put('session', this.session);
    await this.broadcastSessionUpdate();

    return new Response(JSON.stringify({ success: true, session: this.serializeSession() }));
  }

  private async handleAnswer(data: {
    playerId: string;
    questionId: string;
    answer: string;
    isCorrect: boolean;
  }): Promise<Response> {
    const { playerId, questionId, answer, isCorrect } = data;
    const timestamp = Date.now();

    const player = this.session.players.get(playerId);
    if (!player) {
      return new Response(JSON.stringify({ error: 'Player not found' }), { status: 404 });
    }

    if (player.answeredQuestions.has(questionId)) {
      return new Response(JSON.stringify({ error: 'Question already answered' }), { status: 400 });
    }

    const answerKey = `${questionId}-${playerId}`;
    this.session.answers.set(answerKey, {
      playerId,
      answer,
      timestamp,
      isCorrect,
    });

    player.answeredQuestions.add(questionId);

    if (isCorrect) {
      const otherAnswers = Array.from(this.session.answers.values()).filter(
        (a) => a.playerId !== playerId && a.answer === answer
      );

      const isFirstCorrect =
        otherAnswers.length === 0 || otherAnswers.every((a) => !a.isCorrect || a.timestamp > timestamp);

      if (isFirstCorrect) {
        player.score += 15;
      } else {
        player.score += 10;
      }
    }

    this.session.players.set(playerId, player);
    await this.storage.put('session', this.session);
    await this.broadcastSessionUpdate();

    return new Response(
      JSON.stringify({
        success: true,
        score: player.score,
        isFirstCorrect: isCorrect && this.isFirstCorrectAnswer(questionId, playerId, timestamp),
      })
    );
  }

  private isFirstCorrectAnswer(questionId: string, playerId: string, timestamp: number): boolean {
    const questionAnswers = Array.from(this.session.answers.values()).filter(
      (a) => a.answer.includes(questionId) && a.isCorrect
    );

    return (
      questionAnswers.length === 1 || questionAnswers.every((a) => a.playerId === playerId || a.timestamp > timestamp)
    );
  }

  private async handleStartQuestion(data: { questionId: string }): Promise<Response> {
    this.session.currentQuestionId = data.questionId;
    this.session.questionStartTime = Date.now();

    await this.storage.put('session', this.session);
    await this.broadcastSessionUpdate();

    return new Response(JSON.stringify({ success: true }));
  }

  private async handleGetSession(): Promise<Response> {
    return new Response(JSON.stringify({ session: this.serializeSession() }));
  }

  private async broadcastSessionUpdate() {
    const sessionData = JSON.stringify({
      type: 'session_update',
      session: this.serializeSession(),
    });

    for (const player of this.session.players.values()) {
      if (player.websocket) {
        try {
          player.websocket.send(sessionData);
        } catch (error) {
          console.error('Failed to send to player:', error);
        }
      }
    }
  }

  private serializeSession() {
    return {
      id: this.session.id,
      players: Array.from(this.session.players.entries()).map(([id, player]) => ({
        id,
        name: player.name,
        score: player.score,
        answeredQuestions: Array.from(player.answeredQuestions),
        isReady: player.isReady,
      })),
      currentQuestionId: this.session.currentQuestionId,
      questionStartTime: this.session.questionStartTime,
      isActive: this.session.isActive,
      level: this.session.level,
    };
  }
}
// components/map-game/multiplayer-interactive-historical-game.tsx
"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import Link from 'next/link';
import {
  Compass,
  Trophy,
  Users,
  Clock,
  Star,
  User as UserIcon,
  XCircle,
  RefreshCw,
  HelpCircle,
} from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "maplibre-gl/dist/maplibre-gl.css";
import "@maplibre/maplibre-gl-leaflet";
// @ts-ignore
import { filterByDate } from "@openhistoricalmap/maplibre-gl-dates";
import '@/app/games/game-styles.css';

interface PlayerState { id: string; score: number; }
interface GameEvent { id: string; name: string; description?: string; }
interface GameState { gameId: string; players: PlayerState[]; currentEventIndex: number; currentEvent?: GameEvent; roundStatus: "waiting" | "active" | "finished"; roundTimer: number; }
interface RoundResult { correctAnswer: { coordinates: [number, number]; year: number; }; playerResults: Array<{ id: string; scoreThisRound: number; answer?: { coordinates: [number, number]; year: number; }; }>; }
interface GameOver { finalScores: Array<{id: string; score: number}>; }
interface ComponentProps { gameId: string; gameType: 'map-game'; }

const PlayerCard = ({ player, isMe }: { player?: PlayerState, isMe: boolean }) => {
    const playerName = useMemo(() => {
        const historicalNames = ["Cleopatra", "Da Vinci", "Napoleon", "Joan of Arc", "Aristotle", "Newton"];
        return historicalNames[Math.floor(Math.random() * historicalNames.length)];
    }, []);

    if (!player) {
        return (
            <div className="player-panel">
                <div className="flex items-center justify-center p-4 bg-muted border-2 border-dashed rounded-lg h-24">
                    <p className="text-muted-foreground font-semibold">Waiting for opponent...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="player-panel">
            <div className="player-card-ui bg-card shadow-md rounded-lg p-3 flex items-center transition-all duration-300 ease-in-out">
                <div className="w-16 h-16 rounded-full bg-accent flex-shrink-0 mr-4 border-2 border-white shadow-inner flex items-center justify-center">
                    <UserIcon size={32} className="text-accent-foreground opacity-80" />
                </div>
                <div className="flex-grow">
                    <h3 className="font-bold text-lg text-foreground truncate">
                        {playerName} {isMe && <span className="text-sm font-normal text-primary">(You)</span>}
                    </h3>
                    <div className="player-stats mt-1">
                        <Badge variant="secondary" className="bg-background">
                            <Star className="w-4 h-4 mr-1.5 text-star"/> 
                            <span className="font-bold text-foreground">{player.score} pts</span>
                        </Badge>
                    </div>
                </div>
            </div>
        </div>
    );
};


export function MultiplayerInteractiveHistoricalMap({ gameId, gameType }: ComponentProps) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [roundResult, setRoundResult] = useState<RoundResult | null>(null);
  const [gameOver, setGameOver] = useState<GameOver | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [currentYear, setCurrentYear] = useState(1948);
  const [mapReady, setMapReady] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const maplibreMapRef = useRef<any>(null);
  const answerMarkerRef = useRef<L.Marker | null>(null);
  const resultMarkersRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!gameId || !gameType) return;
    
    const wsUrl = `ws://127.0.0.1:8787/game/${gameId}`;
    
    console.log(`Attempting to connect WebSocket to: ${wsUrl}`);
    
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => console.log("WebSocket connected successfully");
    ws.current.onerror = (err) => console.error("WebSocket error:", err);
    ws.current.onclose = (event) => console.log("WebSocket disconnected:", event);

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      if (!playerId && message.type === "gameStateUpdate") {
          const players = message.payload.players as PlayerState[];
          if (players.length > 0) {
              setPlayerId(players[players.length - 1].id);
          }
      }

      switch (message.type) {
        case "gameStateUpdate":
          setGameState(message.payload);
          setRoundResult(null);
          setGameOver(null);
          setHasSubmitted(false);
          if (resultMarkersRef.current) resultMarkersRef.current.clearLayers();
          if (answerMarkerRef.current) { answerMarkerRef.current.remove(); answerMarkerRef.current = null; }
          break;
        case "roundResult":
          setRoundResult(message.payload);
          break;
        case "gameOver":
          setGameOver(message.payload);
          break;
      }
    };

    return () => { ws.current?.close(); };
  }, [gameId, gameType, playerId]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    const map = L.map(mapContainerRef.current).setView([48.8566, 2.3522], 4);
    mapRef.current = map;
    resultMarkersRef.current = L.layerGroup().addTo(map);
    const gl = (L as any).maplibreGL({ style: "https://www.openhistoricalmap.org/map-styles/main/main.json" }).addTo(map);
    maplibreMapRef.current = gl.getMaplibreMap();
    maplibreMapRef.current.once("styledata", () => { filterByDate(maplibreMapRef.current, `${currentYear}-01-01`); setMapReady(true); });
  }, []);
  
  useEffect(() => {
    if (maplibreMapRef.current && mapReady) filterByDate(maplibreMapRef.current, `${currentYear}-01-01`);
  }, [currentYear, mapReady]);
  
  useEffect(() => {
    if (gameState?.roundStatus === 'active' && !hasSubmitted && !answerMarkerRef.current && mapRef.current) {
      const marker = L.marker(mapRef.current.getCenter(), { draggable: true, icon: L.divIcon({ className: 'draggable-map-marker bg-primary' }) }).addTo(mapRef.current);
        answerMarkerRef.current = marker;
    }
}, [gameState, hasSubmitted]);
  
  useEffect(() => {
    if (!roundResult || !mapRef.current || !resultMarkersRef.current) return;
    resultMarkersRef.current.clearLayers();
    const correctIcon = L.divIcon({ className: `p-2 rounded-lg bg-chart-1 text-primary-foreground font-bold`, html: `✓ Correct Location` });
    L.marker(roundResult.correctAnswer.coordinates, { icon: correctIcon, zIndexOffset: 1000 }).addTo(resultMarkersRef.current);
    roundResult.playerResults.forEach((p) => {
      if (!p.answer) return;
      const isSelf = p.id === playerId;
      const scoreText = `+${p.scoreThisRound}pt`;
      const playerIcon = L.divIcon({ className: `p-2 rounded-lg ${isSelf ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'} font-bold`, html: `${p.id.substring(0,4)} ${scoreText}` });
      L.marker(p.answer.coordinates, { icon: playerIcon }).addTo(resultMarkersRef.current!);
    });
  }, [roundResult, playerId]);

  const handleSubmitAnswer = () => {
    if (!answerMarkerRef.current || ws.current?.readyState !== WebSocket.OPEN) return;
    const { lat, lng } = answerMarkerRef.current.getLatLng();
    ws.current.send(JSON.stringify({ type: "submitAnswer", payload: { userCoordinates: [lat, lng], userYear: currentYear } }));
    setHasSubmitted(true);
    if(answerMarkerRef.current.dragging) { answerMarkerRef.current.dragging.disable(); }
  };

  const myPlayerState = gameState?.players.find(p => p.id === playerId);
  const opponentState = gameState?.players.find(p => p.id !== playerId);

  return (
    <div className="flex flex-col h-screen w-full bg-background p-4">
      <Card className="border-2 shadow-xl mb-4">
        <CardHeader className="p-3">
          <CardTitle className="flex items-center justify-between text-xl">
            <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-primary"/>
                <div className="font-black">Multiplayer Match</div>
                <Badge variant="outline">{gameState?.roundStatus}</Badge>
            </div>
            {gameState?.roundStatus === 'active' && <Badge className="text-lg"><Clock className="w-4 h-4 mr-2"/>Time: {gameState?.roundTimer}</Badge>}
          </CardTitle>
        </CardHeader>
      </Card>
      
      <div className="multiplayer-game-layout flex-grow">
          <PlayerCard player={myPlayerState} isMe={true} />
          
          <div className="main-content-panel">
              <Card className="flex-grow border-2 shadow-2xl overflow-hidden">
                <CardContent className="p-1 h-full">
                    <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }} className="bg-muted rounded-md">
                        {!mapReady && <div className="p-4 flex items-center justify-center h-full"><Compass className="animate-spin h-8 w-8 text-primary" /></div>}
                    </div>
                </CardContent>
              </Card>
              <Card className="border-2 shadow-xl">
                <CardContent className="p-3">
                    <div className="event-display-box">
                      {gameState?.roundStatus === 'active' && gameState.currentEvent ? (
                        <>
                          <h4 className="font-bold text-lg mb-1">{gameState.currentEvent.name}</h4>
                          <p className="text-sm text-muted-foreground">{gameState.currentEvent.description}</p>
                        </>
                      ) : (
                         <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <HelpCircle className="w-8 h-8 mb-2"/>
                            <p className="font-bold">
                              {gameState?.roundStatus === 'waiting' ? 'Waiting for game to start...' : 'Waiting for next event...'}
                            </p>
                         </div>
                      )}
                    </div>
                    
                    <Slider value={[currentYear]} onValueChange={(v) => setCurrentYear(v[0])} min={1750} max={1900} step={1} disabled={hasSubmitted || gameState?.roundStatus !== 'active'}/>
                    <div className="text-center font-bold text-xl mt-2">{currentYear}</div>
                    
                    <Button onClick={handleSubmitAnswer} className="w-full mt-3 py-3" disabled={!answerMarkerRef.current || hasSubmitted || gameState?.roundStatus !== 'active'}>
                      {hasSubmitted ? 'Waiting for Results...' : 'Confirm Placement'}
                    </Button>
                </CardContent>
              </Card>
          </div>
          
          <PlayerCard player={opponentState} isMe={false} />
      </div>

      {roundResult && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000]">
              <Card className="w-full max-w-lg m-4 text-center border-2 shadow-2xl animate-in fade-in-0 zoom-in-95">
                  <CardHeader>
                      <CardTitle className="text-3xl font-black">Round Over</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 px-6 pb-6">
                      <div className="text-lg text-muted-foreground">
                          Correct Answer Was: <strong>{roundResult.correctAnswer.year}</strong>
                      </div>
                      <div className="space-y-2">
                          {roundResult.playerResults.map(p => (
                              <div key={p.id} className="flex justify-between items-center p-2 bg-muted rounded-md">
                                  <span className="font-bold">{p.id === playerId ? "You" : "Opponent"}</span>
                                  <span className="font-bold text-primary">+{p.scoreThisRound} pts</span>
                              </div>
                          ))}
                      </div>
                  </CardContent>
              </Card>
          </div>
      )}

      {gameOver && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000]">
              <Card className="w-full max-w-md m-4 text-center border-2 shadow-2xl animate-in fade-in-0 zoom-in-95">
                  <CardHeader>
                      {gameOver.finalScores.find(s => s.id === playerId)?.score ?? 0 > gameOver.finalScores.find(s => s.id !== playerId)?.score ?? 0 ? (
                          <>
                              <Trophy className="w-16 h-16 text-star mx-auto animate-bounce" />
                              <CardTitle className="text-4xl font-black text-chart-1 mt-4">You Won!</CardTitle>
                          </>
                      ) : (
                          <>
                              <XCircle className="w-16 h-16 text-destructive mx-auto" />
                              <CardTitle className="text-4xl font-black text-destructive mt-4">Game Over</CardTitle>
                          </>
                      )}
                  </CardHeader>
                  <CardContent className="space-y-6 px-8 pb-8">
                      <div className="text-lg text-muted-foreground">Final Scores:</div>
                      <div className="space-y-2">
                          {gameOver.finalScores.map(p => (
                              <div key={p.id} className="flex justify-between items-center p-3 bg-muted rounded-lg text-xl">
                                  <span className="font-bold">{p.id === playerId ? "You" : "Opponent"}</span>
                                  <span className="font-bold text-primary">{p.score} pts</span>
                              </div>
                          ))}
                      </div>
                      <Link href={`/`} className="w-full"><Button size="lg" className="w-full mt-4">Back to Lobby</Button></Link>
                  </CardContent>
              </Card>
          </div>
      )}
    </div>
  );
}


delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});
"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Trophy, Crown, Zap } from "lucide-react"
import { MindMapQuiz } from "./mind-map-quiz"
import { saveScore } from "@/lib/supabase/quiz-supabase"

// --- Interfaces remain the same ---
interface Player {
  id: string
  name: string
  score: number
  answeredQuestions: string[]
  isReady: boolean
}

interface MultiplayerSession {
  id: string
  players: Player[]
  currentQuestionId: string | null
  questionStartTime: number
  isActive: boolean
  level: number
}

interface MultiplayerQuizProps {
  sessionId: string
  playerId: string
  onLeaveGame: () => void
}

export function MultiplayerQuiz({ sessionId, playerId, onLeaveGame }: MultiplayerQuizProps) {
  const [session, setSession] = useState<MultiplayerSession | null>(null)
  const [websocket, setWebsocket] = useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  // --- THIS useEffect IS NOW CORRECTED TO INCLUDE THE "JOIN" LOGIC ---
  useEffect(() => {
    if (!sessionId || !playerId) return;

    let ws: WebSocket;

    const joinAndConnect = async () => {
      try {
        // Step 1: Join the session via HTTP to create the player record on the backend.
        const playerName = localStorage.getItem("quizPlayerName") || `Player_${playerId.slice(0, 5)}`;
        const httpBaseUrl = "http://localhost:8787";
        const joinUrl = `${httpBaseUrl}/quiz/${sessionId}`;

        await fetch(joinUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'join', sessionId, playerId, playerName }),
        });
        
        // Step 2: Now that the player exists, connect the WebSocket.
        const wsBaseUrl = "ws://localhost:8787";
        const wsUrl = `${wsBaseUrl}/quiz/${sessionId}/websocket`;
        ws = new WebSocket(wsUrl);
        setWebsocket(ws);

        ws.onopen = () => {
          console.log("WebSocket connection established.");
          setIsConnected(true);
          // Register this WebSocket connection to the player record
          ws.send(JSON.stringify({ action: "register", playerId }));
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === "session_update") {
              console.log("Received session update:", data.session);
              setSession(data.session); // This will update the UI and show the lobby
            }
          } catch (error) {
            console.error("Error parsing message:", error);
          }
        };

        ws.onclose = () => {
          console.log("WebSocket connection closed.");
          setIsConnected(false);
        };

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
        };
      } catch (error) {
        console.error("Failed to join and connect:", error);
      }
    };

    joinAndConnect();

    // Cleanup function to close the connection when leaving the page
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [sessionId, playerId]);

  // --- The rest of the component remains the same ---
  const handleAnswerSubmitted = useCallback(
    async (questionId: string, answer: string, isCorrect: boolean) => {
      if (!websocket || websocket.readyState !== WebSocket.OPEN) return;
      
      const payload = { action: "answer", playerId, questionId, answer, isCorrect };
      websocket.send(JSON.stringify(payload));
    },
    [websocket, playerId],
  );

  const startGame = () => {
    setGameStarted(true);
  };

  if (!isConnected || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Connecting to multiplayer session...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!gameStarted) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-xl flex items-center justify-center gap-2 dark:text-white">
              <Users className="w-5 h-5 text-purple-500" />
              Multiplayer Lobby
            </CardTitle>
            <Badge variant="outline" className="mx-auto">
              Session: {sessionId.slice(-8)}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium dark:text-gray-200">Players ({session.players.length}/2)</h4>
              {session.players.map((player, index) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    {index === 0 && <Crown className="w-4 h-4 text-yellow-500" />}
                    <span className="font-medium dark:text-white">{player.name}</span>
                    {player.id === playerId && (
                      <Badge variant="secondary" className="text-xs">
                        You
                      </Badge>
                    )}
                  </div>
                  <Badge variant={player.isReady ? "default" : "secondary"}>
                    {player.isReady ? "Ready" : "Waiting"}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-purple-900 dark:text-purple-100">Multiplayer Scoring</span>
              </div>
              <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                <li>• First correct answer: +15 points</li>
                <li>• Second correct answer: +10 points</li>
                <li>• Wrong answers: 0 points</li>
              </ul>
            </div>

            <div className="flex gap-2">
              <Button onClick={startGame} className="flex-1 bg-purple-600 hover:bg-purple-700">
                Start Game
              </Button>
              <Button onClick={onLeaveGame} variant="outline" className="flex-1 bg-transparent">
                Leave
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative">
      <Card className="absolute top-4 right-4 z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-lg w-64">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2 dark:text-white">
            <Users className="w-4 h-4 text-purple-500" />
            Multiplayer Match
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {session.players.map((player, index) => (
            <div key={player.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <div className="flex items-center gap-2">
                {index === 0 && <Crown className="w-3 h-3 text-yellow-500" />}
                <span className="text-sm font-medium dark:text-white">
                  {player.name}
                  {player.id === playerId && " (You)"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Trophy className="w-3 h-3 text-yellow-500" />
                <span className="text-sm font-bold dark:text-white">{player.score}</span>
              </div>
            </div>
          ))}
          <Button onClick={onLeaveGame} variant="outline" size="sm" className="w-full mt-2 bg-transparent">
            Leave Game
          </Button>
        </CardContent>
      </Card>
      <MindMapQuiz />
    </div>
  );
}
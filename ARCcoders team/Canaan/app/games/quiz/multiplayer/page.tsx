"use client"

import { useState } from "react"
import { MultiplayerLobby } from "@/components/quiz-game/multiplayer-lobby"
import { MultiplayerQuiz } from "@/components/quiz-game/multiplayer-quiz"

export default function MultiplayerPage() {
  const [gameState, setGameState] = useState<"lobby" | "playing">("lobby")
  const [sessionId, setSessionId] = useState("")
  const [playerId, setPlayerId] = useState("")

  const handleStartGame = (newSessionId: string, newPlayerId: string) => {
    setSessionId(newSessionId)
    setPlayerId(newPlayerId)
    setGameState("playing")
  }

  const handleLeaveGame = () => {
    setGameState("lobby")
    setSessionId("")
    setPlayerId("")
  }

  if (gameState === "playing") {
    return <MultiplayerQuiz sessionId={sessionId} playerId={playerId} onLeaveGame={handleLeaveGame} />
  }

  return <MultiplayerLobby onStartGame={handleStartGame} />
}

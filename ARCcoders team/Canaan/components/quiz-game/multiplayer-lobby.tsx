"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation" // 1. Import the router
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Copy, Check, Loader2, ArrowLeft } from "lucide-react" // 2. Import the back arrow icon

interface MultiplayerLobbyProps {
  onStartGame: (sessionId: string, playerId: string) => void
}

export function MultiplayerLobby({ onStartGame }: MultiplayerLobbyProps) {
  const router = useRouter() // 3. Initialize the router
  const [sessionId, setSessionId] = useState("")
  const [playerName, setPlayerName] = useState("")
  const [isJoining, setIsJoining] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const savedName = localStorage.getItem("quizPlayerName") || `Player_${Date.now()}`
    setPlayerName(savedName)
  }, [])

  const createSession = async () => {
    setIsCreating(true)
    try {
      const newSessionId = `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      setSessionId(newSessionId)
      localStorage.setItem("quizPlayerName", playerName)
      const playerId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      onStartGame(newSessionId, playerId)
    } catch (error) {
      console.error("Failed to create session:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const joinSession = async () => {
    if (!sessionId.trim()) return
    setIsJoining(true)
    try {
      localStorage.setItem("quizPlayerName", playerName)
      const playerId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      onStartGame(sessionId.trim(), playerId)
    } catch (error) {
      console.error("Failed to join session:", error)
    } finally {
      setIsJoining(false)
    }
  }

  const copySessionId = async () => {
    if (sessionId) {
      await navigator.clipboard.writeText(sessionId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center p-4">
      {/* 4. Add 'relative' class to the Card for positioning */}
      <Card className="w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-xl relative">

        {/* --- THIS IS THE NEW BACK BUTTON, ADDED HERE --- */}
        <Button
          onClick={() => router.back()} // 5. It calls router.back()
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        {/* ------------------------------------------- */}

        {/* 6. Added padding-top to the header to make space for the button */}
        <CardHeader className="text-center pt-12">
          <CardTitle className="text-2xl flex items-center justify-center gap-2 dark:text-white">
            <Users className="w-6 h-6 text-purple-500" />
            Multiplayer Quiz
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-300">Compete with friends in real-time!</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-gray-200">Your Name</label>
            <Input
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="space-y-4">
            <Button
              onClick={createSession}
              disabled={!playerName.trim() || isCreating}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create New Game"
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
                  Or join existing
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-gray-200">Session ID</label>
              <div className="flex gap-2">
                <Input
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  placeholder="Enter session ID"
                  className="dark:bg-gray-700 dark:text-white"
                />
                {sessionId && (
                  <Button variant="outline" size="icon" onClick={copySessionId} className="shrink-0 bg-transparent">
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                )}
              </div>
            </div>

            <Button
              onClick={joinSession}
              disabled={!playerName.trim() || !sessionId.trim() || isJoining}
              variant="outline"
              className="w-full bg-transparent"
            >
              {isJoining ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Joining...
                </>
              ) : (
                "Join Game"
              )}
            </Button>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Multiplayer Rules:</h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• First correct answer gets bonus points (+15)</li>
              <li>• Second correct answer gets regular points (+10)</li>
              <li>• Wrong answers get no points</li>
              <li>• Race to answer questions first!</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


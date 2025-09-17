"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Users, Play, ArrowLeft } from "lucide-react"

interface GameModeSelectorProps {
  onModeSelect: (mode: "single" | "multiplayer") => void
  onBack: () => void
}

export function GameModeSelector({ onModeSelect, onBack }: GameModeSelectorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <Button onClick={onBack} variant="ghost" className="absolute top-4 left-4 text-gray-600 dark:text-gray-300">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Choose Game Mode
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
            Select how you want to explore Palestinian history
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Single Player Mode */}
            <Card className="border-2 border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500 transition-all cursor-pointer group">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Single Player</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Learn at your own pace through the historical narrative
                </p>
                <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <li>• Complete all 6 story elements</li>
                  <li>• Track your progress and scores</li>
                  <li>• No time pressure</li>
                </ul>
                <Button
                  onClick={() => onModeSelect("single")}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Solo Journey
                </Button>
              </CardContent>
            </Card>

            {/* Multiplayer Mode */}
            <Card className="border-2 border-green-200 dark:border-green-700 hover:border-green-400 dark:hover:border-green-500 transition-all cursor-pointer group">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Multiplayer</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Compete with friends in real-time historical challenges
                </p>
                <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <li>• Race against other players</li>
                  <li>• Bonus points for speed</li>
                  <li>• Real-time competition</li>
                </ul>
                <Button
                  onClick={() => onModeSelect("multiplayer")}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Join Competition
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

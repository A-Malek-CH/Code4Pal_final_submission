"use client"

import { Trophy, Target, Zap, Clock, Star, TrendingUp } from "lucide-react"
import { useGamification } from "../hooks/use-gamification"
import { Card, CardContent } from "./ui/card"

export function UserStats() {
  const { user, achievements } = useGamification()

  const unlockedAchievements = achievements.filter((a) => a.isUnlocked).length
  const winRate = user.totalGamesPlayed > 0 ? Math.round((user.gamesWon / user.totalGamesPlayed) * 100) : 0
  const avgTimePerGame = user.totalGamesPlayed > 0 ? Math.round(user.totalPlayTime / user.totalGamesPlayed) : 0

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
        <CardContent className="p-4 text-center">
          <Star className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
          <div className="text-2xl font-bold text-yellow-800">{user.xp}</div>
          <div className="text-xs text-yellow-600">XP</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardContent className="p-4 text-center">
          <Trophy className="h-6 w-6 mx-auto mb-2 text-green-600" />
          <div className="text-2xl font-bold text-green-800">{user.gamesWon}</div>
          <div className="text-xs text-green-600">Wins</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-4 text-center">
          <Target className="h-6 w-6 mx-auto mb-2 text-blue-600" />
          <div className="text-2xl font-bold text-blue-800">{winRate}%</div>
          <div className="text-xs text-blue-600">Win Rate</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardContent className="p-4 text-center">
          <Zap className="h-6 w-6 mx-auto mb-2 text-purple-600" />
          <div className="text-2xl font-bold text-purple-800">{user.currentStreak}</div>
          <div className="text-xs text-purple-600">Streak</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardContent className="p-4 text-center">
          <Clock className="h-6 w-6 mx-auto mb-2 text-orange-600" />
          <div className="text-2xl font-bold text-orange-800">{formatTime(avgTimePerGame)}</div>
          <div className="text-xs text-orange-600">Avg Time</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
        <CardContent className="p-4 text-center">
          <TrendingUp className="h-6 w-6 mx-auto mb-2 text-pink-600" />
          <div className="text-2xl font-bold text-pink-800">{unlockedAchievements}</div>
          <div className="text-xs text-pink-600">Achievements</div>
        </CardContent>
      </Card>
    </div>
  )
}

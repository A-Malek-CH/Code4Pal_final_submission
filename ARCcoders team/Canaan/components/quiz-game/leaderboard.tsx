"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award } from "lucide-react"
import { getLeaderboard, type ScoreRecord } from "@/lib/supabase/quiz-supabase"

export function Leaderboard() {
  const [scores, setScores] = useState<ScoreRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard()
        setScores(data)
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  if (isLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">Loading...</p>
        </CardContent>
      </Card>
    )
  }

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-5 h-5 text-yellow-500" />
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 2:
        return <Award className="w-5 h-5 text-amber-600" />
      default:
        return (
          <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">#{index + 1}</span>
        )
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {scores.length === 0 ? (
          <p className="text-center text-gray-500">No scores yet!</p>
        ) : (
          scores.map((score, index) => (
            <div
              key={score.id}
              className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
            >
              <div className="flex items-center gap-3">
                {getRankIcon(index)}
                <div>
                  <p className="font-medium text-sm">{score.player_name}</p>
                  <p className="text-xs text-gray-500">Level {score.level}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge
                  variant={score.percentage >= 80 ? "default" : score.percentage >= 50 ? "secondary" : "destructive"}
                >
                  {score.percentage.toFixed(1)}%
                </Badge>
                <p className="text-xs text-gray-500">
                  {score.score}/{score.total_questions}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

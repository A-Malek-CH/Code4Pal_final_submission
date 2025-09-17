"use client"

import { Heart, Clock } from "lucide-react"
import { useGamification } from "../hooks/use-gamification"
import { Card, CardContent } from "./ui/card"
import { useEffect, useState } from "react"

export function HeartsDisplay() {
  const { user, getTimeUntilNextHeart } = useGamification()
  const [timeLeft, setTimeLeft] = useState(getTimeUntilNextHeart())

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeUntilNextHeart())
    }, 1000)

    return () => clearInterval(interval)
  }, [getTimeUntilNextHeart])

  const formatTime = (time: { hours: number; minutes: number; seconds: number } | null) => {
    if (!time) return null

    if (time.hours > 0) {
      return `${time.hours}h ${time.minutes}m`
    } else if (time.minutes > 0) {
      return `${time.minutes}m ${time.seconds}s`
    } else {
      return `${time.seconds}s`
    }
  }

  return (
    <Card className="bg-white shadow-lg border-2 border-red-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: 3 }, (_, i) => (
                <Heart
                  key={i}
                  className={`h-6 w-6 ${i < user.hearts ? "fill-red-500 text-red-500" : "fill-gray-200 text-gray-200"}`}
                />
              ))}
            </div>
            <span className="font-semibold text-lg">{user.hearts}/3</span>
          </div>

          {timeLeft && user.hearts < 3 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Next heart: {formatTime(timeLeft)}</span>
            </div>
          )}
        </div>

        {user.hearts === 0 && (
          <div className="mt-2 text-sm text-red-600 font-medium">
            No hearts left! Wait for regeneration or earn more hearts.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import { useState, useEffect, useCallback } from "react"

// Types based on the Prisma schema
export interface User {
  id: string
  username: string
  email: string
  xp: number
  hearts: number
  heartRegenerationTime: Date | null
  totalGamesPlayed: number
  gamesWon: number
  gamesLost: number
  currentStreak: number
  longestStreak: number
  averageScore: number
  totalPlayTime: number
  createdAt: Date
  lastActiveAt: Date
}

export interface Achievement {
  id: string
  name: string
  description: string
  category: string
  xpBonus: number
  rarity: "common" | "rare" | "epic" | "legendary"
  isUnlocked: boolean
  unlockedAt?: Date
}

export interface Reward {
  id: string
  name: string
  description: string
  type: string
  value: number
  rarity: "common" | "rare" | "epic" | "legendary"
}

export interface RewardBox {
  id: string
  name: string
  type: "bronze" | "silver" | "gold" | "diamond"
  description: string
  cost: number
  rewards: Reward[]
  isOpened: boolean
  earnedAt?: Date
  openedAt?: Date
}

export interface GameResult {
  id: string
  gameType: string
  level: number
  basePoints: number
  finalPoints: number
  timeSpent: number
  correctAnswers: number
  totalQuestions: number
  isWin: boolean
  isPerfectGame: boolean
  speedBonus: number
  firstAttemptBonus: number
  perfectGameBonus: number
  playedAt: Date
}

export interface Challenge {
  id: string
  name: string
  description: string
  type: "points" | "games" | "streak" | "speed" | "perfect"
  target: number
  progress: number
  isCompleted: boolean
  completedAt?: Date
  reward: Achievement
  variant: "daily" | "periodic"
  date?: Date
  startDate?: Date
  endDate?: Date
}

export interface DailyReward {
  id: string
  day: number
  reward: {
    type: "xp" | "hearts" | "box"
    value: number
    boxType?: "bronze" | "silver" | "gold" | "diamond"
  }
  isClaimed: boolean
  claimedAt?: Date
}

const HEART_REGENERATION_TIME = 2 * 60 * 60 * 1000 // 2 hours in milliseconds
const MAX_HEARTS = 3

const defaultUser: User = {
  id: "default-user",
  username: "Player",
  email: "",
  xp: 0,
  hearts: MAX_HEARTS,
  heartRegenerationTime: null,
  totalGamesPlayed: 0,
  gamesWon: 0,
  gamesLost: 0,
  currentStreak: 0,
  longestStreak: 0,
  averageScore: 0,
  totalPlayTime: 0,
  createdAt: new Date(),
  lastActiveAt: new Date(),
}

const defaultAchievements: Achievement[] = [
  {
    id: "first-win",
    name: "First Victory",
    description: "Win your first game",
    category: "milestone",
    xpBonus: 50,
    rarity: "common",
    isUnlocked: false,
  },
  {
    id: "streak-5",
    name: "Hot Streak",
    description: "Win 5 games in a row",
    category: "streak",
    xpBonus: 100,
    rarity: "rare",
    isUnlocked: false,
  },
  {
    id: "perfect-game",
    name: "Perfectionist",
    description: "Complete a perfect game",
    category: "performance",
    xpBonus: 75,
    rarity: "rare",
    isUnlocked: false,
  },
  {
    id: "speed-demon",
    name: "Speed Demon",
    description: "Complete a game in under 60 seconds",
    category: "speed",
    xpBonus: 80,
    rarity: "rare",
    isUnlocked: false,
  },
  {
    id: "games-played-10",
    name: "Getting Started",
    description: "Play 10 games",
    category: "milestone",
    xpBonus: 30,
    rarity: "common",
    isUnlocked: false,
  },
  {
    id: "games-played-50",
    name: "Dedicated Player",
    description: "Play 50 games",
    category: "milestone",
    xpBonus: 150,
    rarity: "epic",
    isUnlocked: false,
  },
  {
    id: "xp-master",
    name: "XP Master",
    description: "Reach 1000 XP",
    category: "progression",
    xpBonus: 200,
    rarity: "legendary",
    isUnlocked: false,
  },
]

export function useGamification() {
  const [user, setUser] = useState<User>(defaultUser)
  const [achievements, setAchievements] = useState<Achievement[]>(defaultAchievements)
  const [gameResults, setGameResults] = useState<GameResult[]>([])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [dailyRewards, setDailyRewards] = useState<DailyReward[]>([])
  const [rewardBoxes, setRewardBoxes] = useState<RewardBox[]>([])

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("gamification-user")
      const savedAchievements = localStorage.getItem("gamification-achievements")
      const savedGameResults = localStorage.getItem("gamification-game-results")
      const savedChallenges = localStorage.getItem("gamification-challenges")
      const savedDailyRewards = localStorage.getItem("gamification-daily-rewards")
      const savedRewardBoxes = localStorage.getItem("gamification-reward-boxes")

      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser)
          // Convert date strings back to Date objects
          parsedUser.heartRegenerationTime = parsedUser.heartRegenerationTime
            ? new Date(parsedUser.heartRegenerationTime)
            : null
          parsedUser.createdAt = new Date(parsedUser.createdAt)
          parsedUser.lastActiveAt = new Date(parsedUser.lastActiveAt)
          setUser(parsedUser)
        } catch (e) {
          console.error("Failed to load user data:", e)
        }
      }

      if (savedAchievements) {
        try {
          setAchievements(JSON.parse(savedAchievements))
        } catch (e) {
          console.error("Failed to load achievements:", e)
        }
      }

      if (savedGameResults) {
        try {
          const parsedResults = JSON.parse(savedGameResults)
          parsedResults.forEach((result: GameResult) => {
            result.playedAt = new Date(result.playedAt)
          })
          setGameResults(parsedResults)
        } catch (e) {
          console.error("Failed to load game results:", e)
        }
      }

      if (savedChallenges) {
        try {
          setChallenges(JSON.parse(savedChallenges))
        } catch (e) {
          console.error("Failed to load challenges:", e)
        }
      }

      if (savedDailyRewards) {
        try {
          setDailyRewards(JSON.parse(savedDailyRewards))
        } catch (e) {
          console.error("Failed to load daily rewards:", e)
        }
      }

      if (savedRewardBoxes) {
        try {
          setRewardBoxes(JSON.parse(savedRewardBoxes))
        } catch (e) {
          console.error("Failed to load reward boxes:", e)
        }
      }
    }
  }, [])

  // Save data to localStorage whenever state changes
  const saveToStorage = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("gamification-user", JSON.stringify(user))
      localStorage.setItem("gamification-achievements", JSON.stringify(achievements))
      localStorage.setItem("gamification-game-results", JSON.stringify(gameResults))
      localStorage.setItem("gamification-challenges", JSON.stringify(challenges))
      localStorage.setItem("gamification-daily-rewards", JSON.stringify(dailyRewards))
      localStorage.setItem("gamification-reward-boxes", JSON.stringify(rewardBoxes))
    }
  }, [user, achievements, gameResults, challenges, dailyRewards, rewardBoxes])

  useEffect(() => {
    saveToStorage()
  }, [saveToStorage])

  // Heart regeneration logic
  const updateHearts = useCallback(() => {
    setUser((prevUser) => {
      if (prevUser.hearts >= MAX_HEARTS) {
        return { ...prevUser, heartRegenerationTime: null }
      }

      const now = new Date()

      if (!prevUser.heartRegenerationTime) {
        // Start regeneration timer
        return {
          ...prevUser,
          heartRegenerationTime: new Date(now.getTime() + HEART_REGENERATION_TIME),
        }
      }

      // Check if it's time to regenerate a heart
      if (now >= prevUser.heartRegenerationTime) {
        const newHearts = Math.min(prevUser.hearts + 1, MAX_HEARTS)
        const newRegenerationTime = newHearts < MAX_HEARTS ? new Date(now.getTime() + HEART_REGENERATION_TIME) : null

        return {
          ...prevUser,
          hearts: newHearts,
          heartRegenerationTime: newRegenerationTime,
        }
      }

      return prevUser
    })
  }, [])

  // Update hearts every minute
  useEffect(() => {
    updateHearts()
    const interval = setInterval(updateHearts, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [updateHearts])

  const canPlayGame = useCallback(() => {
    return user.hearts > 0
  }, [user.hearts])

  const consumeHeart = useCallback(() => {
    if (user.hearts > 0) {
      setUser((prevUser) => ({
        ...prevUser,
        hearts: prevUser.hearts - 1,
        heartRegenerationTime: prevUser.heartRegenerationTime || new Date(Date.now() + HEART_REGENERATION_TIME),
      }))
      return true
    }
    return false
  }, [user.hearts])

  const addXP = useCallback((amount: number) => {
    setUser((prevUser) => ({
      ...prevUser,
      xp: prevUser.xp + amount,
    }))
  }, [])

  const recordGameResult = useCallback(
    (result: Omit<GameResult, "id" | "playedAt">) => {
      const gameResult: GameResult = {
        ...result,
        id: `game-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        playedAt: new Date(),
      }

      setGameResults((prev) => [...prev, gameResult])

      // Update user statistics
      setUser((prevUser) => {
        const newTotalGames = prevUser.totalGamesPlayed + 1
        const newGamesWon = result.isWin ? prevUser.gamesWon + 1 : prevUser.gamesWon
        const newGamesLost = !result.isWin ? prevUser.gamesLost + 1 : prevUser.gamesLost

        let newCurrentStreak = prevUser.currentStreak
        let newLongestStreak = prevUser.longestStreak

        if (result.isWin) {
          newCurrentStreak += 1
          newLongestStreak = Math.max(newLongestStreak, newCurrentStreak)
        } else {
          newCurrentStreak = 0
        }

        const totalScore = gameResults.reduce((sum, gr) => sum + gr.finalPoints, 0) + result.finalPoints
        const newAverageScore = totalScore / newTotalGames

        return {
          ...prevUser,
          totalGamesPlayed: newTotalGames,
          gamesWon: newGamesWon,
          gamesLost: newGamesLost,
          currentStreak: newCurrentStreak,
          longestStreak: newLongestStreak,
          averageScore: newAverageScore,
          totalPlayTime: prevUser.totalPlayTime + result.timeSpent,
          lastActiveAt: new Date(),
        }
      })

      // Add XP for the game
      addXP(result.finalPoints)

      // Check for achievements
      checkAchievements(gameResult)

      return gameResult
    },
    [gameResults, addXP],
  )

  const checkAchievements = useCallback(
    (gameResult: GameResult) => {
      setAchievements((prevAchievements) => {
        return prevAchievements.map((achievement) => {
          if (achievement.isUnlocked) return achievement

          let shouldUnlock = false

          switch (achievement.id) {
            case "first-win":
              shouldUnlock = gameResult.isWin
              break
            case "streak-5":
              shouldUnlock = user.currentStreak >= 5
              break
            case "perfect-game":
              shouldUnlock = gameResult.isPerfectGame
              break
            case "speed-demon":
              shouldUnlock = gameResult.timeSpent < 60
              break
            case "games-played-10":
              shouldUnlock = user.totalGamesPlayed >= 10
              break
            case "games-played-50":
              shouldUnlock = user.totalGamesPlayed >= 50
              break
            case "xp-master":
              shouldUnlock = user.xp >= 1000
              break
          }

          if (shouldUnlock) {
            addXP(achievement.xpBonus)
            return {
              ...achievement,
              isUnlocked: true,
              unlockedAt: new Date(),
            }
          }

          return achievement
        })
      })
    },
    [user, addXP],
  )

  const getTimeUntilNextHeart = useCallback(() => {
    if (!user.heartRegenerationTime || user.hearts >= MAX_HEARTS) {
      return null
    }

    const now = new Date()
    const timeLeft = user.heartRegenerationTime.getTime() - now.getTime()

    if (timeLeft <= 0) {
      return null
    }

    const hours = Math.floor(timeLeft / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

    return { hours, minutes, seconds, totalMs: timeLeft }
  }, [user.heartRegenerationTime, user.hearts])

  return {
    user,
    achievements,
    gameResults,
    challenges,
    dailyRewards,
    rewardBoxes,
    canPlayGame,
    consumeHeart,
    addXP,
    recordGameResult,
    getTimeUntilNextHeart,
    updateHearts,
  }
}

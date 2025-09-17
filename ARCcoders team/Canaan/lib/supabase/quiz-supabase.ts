import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type ScoreRecord = {
  id?: string
  player_name: string
  level: number
  score: number
  total_questions: number
  percentage: number
  completed_at?: string
  session_id?: string
  is_multiplayer?: boolean
}

export async function saveScore(scoreData: Omit<ScoreRecord, "id" | "completed_at">) {
  const { data, error } = await supabase.from("scores").insert([scoreData]).select()

  if (error) {
    console.error("Error saving score:", error)
    throw error
  }

  return data[0]
}

export async function getPlayerScores(playerName: string) {
  const { data, error } = await supabase
    .from("scores")
    .select("*")
    .eq("player_name", playerName)
    .order("completed_at", { ascending: false })

  if (error) {
    console.error("Error fetching scores:", error)
    throw error
  }

  return data
}

export async function getLeaderboard(level?: number) {
  let query = supabase
    .from("scores")
    .select("*")
    .order("percentage", { ascending: false })
    .order("completed_at", { ascending: true })
    .limit(10)

  if (level) {
    query = query.eq("level", level)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching leaderboard:", error)
    throw error
  }

  return data
}

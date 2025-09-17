import { supabase } from "@/lib/supabase/supabase"; // Adjust to your client path
import { UserGameStats } from "@prisma/client";

/**
 * Fetches a user's game stats for a specific game type.
 * If no stats exist, it returns a default initial state.
 * @param userId The ID of the authenticated user.
 * @param gameType The type of game (e.g., 'quiz', 'bingo').
 * @returns A promise that resolves to the UserGameStats object.
 */
export const fetchUserGameStats = async (
	userId: string,
	gameType: string
): Promise<UserGameStats> => {
	// --- NEW: Step 1: Call the regeneration function first ---
	// We don't need to wait for it or check its result. It's a "fire-and-forget"
	// operation that ensures the database state is correct before we read it.
	const { error: regenError } = await supabase.rpc("regenerate_hearts", {
		p_user_id: userId,
		p_game_type: gameType,
	});

	if (regenError) {
		console.warn("Could not check for heart regeneration:", regenError.message);
		// We don't throw an error here, as the game can still proceed.
	}
	const { data, error } = await supabase
		.from("user_game_stats")
		.select("*")
		.eq("user_id", userId)
		.eq("game_type", gameType)
		.single();

	if (error && error.code !== "PGRST116") {
		// PGRST116 means no rows found, which is okay
		console.error("Error fetching user game stats:", error);
		throw new Error(error.message);
	}

	// If no record is found, return a default object.
	// This prevents the UI from breaking on a user's first game.
	if (!data) {
		const now = new Date();
		return {
			id: "", // No ID since it doesn't exist yet
			user_id: userId,
			game_type: gameType,
			total_games_played: 0,
			total_wins: 0,
			total_losses: 0,
			best_score: 0,
			total_score: 0,
			average_score: 0,
			fastest_time: 9999, // A high number for initial fastest time
			current_win_streak: 0,
			longest_win_streak: 0,
			current_daily_streak: 0,
			longest_daily_streak: 0,
			last_played_date: null,
			hearts: 3, // Default starting hearts
			heart_regeneration_time: null,
			created_at: now,
			updated_at: now,
			total_perfect_games: 0,
		};
	}

	return data as UserGameStats;
};

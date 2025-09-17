import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/supabase"; // Adjust path
import type { GameRecord } from "@/types/quiz"; // Adjust path

/**
 * Fetches a single random game, optionally filtered by type.
 * @param {string} [type] - The type of game to fetch (e.g., 'quiz'). If undefined, fetches any type.
 * @returns {Promise<GameRecord>} A promise that resolves to a single game record.
 */
const fetchRandomGame = async (type?: string): Promise<GameRecord> => {
	// We pass the parameter to the RPC function in the second argument.
	// The key 'game_type' must match the parameter name in our SQL function.
	const { data, error } = await supabase
		.rpc("get_random_game", { game_type: type }) // Pass type as a parameter
		.single();

	if (error) {
		console.error(`Error fetching random game (type: ${type}):`, error);
		throw new Error(error.message);
	}

	if (!data) {
		throw new Error("No game was found matching the criteria.");
	}

	return data as GameRecord;
};

/**
 * A React Query hook to fetch a random game, with an optional filter for game type.
 * @param {string} [type] - The type of game to fetch (e.g., 'quiz', 'timeline').
 */
export const useRandomGame = (type?: string) => {
	return useQuery<GameRecord, Error>({
		// IMPORTANT: The query key MUST include the type.
		// This ensures that `useRandomGame('quiz')` and `useRandomGame()` are cached separately.
		// If the type changes, TanStack Query will automatically trigger a refetch.
		queryKey: ["randomGame", type],

		// The query function now receives the type from the queryKey.
		queryFn: ({ queryKey }) => {
			const [, gameType] = queryKey; // queryKey is ['randomGame', type]
			return fetchRandomGame(gameType as string | undefined);
		},

		// Optional configs from before, still highly relevant.
		refetchOnWindowFocus: false,
		staleTime: 1000 * 60, // Consider the game fresh for 1 minute
		retry: 1,
		refetchOnMount: false,
		refetchOnReconnect: false,
	});
};

"use client";

import React, {
	createContext,
	useContext,
	ReactNode,
	useCallback,
} from "react";
import { usePathname } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserGameStats } from "@prisma/client";
import { useAuth } from "@/components/firebase-auth/AuthContext"; // Adjust to your auth hook
import { fetchUserGameStats } from "@/lib/supabase/game-stats";
import { Loader } from "@/components/ui/loader";

// Define the shape of the data provided by the context
type UserGameStatsContextType = {
	stats: UserGameStats | null;
	isLoading: boolean;
	isError: boolean;
	canPlay: boolean; // <-- Add to context value

	refetchStats: () => void; // A function to manually trigger a refetch
};

const UserGameStatsContext = createContext<
	UserGameStatsContextType | undefined
>(undefined);

// A helper to extract the game type from the URL
const getGameTypeFromPath = (pathname: string): string | null => {
	const segments = pathname.split("/");
	if (segments.length > 2 && segments[1] === "games") {
		// e.g., /games/quiz -> 'quiz'
		return segments[2];
	}
	return null;
};

export const UserGameStatsProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const { user } = useAuth();
	const pathname = usePathname();
	const queryClient = useQueryClient();

	const gameType = getGameTypeFromPath(pathname);

	const {
		data: stats,
		isLoading,
		isError,
	} = useQuery<UserGameStats, Error>({
		// CRITICAL: The query key includes the user ID and the game type.
		// When the user navigates from /games/quiz to /games/bingo,
		// this key changes, and react-query automatically fetches the new stats.
		queryKey: ["userGameStats", user?.id, gameType],

		// The function to fetch the data
		queryFn: () => fetchUserGameStats(user!.id, gameType!),

		// This query should only run if we have a user and a valid game type from the URL
		enabled: !!user && !!gameType,

		// Optional: Stats don't change unless a game is played, so we can make them stale less often.
		staleTime: 1000 * 60 * 5, // 5 minutes
		refetchOnWindowFocus: false,
	});
	const canPlay = !stats || stats.hearts > 0;

	// Function to allow child components to invalidate this query and force a refetch
	// (e.g., after a game ends).
	const refetchStats = useCallback(() => {
		queryClient.invalidateQueries({
			queryKey: ["userGameStats", user?.id, gameType],
		});
	}, [queryClient, user, gameType]);

	const contextValue: UserGameStatsContextType = {
		stats: stats || null,
		isLoading,
		canPlay, // <-- Add to context value

		isError,
		refetchStats,
	};

	return (
		<UserGameStatsContext.Provider value={contextValue}>
			{children}
		</UserGameStatsContext.Provider>
	);
};

// The custom hook that components will use to access the stats
export const useUserGameStats = (): UserGameStatsContextType => {
	const context = useContext(UserGameStatsContext);
	if (context === undefined) {
		throw new Error(
			"useUserGameStats must be used within a UserGameStatsProvider"
		);
	}
	return context;
};

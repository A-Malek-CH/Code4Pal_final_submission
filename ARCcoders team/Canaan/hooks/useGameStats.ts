"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/supabase";
import { toast } from "sonner";
import { UserGameStats } from "@prisma/client";

const gameStatsKey = "gameStats";
const userAchievementsKey = "userAchievements";

// Fetch user game stats
export const useGetUserGameStats = (userId: string, gameType: string) => {
	return useQuery({
		queryKey: [gameStatsKey, userId, gameType],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("user_game_stats")
				.select("*")
				.eq("user_id", userId)
				.eq("game_type", gameType)
				.single();

			if (error && error.code !== "PGRST116") {
				// Ignore 'no rows found' error
				throw new Error(error.message);
			}
			return data as UserGameStats | null;
		},
		enabled: !!userId,
	});
};

// Decrease heart
export const useDecreaseHeart = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			userId,
			gameType,
		}: {
			userId: string;
			gameType: string;
		}) => {
			// This would ideally be an RPC call to prevent cheating
			const { data: currentStats } = await supabase
				.from("user_game_stats")
				.select("hearts")
				.eq("user_id", userId)
				.eq("game_type", gameType)
				.single();
			if (!currentStats || currentStats.hearts <= 0) {
				throw new Error("No hearts left.");
			}

			const { error } = await supabase
				.from("user_game_stats")
				.update({ hearts: currentStats.hearts - 1 })
				.eq("user_id", userId)
				.eq("game_type", gameType);

			if (error) throw new Error(error.message);
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: [gameStatsKey, variables.userId, variables.gameType],
			});
			toast.success("You lost a heart. Be careful!");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};

// Increase points (XP)
export const useIncreasePoints = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			userId,
			gameType,
			points,
		}: {
			userId: string;
			gameType: string;
			points: number;
		}) => {
			// This should be an RPC call in a real app
			const { data: currentStats } = await supabase
				.from("user_game_stats")
				.select("total_score")
				.eq("user_id", userId)
				.eq("game_type", gameType)
				.single();
			const newTotalScore = (currentStats?.total_score || 0) + points;

			const { error } = await supabase
				.from("user_game_stats")
				.update({ total_score: newTotalScore })
				.eq("user_id", userId)
				.eq("game_type", gameType);

			if (error) throw new Error(error.message);
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: [gameStatsKey, variables.userId, variables.gameType],
			});
			toast.success(`You earned ${variables.points} points!`);
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};

// Grant an achievement
export const useGrantAchievement = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			userId,
			achievementId,
		}: {
			userId: string;
			achievementId: string;
		}) => {
			const { error } = await supabase
				.from("user_achievement")
				.insert({ user_id: userId, achievement_id: achievementId });
			if (error) {
				// Ignore duplicate errors
				if (error.code === "23505") {
					console.log("Achievement already granted.");
					return;
				}
				throw new Error(error.message);
			}
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: [userAchievementsKey, variables.userId],
			});
			// You might want to fetch achievement details to show in the toast
			toast.success(" Achievement Unlocked, Congratulations!");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};

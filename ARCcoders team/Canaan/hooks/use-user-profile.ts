"use client";

import { supabase } from "@/lib/supabase/supabase";
import { useQuery } from "@tanstack/react-query";

// --- Define our data structures ---

// Type for the details of an achievement
type AchievementDetails = {
	id: string;
	name: string;
	description: string;
	icon: string;
	xp_bonus: number;
};

// Type for a user's earned achievement, including the details
type UserAchievement = {
	created_at: string;
	achievement: AchievementDetails;
};

// Type for the details of a reward box
type RewardBoxDetails = {
	id: string;
	name: string;
	description: string;
	icon: string;
};

// Type for a user's reward box, including details and status
type UserRewardBox = {
	id: string;
	is_opened: boolean;
	earned_at: string;
	reward_box: RewardBoxDetails;
};

// Type for game stats
type UserGameStats = {
	game_type: string;
	total_games_played: number;
	total_wins: number;
	best_score: number;
	current_win_streak: number;
};

// The main, comprehensive user profile type
export type UserProfileWithDetails = {
	id: string;
	display_name: string;
	email: string;
	photo_url: string | null;
	xp: number;
	user_game_stats: UserGameStats[];
	user_achievement: UserAchievement[];
	user_reward_box: UserRewardBox[];
};

// The updated fetching function
async function fetchUserProfileWithDetails(
	userId: string
): Promise<UserProfileWithDetails | null> {
	const { data, error } = await supabase
		.from("user")
		.select(
			`
      id,
      display_name,
      email,
      photo_url,
      xp,
      user_game_stats (
        game_type,
        total_games_played,
        total_wins,
        best_score,
        current_win_streak
      ),
      user_achievement (
        created_at,
        achievement (
          id,
          name,
          description,
          icon,
          xp_bonus
        )
      ),
      user_reward_box (
        id,
        is_opened,
        earned_at,
        reward_box (
          id,
          name,
          description,
          icon
        )
      )
    `
		)
		.eq("id", userId)
		.single();
	console.log("🚀 ~ fetchUserProfileWithDetails ~ data:", data);

	if (error) {
		console.error("Supabase fetch user details error:", error);
		throw new Error(error.message);
	}

	return data as any;
}

// The custom hook remains structurally the same
export function useUserProfile(userId: string) {
	return useQuery({
		queryKey: ["userProfile", userId],
		queryFn: () => fetchUserProfileWithDetails(userId),
		enabled: !!userId,
	});
}

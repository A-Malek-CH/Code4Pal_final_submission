"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/supabase";

type Challenge = any;
type NewChallenge = any;
type UserChallengeProgress = any;

import { toast } from "sonner";

const challengeKey = "challenges";
const userChallengeProgressKey = "userChallengeProgress";

// Fetch all challenges
export const useGetChallenges = () => {
	return useQuery({
		queryKey: [challengeKey],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("challenge")
				.select("*")
				.order("created_at", { ascending: false });

			if (error) throw new Error(error.message);
			return data as Challenge[];
		},
	});
};

// Create a new challenge
export const useCreateChallenge = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (newChallenge: NewChallenge) => {
			const { error } = await supabase.from("challenge").insert(newChallenge);
			if (error) throw new Error(error.message);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [challengeKey] });
			toast.success("Challenge created successfully.");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};

// Update a challenge
export const useUpdateChallenge = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			id,
			...updateData
		}: Partial<NewChallenge> & { id: string }) => {
			const { error } = await supabase
				.from("challenge")
				.update(updateData)
				.eq("id", id);
			if (error) throw new Error(error.message);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [challengeKey] });
			toast.success("Challenge updated successfully.");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};

// Delete a challenge
export const useDeleteChallenge = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const { error } = await supabase.from("challenge").delete().eq("id", id);
			if (error) throw new Error(error.message);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [challengeKey] });
			toast("Challenge deleted successfully.");
		},
		onError: (error) => {
			toast(error.message);
		},
	});
};

// --- User-facing hooks ---

// Fetch user's challenge progress
export const useGetUserChallenges = (userId: string) => {
	return useQuery({
		queryKey: [userChallengeProgressKey, userId],
		queryFn: async () => {
			// A better way is an RPC call `get_user_challenges_with_progress(user_id)`.
			// For now, fetch all active challenges and merge with user progress.
			const { data: challenges, error: challengesError } = await supabase
				.from("challenge")
				.select("*")
				.eq("is_active", true);
			if (challengesError) throw new Error(challengesError.message);

			if (!challenges) return [];

			// Fetch user progress for those challenges
			const { data: progress, error: progressError } = await supabase
				.from("user_challenge_progress")
				.select("*")
				.eq("user_id", userId)
				.in(
					"challenge_id",
					challenges.map((c) => c.id)
				);
			if (progressError) throw new Error(progressError.message);

			// Merge them
			// FIX: Cast progress to the correct type to avoid `unknown` type errors on lines 111 and 112.
			const progressMap = new Map(
				(progress as UserChallengeProgress[] | null)?.map((p) => [
					p.challenge_id,
					p,
				])
			);

			return challenges.map((challenge) => ({
				...challenge,
				progress: progressMap.get(challenge.id)?.progress ?? 0,
				is_completed: progressMap.get(challenge.id)?.is_completed ?? false,
			}));
		},
		enabled: !!userId,
	});
};

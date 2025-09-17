"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/supabase";
import { RewardBox, NewRewardBox, UserRewardBox } from "@/types/database.types";
import { toast } from "sonner";

const rewardBoxKey = "rewardBoxes";
const userRewardBoxKey = "userRewardBoxes";

// Fetch all reward boxes
export const useGetRewardBoxes = () => {
	return useQuery({
		queryKey: [rewardBoxKey],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("reward_box")
				.select("*")
				.order("created_at", { ascending: false });

			if (error) throw new Error(error.message);
			return data as RewardBox[];
		},
	});
};

// Create a new reward box
export const useCreateRewardBox = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (newRewardBox: NewRewardBox) => {
			const { error } = await supabase.from("reward_box").insert(newRewardBox);
			if (error) throw new Error(error.message);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [rewardBoxKey] });
			toast.success("Reward Box created successfully.");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};

// Update a reward box
export const useUpdateRewardBox = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			id,
			...updateData
		}: Partial<NewRewardBox> & { id: string }) => {
			const { error } = await supabase
				.from("reward_box")
				.update(updateData)
				.eq("id", id);
			if (error) throw new Error(error.message);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [rewardBoxKey] });
			toast.success("Reward Box updated successfully.");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};

// Delete a reward box
export const useDeleteRewardBox = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const { error } = await supabase.from("reward_box").delete().eq("id", id);
			if (error) throw new Error(error.message);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [rewardBoxKey] });
			toast.success("Reward Box deleted successfully.");
		},
		onError: (error) => {
			toast(error.message);
		},
	});
};

// --- User-facing hooks ---

// Fetch user's reward boxes
export const useGetUserRewardBoxes = (userId: string) => {
	return useQuery({
		queryKey: [userRewardBoxKey, userId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("user_reward_box")
				.select(
					`
                    *,
                    reward_box (*)
                `
				)
				.eq("user_id", userId)
				.order("earned_at", { ascending: false });

			if (error) throw new Error(error.message);
			return data as (UserRewardBox & { reward_box: RewardBox })[];
		},
		enabled: !!userId,
	});
};

// Open a reward box
export const useOpenRewardBox = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			userId,
			userRewardBoxId,
		}: {
			userId: string;
			userRewardBoxId: string;
		}) => {
			// This should be an RPC call `open_box(user_id, user_reward_box_id)` in a real app
			// to handle reward logic atomically on the server.

			// 1. Mark the box as opened
			const { error: updateError } = await supabase
				.from("user_reward_box")
				.update({ is_opened: true, opened_at: new Date().toISOString() })
				.eq("id", userRewardBoxId);

			if (updateError) throw new Error(updateError.message);
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: [userRewardBoxKey, variables.userId],
			});
			toast.success("Box Opened, You've received new rewards!");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};

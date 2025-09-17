"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/supabase";
import { Reward, NewReward } from "@/types/database.types";
import { toast } from "sonner";

const rewardKey = "rewards";

// Fetch all rewards
export const useGetRewards = () => {
	return useQuery({
		queryKey: [rewardKey],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("reward")
				.select("*")
				.order("created_at", { ascending: false });

			if (error) throw new Error(error.message);
			return data as Reward[];
		},
	});
};

// Create a new reward
export const useCreateReward = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (newReward: NewReward) => {
			const { error } = await supabase.from("reward").insert(newReward);
			if (error) throw new Error(error.message);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [rewardKey] });
			toast.success("Reward created successfully.");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};

// Update a reward
export const useUpdateReward = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			id,
			...updateData
		}: Partial<NewReward> & { id: string }) => {
			const { error } = await supabase
				.from("reward")
				.update(updateData)
				.eq("id", id);
			if (error) throw new Error(error.message);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [rewardKey] });
			toast.success("Reward updated successfully.");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};

// Delete a reward
export const useDeleteReward = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const { error } = await supabase.from("reward").delete().eq("id", id);
			if (error) throw new Error(error.message);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [rewardKey] });
			toast.success("Reward deleted successfully.");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};

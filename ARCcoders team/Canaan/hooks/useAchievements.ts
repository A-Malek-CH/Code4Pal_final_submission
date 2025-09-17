"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/supabase";
import { Achievement, NewAchievement } from "@/types/database.types";
import { toast } from "sonner";

const achievementKey = "achievements";

// Fetch all achievements
export const useGetAchievements = () => {
	return useQuery({
		queryKey: [achievementKey],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("achievement")
				.select("*")
				.order("created_at", { ascending: false });

			if (error) throw new Error(error.message);
			return data as Achievement[];
		},
	});
};

// Create a new achievement
export const useCreateAchievement = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (newAchievement: NewAchievement) => {
			const { error } = await supabase
				.from("achievement")
				.insert(newAchievement);
			if (error) throw new Error(error.message);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [achievementKey] });
			toast.success("Achievement created successfully.");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};

// Update an achievement
export const useUpdateAchievement = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			id,
			...updateData
		}: Partial<Achievement> & { id: string }) => {
			const { error } = await supabase
				.from("achievement")
				.update(updateData)
				.eq("id", id);
			if (error) throw new Error(error.message);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [achievementKey] });
			toast.success("Achievement updated successfully.");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};

// Delete an achievement
export const useDeleteAchievement = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const { error } = await supabase
				.from("achievement")
				.delete()
				.eq("id", id);
			if (error) throw new Error(error.message);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [achievementKey] });
			toast.success("Achievement deleted successfully.");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};

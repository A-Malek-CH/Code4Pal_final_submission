"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	achievementSchema,
	AchievementFormValues,
} from "@/schemas/achievement.schema";
import {
	useCreateAchievement,
	useUpdateAchievement,
} from "@/hooks/useAchievements";
import { Achievement } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AchievementFormProps {
	achievement: Omit<Achievement, "created_at" | "updated_at"> | null;
	onFinished: () => void;
}

export function AchievementForm({
	achievement,
	onFinished,
}: AchievementFormProps) {
	const isEditMode = !!achievement;
	const createMutation = useCreateAchievement();
	const updateMutation = useUpdateAchievement();

	const form = useForm<AchievementFormValues>({
		resolver: zodResolver(achievementSchema),
		defaultValues: {
			name: achievement?.name || "",
			description: achievement?.description || "",
			icon: achievement?.icon || "",
			xp_bonus: achievement?.xp_bonus || 0,
			criteria: achievement
				? JSON.stringify(achievement.criteria, null, 2)
				: "{}",
			category: achievement?.category || "",
		},
	});

	const onSubmit = (values: AchievementFormValues) => {
		if (isEditMode) {
			updateMutation.mutate(
				{ id: achievement.id, ...values },
				{
					onSuccess: onFinished,
				}
			);
		} else {
			createMutation.mutate(
				{ ...values, criteria: values.criteria as any },
				{
					onSuccess: onFinished,
				}
			);
		}
	};

	const isPending = createMutation.isPending || updateMutation.isPending;

	return (
		<div>
			<h2 className="text-2xl font-semibold mb-4">
				{isEditMode ? "Edit Achievement" : "Create New Achievement"}
			</h2>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input placeholder="First Win" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Awarded for winning your first game."
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="icon"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Icon URL</FormLabel>
								<FormControl>
									<Input
										placeholder="https://example.com/icon.png"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="xp_bonus"
						render={({ field }) => (
							<FormItem>
								<FormLabel>XP Bonus</FormLabel>
								<FormControl>
									<Input type="number" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="category"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Category</FormLabel>
								<FormControl>
									<Input placeholder="General" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="criteria"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Criteria (JSON)</FormLabel>
								<FormControl>
									<Textarea placeholder='{ "wins": 1 }' {...field} rows={5} />
								</FormControl>
								<FormDescription>
									The logic that triggers this achievement.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex space-x-4">
						<Button type="submit" disabled={isPending}>
							{isPending ? "Saving..." : "Save Achievement"}
						</Button>
						<Button type="button" variant="outline" onClick={onFinished}>
							Cancel
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}

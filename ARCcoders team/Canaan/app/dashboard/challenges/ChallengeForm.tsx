"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	challengeSchema,
	ChallengeFormValues,
} from "@/schemas/challenge.schema";
import { useCreateChallenge, useUpdateChallenge } from "@/hooks/useChallenges";
import { useGetAchievements } from "@/hooks/useAchievements";
// import { Challenge } from "@prisma/client";
type Challenge = any;
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

interface ChallengeFormProps {
	challenge: Challenge | null;
	onFinished: () => void;
}

export function ChallengeForm({ challenge, onFinished }: ChallengeFormProps) {
	const isEditMode = !!challenge;
	const createMutation = useCreateChallenge();
	const updateMutation = useUpdateChallenge();
	const { data: achievements } = useGetAchievements(); // For reward selection

	const form = useForm<ChallengeFormValues>({
		resolver: zodResolver(challengeSchema),
		defaultValues: {
			name: challenge?.name || "",
			description: challenge?.description || "",
			type: challenge?.type || "",
			target: challenge?.target || 1,
			reward_id: challenge?.reward_id || "",
			variant: (challenge?.variant as any) || "",
			is_active: challenge?.is_active ?? true,
		},
	});

	const onSubmit = (values: ChallengeFormValues) => {
		if (isEditMode) {
			updateMutation.mutate(
				{ id: challenge.id, ...values },
				{
					onSuccess: onFinished,
				}
			);
		} else {
			createMutation.mutate(values, {
				onSuccess: onFinished,
			});
		}
	};

	const isPending = createMutation.isPending || updateMutation.isPending;

	return (
		<div>
			<h2 className="text-2xl font-semibold mb-4">
				{isEditMode ? "Edit Challenge" : "Create New Challenge"}
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
									<Input placeholder="Win Streak" {...field} />
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
									<Textarea placeholder="Win 3 games in a row." {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="type"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Type</FormLabel>
								<FormControl>
									<Input placeholder="game_wins, points_earned" {...field} />
								</FormControl>
								<FormDescription>
									The internal key for tracking progress.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="target"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Target</FormLabel>
								<FormControl>
									<Input type="number" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="reward_id"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Reward (Achievement ID)</FormLabel>
								<FormControl>
									<select
										{...field}
										className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									>
										<option value="">Select a reward</option>
										{achievements?.map((ach) => (
											<option key={ach.id} value={ach.id}>
												{ach.name}
											</option>
										))}
									</select>
								</FormControl>
								<FormDescription>
									For now, challenges grant an achievement.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex space-x-4">
						<Button type="submit" disabled={isPending}>
							{isPending ? "Saving..." : "Save Challenge"}
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

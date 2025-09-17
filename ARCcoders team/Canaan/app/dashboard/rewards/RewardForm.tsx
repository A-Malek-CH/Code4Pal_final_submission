"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { rewardSchema, RewardFormValues } from "@/schemas/reward.schema";
import { useCreateReward, useUpdateReward } from "@/hooks/useRewards";
import { Reward } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface RewardFormProps {
	reward: Omit<Reward, "created_at" | "updated_at"> | null;
	onFinished: () => void;
}

export function RewardForm({ reward, onFinished }: RewardFormProps) {
	const isEditMode = !!reward;
	const createMutation = useCreateReward();
	const updateMutation = useUpdateReward();

	const form = useForm<RewardFormValues>({
		resolver: zodResolver(rewardSchema),
		defaultValues: {
			name: reward?.name || "",
			description: reward?.description || "",
			icon: reward?.icon || "",
			type: reward?.type || "",
		},
	});

	const onSubmit = (values: RewardFormValues) => {
		if (isEditMode) {
			updateMutation.mutate(
				{ id: reward.id, ...values },
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
				{isEditMode ? "Edit Reward" : "Create New Reward"}
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
									<Input placeholder="Gold Coins" {...field} />
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
										placeholder="A handful of shiny gold coins."
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
						name="type"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Type</FormLabel>
								<FormControl>
									<Input placeholder="Currency, Item, etc." {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex space-x-4">
						<Button type="submit" disabled={isPending}>
							{isPending ? "Saving..." : "Save Reward"}
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

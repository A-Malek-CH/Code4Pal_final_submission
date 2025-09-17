"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	rewardBoxSchema,
	RewardBoxFormValues,
} from "@/schemas/rewardBox.schema";
import { useCreateRewardBox, useUpdateRewardBox } from "@/hooks/useRewardBoxes";

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
import { RewardBox } from "@prisma/client";

interface RewardBoxFormProps {
	rewardBox: Omit<RewardBox, "created_at" | "updated_at"> | null;
	onFinished: () => void;
}

export function RewardBoxForm({ rewardBox, onFinished }: RewardBoxFormProps) {
	const isEditMode = !!rewardBox;
	const createMutation = useCreateRewardBox();
	const updateMutation = useUpdateRewardBox();

	const form = useForm<RewardBoxFormValues>({
		resolver: zodResolver(rewardBoxSchema),
		defaultValues: {
			name: rewardBox?.name || "",
			description: rewardBox?.description || "",
			type: rewardBox?.type || "",
			icon: rewardBox?.icon || "",
		},
	});

	const onSubmit = (values: RewardBoxFormValues) => {
		if (isEditMode) {
			updateMutation.mutate(
				{ id: rewardBox.id, ...values },
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
				{isEditMode ? "Edit Reward Box" : "Create New Reward Box"}
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
									<Input placeholder="Common Box" {...field} />
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
										placeholder="A common box with a chance for basic rewards."
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
									<Input placeholder="Common, Rare, Epic" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex space-x-4">
						<Button type="submit" disabled={isPending}>
							{isPending ? "Saving..." : "Save Box"}
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

import { z } from "zod";

export const rewardBoxSchema = z.object({
	id: z.string().uuid().optional(),
	icon: z.string().url("Must be a valid URL"),
	name: z.string().min(3, "Name must be at least 3 characters long"),
	description: z
		.string()
		.min(10, "Description must be at least 10 characters long"),
	type: z.string().min(1, "Type is required"),
});

export type RewardBoxFormValues = z.infer<typeof rewardBoxSchema>;

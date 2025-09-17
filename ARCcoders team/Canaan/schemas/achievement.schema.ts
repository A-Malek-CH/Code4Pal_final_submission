import { z } from "zod";

export const achievementSchema = z.object({
	id: z.string().uuid().optional(),
	name: z.string().min(3, "Name must be at least 3 characters long"),
	description: z
		.string()
		.min(10, "Description must be at least 10 characters long"),
	icon: z.string().url("Must be a valid URL"),
	xp_bonus: z.coerce.number().int().min(0, "XP bonus cannot be negative"),
	criteria: z
		.string()
		.refine(
			(val) => {
				try {
					JSON.parse(val);
					return true;
				} catch {
					return false;
				}
			},
			{ message: "Criteria must be valid JSON" }
		)
		.transform((val) => JSON.parse(val)),
	category: z.string().min(1, "Category is required"),
});

export type AchievementFormValues = z.infer<typeof achievementSchema>;

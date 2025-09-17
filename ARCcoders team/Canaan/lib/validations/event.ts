import { z } from "zod";

export const eventSchema = z
	.object({
		name: z
			.string()
			.min(1, "Event name is required")
			.max(200, "Event name must be less than 200 characters"),
		description: z
			.string()
			.min(20, "Event Description is required")
			.max(10000, "Event Description must be less than 10000 characters"),
		startDate: z.string().optional(),
		endDate: z.string().optional(),
		coordinates: z.string().optional(),
		tags: z.array(z.string()).default([]),
	})
	.refine(
		(data) => {
			if (data.startDate && data.endDate) {
				return new Date(data.startDate) <= new Date(data.endDate);
			}
			return true;
		},
		{
			message: "End date must be after start date",
			path: ["endDate"],
		}
	);

export type EventFormData = z.infer<typeof eventSchema>;

export const eventRelationshipSchema = z.object({
	sourceEventId: z.string().min(1, "Source event is required"),
	targetEventId: z.string().min(1, "Target event is required"),
	relationshipType: z.enum([
		"CAUSED",
		"LED_TO",
		"WAS_INFLUENCED_BY",
		"PRECEDED",
		"FOLLOWED",
		"CONCURRENT_WITH",
	]),
});

export type EventRelationshipFormData = z.infer<typeof eventRelationshipSchema>;

import { z } from "zod";

export const locationSchema = z.object({
	name: z
		.string()
		.min(1, "Location name is required")
		.max(200, "Location name must be less than 200 characters"),
	description: z
		.string()
		.min(20, "Location Description is required")
		.max(10000, "Location Description must be less than 10000 characters"),
	coordinates: z.string().optional(),
	country: z.string().optional(),
	region: z.string().optional(),
});

export type LocationFormData = z.infer<typeof locationSchema>;

export const locationLinkSchema = z.object({
	locationId: z.string().min(1, "Location is required"),
	eventId: z.string().min(1, "Event is required"),
	role: z
		.enum(["occurred_at", "affected", "origin", "destination", "transit"])
		.optional(),
});

export type LocationLinkFormData = z.infer<typeof locationLinkSchema>;

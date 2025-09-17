import { z } from "zod";

export const sourceSchema = z.object({
	title: z
		.string()
		.min(1, "Source title is required")
		.max(300, "Title must be less than 300 characters"),
	author: z.string(),
	type: z.enum([
		"book",
		"article",
		"document",
		"website",
		"manuscript",
		"newspaper",
		"journal",
		"archive",
	]),
	url: z.string().url("Must be a valid URL"),
	publish_date: z.string().optional(),
	content: z.string().min(100, "At least content has to be 100 character"),
});
export const sourceContentEmbeddingSchema = z.object({
	content: z.string().min(100, "At least content has to be 100 character"),
});
export type sourceContentEmbedding = z.infer<
	typeof sourceContentEmbeddingSchema
>;
export type SourceFormData = z.infer<typeof sourceSchema>;

export const sourceLinkSchema = z.object({
	sourceId: z.string().min(1, "Source is required"),
	eventId: z.string().min(1, "Event is required"),
	relevance: z
		.enum(["primary", "secondary", "reference", "supporting", "contradictory"])
		.optional(),
});

export type SourceLinkFormData = z.infer<typeof sourceLinkSchema>;

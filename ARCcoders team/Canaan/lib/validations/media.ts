import { z } from "zod";

export const mediaAssetSchema = z.object({
	eventId: z.string().min(1, "Event is required"),
	assetType: z.enum(["image", "video", "audio", "document"]),
	storageUrl: z.string().url("Must be a valid URL"),
	title: z
		.string()
		.min(1, "Media Title is required")
		.max(300, "Title must be less than 300 characters"),
	sourceText: z
		.string()
		.min(20, "Media Description is required")
		.max(10000, "Media Description must be less than 10000 characters"),
});

export type MediaAssetFormData = z.infer<typeof mediaAssetSchema>;

export const quizSchema = z.object({
	eventId: z.string().min(1, "Event is required"),
	quizGraph: z.record(z.any()), // JSON object for quiz structure
});

export type QuizFormData = z.infer<typeof quizSchema>;

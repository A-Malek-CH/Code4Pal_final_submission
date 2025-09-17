import { z } from "zod";

export const folderSchema = z.object({
	name: z
		.string()
		.min(1)
		.max(255)
		.regex(/^[a-zA-Z0-9_]+$/),
});

export type FolderSchema = z.infer<typeof folderSchema>;

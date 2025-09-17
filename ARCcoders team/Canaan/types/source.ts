import { Source } from "@prisma/client";

export type SourceDB = Omit<
	Source,
	"publish_date" | "created_at" | "updated_at"
> & {
	publish_date: string;
	created_at: string;
	updated_at: string;
};

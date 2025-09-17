import { Conversation } from "@prisma/client";
export type ConversationType = Omit<
	Conversation,
	"updated_at" | "created_at" | "user_id" | "is_public"
>;

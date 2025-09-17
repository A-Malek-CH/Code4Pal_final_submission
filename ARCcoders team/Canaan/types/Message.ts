import { Message } from "@prisma/client";

export type StoreMessageResponse = {
	message_id: string;
	conversation_id: string;
};
export type MessageExtra = Message & {
	isLoading?: boolean;
	action?: string;
};

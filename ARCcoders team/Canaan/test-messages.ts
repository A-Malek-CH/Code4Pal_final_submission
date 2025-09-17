import { Conversation, Message, Role } from "@prisma/client";
const conversationId = "conv_placeholder_id_01";
export const placeholderConversation: Conversation = {
	id: "conv_placeholder_id_01",
	created_at: new Date(),
	updated_at: new Date(),
	title: "New Conversation",
	is_public: false,
	user_id: "user_placeholder_id_xyz",
};
export const messages: Message[] = [
	{
		index: 1,
		id: "msg_001",
		conversation_id: conversationId,
		role: Role.USER,
		content: [
			{
				type: "text",
				text: "Hello! Can you explain what a virtual DOM is?",
			},
		],
		attachments: null,
		reasoning: null,
		sources: null,
		suggestions: null,
		created_at: new Date("2023-10-27T10:00:00Z"),
		updated_at: new Date("2023-10-27T10:00:00Z"),
	},
	{
		index: 2,
		id: "msg_002",
		conversation_id: conversationId,
		role: Role.ASSISTANT,
		content: [
			{
				type: "text",
				text: "Of course! The virtual DOM (VDOM) is a programming concept where a virtual representation of a UI is kept in memory and synced with the 'real' DOM. This process is called reconciliation.",
			},
		],
		attachments: null,
		reasoning: null,
		sources: null,
		suggestions: null,
		created_at: new Date("2023-10-27T10:00:05Z"),
		updated_at: new Date("2023-10-27T10:00:05Z"),
	},
	{
		index: 3,
		id: "msg_003",
		conversation_id: conversationId,
		role: Role.USER,
		content: [
			{
				type: "text",
				text: "Why is that more efficient than manipulating the real DOM directly?",
			},
		],
		attachments: null,
		reasoning: null,
		sources: null,
		suggestions: null,
		created_at: new Date("2023-10-27T10:01:10Z"),
		updated_at: new Date("2023-10-27T10:01:10Z"),
	},
	{
		index: 4,
		id: "msg_004",
		conversation_id: conversationId,
		role: Role.ASSISTANT,
		content: [
			{
				type: "text",
				text: "Direct DOM manipulation is slow because it can trigger expensive browser reflows and repaints. By diffing the VDOM against a snapshot, libraries can compute the minimal set of changes needed and apply them to the real DOM in a single, optimized batch.",
			},
		],
		attachments: null,
		reasoning: null,
		sources: null,
		suggestions: null,
		created_at: new Date("2023-10-27T10:01:25Z"),
		updated_at: new Date("2023-10-27T10:01:25Z"),
	},
];
export const generateMessages = (count: number) => {
	// Guard against an empty messages array to prevent division by zero
	if (messages.length === 0) {
		return [];
	}

	return Array.from(
		{ length: count },
		(_, index) => messages[index % messages.length]
	);
};

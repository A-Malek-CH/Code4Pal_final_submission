"use client";
import MessageBox from "./message-box";
import { memo, useEffect } from "react";
import { ListScrollArea } from "../ui/list-scroll-area";
import { useChat } from "@/providers/chat-provider";
import { ChatInput } from "./input";
import { useAuth } from "../firebase-auth/AuthContext";
import { Error, NotFound } from "../error-handlers";
import { MessageExtra } from "@/types/Message";
import { Loader } from "../ui/loader";
import { useGetMessages } from "@/hooks/use-messages-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Conversation } from "@prisma/client";
type MessageListWrapperProps = {
	conversationId: string;
	conversation: Conversation;
};
type MessageListProps = {
	queryMessages: MessageExtra[];
};
const MessageList = memo(function MessageList({
	queryMessages,
}: MessageListProps) {
	const { messages, setMessages, rewrite } = useChat();
	useEffect(() => {
		if (messages.length !== 0) return;

		setMessages(queryMessages);
	}, [queryMessages]);
	return (
		<main className="flex-1 flex flex-col">
			<div className="w-full h-[calc(100dvh-16.5rem)] overflow-hidden px-2">
				<ListScrollArea className="h-full">
					<div className="mx-auto p-2 block">
						{messages.map((message, index) => (
							<div key={message.id + index} className="w-full py-4 px-2">
								<MessageBox
									rewrite={rewrite}
									message={message}
									messageIndex={index}
									type="list"
								/>
							</div>
						))}
					</div>
				</ListScrollArea>
			</div>
			<ChatInput />
		</main>
	);
});
const MessageListWrapper = memo(function MessageListWrapper({
	conversationId,
	conversation,
}: MessageListWrapperProps) {
	const { messages, setConversation } = useChat();
	const {
		data: fetchedMessages = [], // Use a better name and provide a default
		isLoading,
		isError,
		error,
		isSuccess,
	} = useGetMessages(conversationId);
	useEffect(() => {
		if (!isSuccess) return;

		const title = conversation.title;
		setConversation({ id: conversationId, title });
	}, [
		isSuccess,
		fetchedMessages.length,
		conversationId,
		conversation,
		setConversation,
	]);

	if (isLoading) {
		return <Loader size="lg" />;
	}

	if (isError) {
		return <Error message={error.message} />;
	}
	// 5. If we reach this point, the query was successful and fetchedMessages are available.
	// However, the component might still render for a frame before the redirect happens.
	// To prevent a flicker, we can add a final check.
	if (!fetchedMessages) {
		// Render a loader or null while the redirect is happening.
		return <Loader size="lg" />;
	}
	return <MessageList queryMessages={fetchedMessages} />;
});

export default MessageListWrapper;

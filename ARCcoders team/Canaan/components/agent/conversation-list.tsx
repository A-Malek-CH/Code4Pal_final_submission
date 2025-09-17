"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useChat } from "@/providers/chat-provider";
import { InfiniteScroll } from "@/components/ui/infinite-scroll";
import { useGetMessages } from "@/hooks/use-messages-query";
import { ListScrollArea } from "../ui/list-scroll-area";
import { useConversations } from "@/providers/conversation-provider";
import { Conversation } from "@prisma/client";

import { useRouter } from "next/navigation";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenuSubItem,
} from "../ui/sidebar";
import { Loader } from "../ui/loader";
type ConversationElementType = {
	conversationItem: Conversation;
	onSelectConversation: (conversationItem: Conversation) => void;
};
function ConversationElement({
	conversationItem,
	onSelectConversation,
}: ConversationElementType) {
	const { conversation: activeConversation, isLoading } = useChat();

	const conversationId = activeConversation?.id || "";
	const conversationTitle =
		activeConversation?.id == conversationItem.id &&
		activeConversation.title !== "notSet"
			? activeConversation.title
			: conversationItem.title;

	return (
		<SidebarMenuSubItem>
			<Button
				disabled={conversationId === conversationItem.id && !isLoading.state}
				key={conversationItem.id}
				id={String(conversationItem.id)}
				className="w-full justify-start mb-2"
				variant={conversationId === conversationItem.id ? "secondary" : "ghost"}
				onClick={() => onSelectConversation(conversationItem)}
			>
				<MessageSquare className="mr-2 h-4 w-4" />
				<div className="flex flex-col items-start overflow-x-hidden">
					<span className="truncate w-full text-left">{conversationTitle}</span>
					<div className="flex items-center space-x-2">
						<span className="text-xs text-muted-foreground">
							{new Date(conversationItem.created_at).toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</span>
						<span className="text-xs text-muted-foreground">
							{new Date(conversationItem.created_at).toLocaleDateString([], {
								day: "2-digit",
								month: "2-digit",
								year: "numeric",
							})}
						</span>
					</div>
				</div>
			</Button>
		</SidebarMenuSubItem>
	);
}

export function ConversationList() {
	const router = useRouter();
	const { setConversation, setError, error, setMessages, conversation } =
		useChat();

	const onSelectConversation = (conversation: Conversation) => {
		router.push(`/agent/${conversation.id}`);
		setConversation(conversation);
	};

	const conversationId = conversation?.id;

	const {
		data: messagesdata,
		isError: isErrorMessage,
		error: errorMeessage,
	} = useGetMessages(conversationId!);
	const {
		conversations,
		fetchNextPage,
		hasNextPage,
		isLoading,
		isError,
		error: ErrorConversation,
	} = useConversations();

	// Update messages in chat context ONLY when messagesdata changes AND is defined
	useEffect(() => {
		// Check if messagesdata has actually loaded (is not undefined).
		// This prevents setting `undefined` or an empty array during the initial fetch/ID change.
		// console.log("messagesdata:", messagesdata);
		if (messagesdata !== undefined) {
			// console.log("Setting messages in context:", messagesdata); // Keep for debugging if helpful
			setMessages(messagesdata); // Update context with the fetched data
		}
		// Optional: If you want to clear messages when no conversation is selected
		else if (conversationId === null) {
			setMessages([]);
		}
		// Depend on the actual data from the query and the setter function
	}, [messagesdata, conversationId, setMessages]); // <-- CORRECTED DEPENDENCIES

	// Update the selected conversation in the context
	// useEffect(() => {
	//   if (conversation) {
	//     console.log("Conversation selected:", conversation);
	//     setConversation(conversation);
	//   }
	// }, [conversation, setConversation]);

	// Handle errors from the query
	useEffect(() => {
		if (isError || isErrorMessage) {
			setError(
				ErrorConversation.message ||
					errorMeessage?.message ||
					"Failed to load conversations"
			);
		}
	}, [errorMeessage, ErrorConversation, setError]);

	// useSizeChange(() => {}, [conversations]);

	// Group conversations by date
	const groupedConversations = conversations.reduce((groups, conversation) => {
		const date = new Date(conversation.created_at);
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		let groupKey = "";

		if (date.toDateString() === today.toDateString()) {
			groupKey = "Today";
		} else if (date.toDateString() === yesterday.toDateString()) {
			groupKey = "Yesterday";
		} else if (date > new Date(today.setDate(today.getDate() - 7))) {
			groupKey = "This Week";
		} else if (date > new Date(today.setDate(today.getDate() - 30))) {
			groupKey = "This Month";
		} else {
			groupKey = "Older";
		}

		if (!groups[groupKey]) {
			groups[groupKey] = [];
		}

		groups[groupKey].push(conversation);
		return groups;
	}, {} as Record<string, Conversation[]>);

	// Sort conversations within each group by timestamp (newest first)
	Object.keys(groupedConversations).forEach((key) => {
		groupedConversations[key].sort(
			(a, b) =>
				new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
		);
	});

	// Define the display order of groups
	const groupOrder = ["Today", "Yesterday", "This Week", "This Month", "Older"];

	if (isError) {
		setError("Failed to load conversations");
	}

	return (
		<div className="flex-1 flex flex-col min-h-0">
			<div className="w-full h-full overflow-hidden ">
				{" "}
				<ListScrollArea className="h-full ">
					{isLoading ? (
						<div className="text-center h-full text-muted-foreground py-4">
							<Loader size="md" />
						</div>
					) : (
						<InfiniteScroll
							onLoadMore={() => fetchNextPage()}
							hasMore={!!hasNextPage}
							isLoading={isLoading}
						>
							{groupOrder.map((groupName) => {
								const groupConversations = groupedConversations[groupName];
								if (!groupConversations || groupConversations.length === 0)
									return null;

								return (
									<SidebarGroup key={groupName}>
										<SidebarGroupLabel> {groupName}</SidebarGroupLabel>
										<SidebarGroupContent>
											{groupConversations.map((chat) => (
												<ConversationElement
													key={chat.id}
													onSelectConversation={onSelectConversation}
													conversationItem={chat}
												/>
											))}
										</SidebarGroupContent>
									</SidebarGroup>
								);
							})}
						</InfiniteScroll>
					)}
				</ListScrollArea>
			</div>
		</div>
	);
}
ConversationList.displayName = "ConversationList";

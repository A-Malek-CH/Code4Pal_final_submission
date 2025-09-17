"use client";
import type React from "react";
import { v4 as uuid } from "uuid";
import { handleChatRequestFront, type ChatRequestBody } from "@/ai";
import type { StoreMessageResponse } from "@/types/Message";
import { RemoteFileAttachment, ClientAttachment } from "@/types/attachment";
import {
	createContext,
	useState,
	useEffect,
	useRef,
	useContext,
	type FC,
	type ReactNode,
	useCallback,
	useMemo,
} from "react";
import {
	createConversationDB,
	editMessage,
	InputUserMessage,
	storeMessage,
} from "@/lib/supabase";
import { callWithRetry } from "@/lib";
import { MessageExtra } from "@/types/Message";
import { useQueryClient } from "@tanstack/react-query";
import { Conversation } from "@prisma/client";
import { useAuth } from "@/components/firebase-auth/AuthContext";

import { supabase } from "@/lib/supabase/supabase";
import { MessageContentText } from "@langchain/core/messages";
// import { generateMessages } from "@/test-messages";
import { toast } from "sonner";
import { useAsyncRoutePush } from "@/hooks/use-async-push";
import { ConversationType } from "@/types/Conversation";

import { InputProvider } from "./input-provider";
import { ConversationsProvider } from "./conversation-provider";
import { SourceProvider } from "./source-provider";
async function handleNewChat(id: string): Promise<Conversation> {
	const newConversation = await createConversationDB({
		title: "New Conversation",
		userId: id,
	});
	return newConversation;
}
interface ChatContextValue {
	messages: MessageExtra[];
	isLoading: {
		state: boolean;
		id: string | null;
	};
	error: string | null;
	conversation: ConversationType | null;
	stop: boolean;
	isNewChat: boolean;
	setStop: React.Dispatch<React.SetStateAction<boolean>>;
	setMessages: React.Dispatch<React.SetStateAction<MessageExtra[]>>;
	setConversation: React.Dispatch<
		React.SetStateAction<ConversationType | null>
	>;
	setError: React.Dispatch<React.SetStateAction<string | null>>;
	setIsNewChat: React.Dispatch<React.SetStateAction<boolean>>;
	rewrite: (
		messageId: string,
		searchMode: string,
		emptyInput: () => void
	) => void;
	newChatStarter: (emptyInput: () => void) => void;
	handleFormSubmit: (
		query: string,
		attachments: ClientAttachment[],
		searchMode: string,
		emptyInput: () => void
	) => void;
}

const MAX_RETRIES = 3;

// Helper functions moved outside component to avoid recreation on each render
const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export const ChatProvider: FC<{ children: ReactNode }> = ({ children }) => {
	// State management
	const [isNewChat, setIsNewChat] = useState(false);
	const { user } = useAuth();
	if (!user) throw new Error("User not authenticated");
	const [messages, setMessages] = useState<MessageExtra[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [stop, setStop] = useState(true);
	const [remoteFilesAttachments, setRemoteFilesAttachements] = useState<
		RemoteFileAttachment[]
	>([]);
	const push = useAsyncRoutePush();

	const [conversation, setConversation] = useState<ConversationType | null>(
		null
	);
	const [isLoading, setIsLoading] = useState<{
		state: boolean;
		id: string | null;
	}>({
		state: false,
		id: null,
	});
	const abortControllerRef = useRef<AbortController | null>(null);

	const newChatStarter = (emptyInput: () => void) => {
		("newChatStarter");
		setMessages([]);
		setError(null);
		setStop(true);
		setConversation(null);
		setIsLoading({ state: false, id: null });
		emptyInput();
	};

	// 5. This separate effect specifically watches the `stop` prop
	useEffect(() => {
		if (stop && abortControllerRef.current) {
			console.log("Stop prop is true. Send Message requests...");

			// Abort the ongoing requests
			abortControllerRef.current.abort();

			// You can also reset the loading state here if needed
			setIsLoading({ state: false, id: null });
		}
	}, [stop]); // This effect only depends on the `stop` prop

	const saveUserMessage = useCallback(
		async (
			userMessage: InputUserMessage
		): Promise<{
			res: StoreMessageResponse;
		}> => {
			try {
				// Store the MessageExtra
				const res = await storeMessage(user.id, userMessage);

				return {
					res,
				};
			} catch (error) {
				console.error("Error saving user MessageExtra:", error);
				throw error;
			}
		},
		[storeMessage] // Removed setConversation since it's commented out
	);
	const uploadAttachment = useCallback(
		async (
			file: File,
			conversationId: string
		): Promise<RemoteFileAttachment> => {
			const fileExt = file.name.split(".").pop();
			const fileName = `${Date.now()}-${Math.random()
				.toString(36)
				.substring(2)}.${fileExt}`;
			const filePath = `ai/${conversationId}/${fileName}`;

			const { data, error } = await supabase.storage
				.from("canaan")
				.upload(filePath, file, {
					cacheControl: "3600",
					upsert: false,
				});

			if (error) throw error;

			const {
				data: { publicUrl },
			} = supabase.storage.from("canaan").getPublicUrl(filePath);

			return {
				id: crypto.randomUUID(),
				url: publicUrl,
				filename: file.name,
				contentType: file.type,
				size: file.size,
			};
		},
		[supabase]
	);

	const queryClient = useQueryClient();
	const invalidateConversations = () => {
		queryClient.invalidateQueries({
			queryKey: ["conversations"],
		});
	};
	const invalidateMessages = (conversationId: string) => {
		queryClient.invalidateQueries({
			queryKey: ["messages", conversationId],
			refetchType: "none",
		});
	};
	const updateConversation = useCallback(async () => {
		abortControllerRef.current = new AbortController();
		const signal = abortControllerRef.current.signal;
		const conversationId = conversation!.id;
		const trimmedHistory = messages.map((msg) => ({
			role: msg.role.toLowerCase() as "user" | "assistant",
			content: [...(msg.content as MessageContentText[])],
		}));
		const requestBody: ChatRequestBody = {
			query: [
				{
					text: "Based on The conversation create a title for it",
					type: "text",
				},
			],
			history: trimmedHistory.map((msg) => [msg.role, msg.content]),
			attachments: remoteFilesAttachments,
			task: "titleGenerator", // Using an existing task
			signal,
		};

		const chatGenerator = handleChatRequestFront(requestBody);

		let accumulatedTitle = "";
		try {
			for await (const event of chatGenerator) {
				if (event.type === "message") {
					accumulatedTitle += event.data;
					setConversation((prev) =>
						prev ? { ...prev, title: accumulatedTitle } : null
					);
				} else if (event.type === "end") {
					break;
				} else if (event.type === "error") {
					const errorMessage = "Failed to generate title:" + event.data;
					throw new Error(errorMessage);
				}
			}
		} catch (e: any) {
			setError(e.message);
			return;
		}

		const newTitle = accumulatedTitle.replace(/"/g, "").trim();

		if (newTitle) {
			try {
				const { error } = await supabase
					.from("conversation")
					.update({ title: newTitle })
					.eq("id", conversationId);

				if (error) throw error;

				invalidateConversations();
			} catch (error) {
				console.error("Failed to update conversation title:", error);
			}
		}
	}, [invalidateConversations, setConversation]);

	useEffect(() => {
		if (isNewChat && conversation && messages.length >= 2) {
			console.log("🚀 ~ ChatProvider ~ updating conversation title");
			updateConversation();
			setIsNewChat(false); // Reset after updating
		}
	}, [isNewChat, conversation, messages.length, updateConversation]);
	useEffect(() => {
		if (conversation?.title == "New Conversation") {
			setIsNewChat(true);
		}
	}, [conversation]);
	useEffect(() => {
		if (error) toast.error(error);
	}, [error]);
	const sendLLMMessage = async (
		userMessageContent: MessageContentText[],
		currentHistory: MessageExtra[],
		attachments: (ClientAttachment | RemoteFileAttachment)[],
		searchMode: string,
		emptyInput: () => void,
		conversationId: string,
		existingMessageId?: string
	) => {
		("sendLLMMessage");
		const mode = existingMessageId ? "edit" : "new";
		const optimisticAssistantId = existingMessageId || uuid(); // Use existing or new optimistic ID
		// 1. Prepare User Content (including clipboard)

		setIsLoading({ state: true, id: optimisticAssistantId });
		setError(null); // Clear previous errors
		setStop(false); // Allow streaming
		abortControllerRef.current = new AbortController();
		const signal = abortControllerRef.current.signal;

		let finalUserMessageId: string | null = null;
		let messageAttachments: RemoteFileAttachment[] = [];
		if (attachments && attachments.length > 0) {
			messageAttachments = await Promise.all(
				attachments.map(
					(attachment: ClientAttachment | RemoteFileAttachment) => {
						if (
							(attachment as RemoteFileAttachment).url ||
							(attachment as RemoteFileAttachment).filename ||
							(attachment as RemoteFileAttachment).size ||
							(attachment as RemoteFileAttachment).contentType
						) {
							return attachment as RemoteFileAttachment;
						}
						return uploadAttachment(
							(attachment as ClientAttachment).file,
							conversationId
						);
					}
				)
			);
		}
		setRemoteFilesAttachements(messageAttachments);
		// 2. Handle User MessageExtra (if "new" mode)
		const optimisticUserMessageId = uuid();
		const userMessage: MessageExtra = {
			id: optimisticUserMessageId,
			created_at: new Date(),
			updated_at: new Date(),
			conversation_id: conversationId,
			content: userMessageContent,
			role: "USER",
			attachments: messageAttachments,
			sources: null,
			reasoning: null,
			suggestions: null,
			index: messages.length + 1,
		};
		if (mode === "new") {
			setMessages((prev) => [...prev, userMessage]);
		}

		// 3. Prepare History for LLM
		// History should be based on the state *before* adding the new optimistic user MessageExtra if applicable,
		// or up to the point of rewrite.

		const trimmedHistory = currentHistory.map((msg) => ({
			role: msg.role.toLowerCase() as "user" | "assistant",
			content: [
				...(msg.content as MessageContentText[]),
				...(messageAttachments.map((item) => {
					return {
						type: "image_url",
						image_url: { url: item.url },
					};
				}) || []),
			],
		}));

		let assistantMessage: MessageExtra = {
			content: [{ text: "", type: "text" }],
			role: "ASSISTANT",
			conversation_id: conversationId,
			sources: [],
			isLoading: true,
			id: optimisticAssistantId,
			attachments: null,
			reasoning: null,
			suggestions: null,
			created_at: new Date(),
			updated_at: new Date(),
			index: messages.length + 2,
		};

		if (mode === "new") {
			// Add optimistic assistant shell
			setMessages((prev) => [...prev, assistantMessage]);
		} else {
			// For edit mode, update the existing MessageExtra to clear content
			setMessages((prev) =>
				prev.map((m) =>
					m.id === optimisticAssistantId
						? {
								...m,
								action: "Waiting...",
								content: [{ text: "", type: "text" }],
								sources: [],
								reasoning: null,
								isLoading: true,
								timestamp: new Date().toISOString(),
						  }
						: m
				)
			);
			// Re-fetch the assistant MessageExtra from state to ensure we're working with the latest version for updates
			const existingMsg = messages.find((m) => m.id === optimisticAssistantId);
			if (existingMsg)
				assistantMessage = {
					...existingMsg,
					action: "Waiting...",
					content: [{ text: "", type: "text" }],
					sources: [],
					isLoading: true,
					reasoning: null,
				};
		}

		// 5. Make API Call and Stream Response
		const requestBody: ChatRequestBody = {
			query: userMessageContent,
			history: trimmedHistory.map((msg) => [msg.role, msg.content]),
			attachments: messageAttachments,
			task: "academicSearch",
			signal: signal,
		};

		const chatGenerator = handleChatRequestFront(requestBody);

		let accumulatedContent = [{ text: "", type: "text" }];
		let accumulatedSources: any[] = [];
		let accumulatedReasoning = "";
		let newAction = "";
		try {
			for await (const event of chatGenerator) {
				let updateType = "";
				let newContent = "";
				let newReasoning = "";

				console.log("🚀 ~ sendLLMMessage ~ event:", event);
				if (event.type === "message") {
					newAction = "Generating...";
					newContent = event.data;
					accumulatedContent[0].text += newContent;
					updateType = "content";
				} else if (event.type === "sources") {
					newAction = "Sources...";
					const sourcesWithoutContent = event.data?.map((source: any) => {
						const { pageContent, ...restOfSource } = source;
						// Return the new object that only contains the rest of the properties
						return restOfSource;
					});
					accumulatedSources = sourcesWithoutContent; // Assuming sources are replaced, not appended

					updateType = "sources";
				} else if (event.type === "reasoning") {
					newAction = "Reasoning...";
					newReasoning = event.data;
					accumulatedReasoning += newReasoning;
					updateType = "reasoning";
				} else if (event.type === "error") {
					throw new Error(event.data); // Propagate error to catch block
				} else if (event.type === "action") {
					newAction = event.data;

					updateType = "action";
				}
				setMessages((prevMsgs) =>
					prevMsgs.map((m) =>
						m.id === optimisticAssistantId
							? {
									...m,
									content: accumulatedContent,
									sources: accumulatedSources,
									reasoning: accumulatedReasoning || null, // Keep null if empty
									isLoading: true,
									action: newAction,
							  }
							: m
					)
				);
			}

			if (!accumulatedContent) {
				// Ensure at least some content if stopped early
				accumulatedContent = [{ text: "No Response", type: "text" }];
				setMessages((prevMsgs) =>
					prevMsgs.map((m) =>
						m.id === optimisticAssistantId
							? { ...m, content: accumulatedContent }
							: m
					)
				);
			}

			console.log("🚀 ~ sendLLMMessage ~ messages.length:", messages.length);
			// 6. Finalize Assistant MessageExtra in DB
			const finalAssistantMessageData: MessageExtra = {
				id: "", // DB will assign
				content: accumulatedContent,
				action: "",
				role: "ASSISTANT" as const,
				sources: accumulatedSources,
				created_at: new Date(),
				updated_at: new Date(),
				suggestions: assistantMessage.suggestions || null,
				conversation_id: conversationId,
				reasoning: accumulatedReasoning || null,
				attachments: null,
				isLoading: false,
				index: messages.length + 2,
			};

			if (mode === "new") {
				try {
					const userSaveResult = await callWithRetry(
						() => saveUserMessage(userMessage),
						MAX_RETRIES
					);
					invalidateConversations();
					finalUserMessageId = String(userSaveResult.res.message_id);

					// Update user MessageExtra with final ID from DB
					setMessages((prev) =>
						prev.map((msg) =>
							msg.id === optimisticUserMessageId
								? { ...msg, id: finalUserMessageId! }
								: msg
						)
					);
				} catch (err: any) {
					setError(`Failed to save user MessageExtra: ${err.MessageExtra}`);
					setIsLoading({ state: false, id: null });
					setStop(true);
					// Optionally remove the optimistic user MessageExtra or mark it as failed
					setMessages((prev) =>
						prev.filter((msg) => msg.id !== optimisticUserMessageId)
					);
					return;
				}
				callWithRetry(
					() =>
						storeMessage(
							user.id, // User ID
							{
								content: finalAssistantMessageData.content,
								role: finalAssistantMessageData.role,
								conversation_id: finalAssistantMessageData.conversation_id,
								attachments: null,
								reasoning: finalAssistantMessageData.reasoning || null,
								sources: finalAssistantMessageData.sources || null,
								suggestions: finalAssistantMessageData.suggestions || null,
								index: finalAssistantMessageData.index,
							}
						),
					MAX_RETRIES
				);
			} else {
				callWithRetry(
					() =>
						editMessage(user.id, optimisticAssistantId, {
							content: finalAssistantMessageData.content,
							role: finalAssistantMessageData.role,
							conversation_id: finalAssistantMessageData.conversation_id,
							attachments: null,
							reasoning: finalAssistantMessageData.reasoning || null,
							sources: finalAssistantMessageData.sources || null,
							suggestions: finalAssistantMessageData.suggestions || null,
						}),
					MAX_RETRIES
				);
				// finalAssistantDbId remains optimisticAssistantId as it's an edit
			}

			// Update MessageExtra in state with final DB ID (if new) and ensure all data is consistent
			setMessages((prev) =>
				prev.map((msg) =>
					msg.id === optimisticAssistantId
						? {
								...msg, // Spread existing fields first
								content: accumulatedContent,
								isLoading: false,
								sources: accumulatedSources,
								reasoning: accumulatedReasoning || null,
								conversation_id: conversationId,
								action: "",
						  }
						: msg
				)
			);

			invalidateMessages(conversationId);
		} catch (err: any) {
			setError(`LLM processing error: ${err.message}`);
			setMessages((prev) =>
				prev.map((msg) =>
					msg.id === optimisticAssistantId
						? {
								...msg, // Spread existing fields first
								isLoading: false, // Update ID if it changed
								action: "",
						  }
						: msg
				)
			);
			// If assistant MessageExtra was optimistically added, consider removing or marking as error
			// For simplicity here, we just show the error.
		} finally {
			// setIsLoading({ state: false, id: null });
			emptyInput();
			setStop(true);
		}
	};
	const rewrite = async (
		assistantMessageIdToRewrite: string,
		searchMode: string,
		emptyInput: () => void
	) => {
		// Renamed for clarity
		const messageIndex = messages.findIndex(
			(msg) => msg.id === assistantMessageIdToRewrite
		);

		if (messageIndex < 0) {
			setError("Cannot rewrite: Original assistant MessageExtra not found.");
			setIsLoading({ state: false, id: null }); // Reset loading
			setStop(true); // Ensure stop is true
			return;
		}
		if (messages[messageIndex].role !== "ASSISTANT") {
			setError(
				"Cannot rewrite: Target MessageExtra is not an assistant MessageExtra."
			);
			setIsLoading({ state: false, id: null });
			setStop(true);
			return;
		}

		// The user MessageExtra is typically the one *before* the assistant MessageExtra
		const userMessageIndex = messageIndex - 1;
		if (userMessageIndex < 0 || messages[userMessageIndex].role !== "USER") {
			// This scenario is tricky: An assistant MessageExtra without a preceding user MessageExtra?
			// This could happen if the very first MessageExtra in the chat was an assistant greeting.
			// How do you "rewrite" a greeting without user context?
			// For now, let's assume a user MessageExtra is required.
			setError(
				"Cannot rewrite: No preceding user MessageExtra found for context."
			);
			setIsLoading({ state: false, id: null });
			setStop(true);
			return;
		}

		const userQueryForRewrite = messages[userMessageIndex].content;
		const userAttachments = messages[userMessageIndex].attachments || [];
		// History should be all messages *plus* the userQueryForRewrite was originally sent
		const historyForRewrite = messages.slice(0, userMessageIndex + 1);

		// initResponse(); // Handled by sendLLMMessage

		try {
			// Call sendLLMMessage in "edit" mode
			await sendLLMMessage(
				userQueryForRewrite as any, //////
				historyForRewrite,
				userAttachments as any,
				searchMode,
				emptyInput,
				conversation!.id,
				assistantMessageIdToRewrite
			);
		} catch (err: any) {
			console.error("Error during rewrite operation:", err);
			// sendLLMMessage should set the error in context.
			// Ensure loading/stop states are reset if sendLLMMessage failed to do so.
			setError(`Rewrite failed: ${err.MessageExtra || "Unknown error"}`); // Potentially override if sendLLMMessage error isn't specific enough
			setIsLoading({ state: false, id: null });
			setStop(true);
		}
		// No finally needed here if sendLLMMessage handles its own finally for loading/stop
	};
	const handleFormSubmit = async (
		query: string,
		attachments: ClientAttachment[],
		searchMode: string,
		emptyInput: () => void
	) => {
		if (!query.trim()) return;

		let activeConversation = conversation || null;
		if (messages.length === 0) {
			activeConversation = await handleNewChat(user!.id);
			setConversation(activeConversation);
			setIsNewChat(true); // Mark as new chat for title generation
			await push(`/agent/${activeConversation.id}`);
		}
		if (!activeConversation) {
			return;
		}

		try {
			const history = messages;
			let mutableInput = [
				{ text: query, type: "text" },
			] as Array<MessageContentText>;
			const hasSuccessiveUserMessages =
				history.length > 0 && history[history.length - 1].role === "USER";
			if (hasSuccessiveUserMessages) {
				const userMessage = history[history.length - 1].content as Array<any>;
				mutableInput = [...userMessage, { type: "text", content: query }];
				history.pop();
				setMessages(history);
			}
			await sendLLMMessage(
				mutableInput,
				history,
				attachments,
				searchMode,
				emptyInput,
				activeConversation.id
			);
		} catch (error: any) {
			if (typeof error === "string") {
				setError(error);
			} else {
				setError(
					error instanceof Error ? error.message : "Failed to process message"
				);
			}
			console.error("Error-Container:", error);
		} finally {
			setIsLoading({ id: null, state: false });
			// setInput("");
			// clearAttachments();
			setStop(true);
		}
	};
	const contextValue = useMemo<ChatContextValue>(() => {
		return {
			isNewChat,
			setIsNewChat,
			stop,
			setStop,
			setMessages,
			messages,
			isLoading,
			error,
			conversation,
			handleFormSubmit,
			rewrite,
			setConversation,
			setError,
			newChatStarter,
		};
	}, [
		stop,
		setStop,
		setMessages,
		messages,
		isLoading,
		error,
		conversation,
		handleFormSubmit,
		rewrite,
		setConversation,
		setError,
		newChatStarter,
	]);
	return (
		<ChatContext.Provider value={contextValue}>
			<InputProvider>
				<ConversationsProvider>
					<SourceProvider>{children}</SourceProvider>
				</ConversationsProvider>
			</InputProvider>
		</ChatContext.Provider>
	);
};
// Helper function for handling chat requests without port
export const useChat = (): ChatContextValue => {
	const context = useContext(ChatContext);
	if (context === undefined) {
		throw new Error("useChat must be used within a ChatProvider");
	}
	return context;
};

export default ChatProvider;

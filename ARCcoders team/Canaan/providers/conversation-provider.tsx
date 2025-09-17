"use client";
import type React from "react";
import {
	createContext,
	useContext,
	type FC,
	type ReactNode,
	useMemo,
} from "react";

import { useInfiniteConversations } from "@/hooks/use-infinite-query";

import { Conversation } from "@prisma/client";
import { useAuth } from "@/components/firebase-auth/AuthContext";

interface ConversationsContextValue {
	conversations: Conversation[];
	fetchNextPage: () => void;
	hasNextPage: boolean;
	isLoading: boolean;
	isError: boolean;
	error: any;
}

const ConversationsContext = createContext<ConversationsContextValue>({
	conversations: [],
	fetchNextPage: () => {},
	hasNextPage: false,
	isLoading: false,
	isError: false,
	error: null,
});
export const ConversationsProvider: FC<{ children: ReactNode }> = ({
	children,
}) => {
	const { user } = useAuth();
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isLoading,
		isError,
		error: ErrorConversation,
	} = useInfiniteConversations(user!.id, 10);
	const conversations = data?.pages.flat() || [];

	const conversationsContextValue = useMemo<ConversationsContextValue>(() => {
		return {
			conversations,
			fetchNextPage,
			hasNextPage,
			isLoading,
			isError,
			error: ErrorConversation,
		};
	}, [
		conversations,
		fetchNextPage,
		hasNextPage,
		isLoading,
		isError,
		ErrorConversation,
	]);
	return (
		<ConversationsContext.Provider value={conversationsContextValue}>
			{children}
		</ConversationsContext.Provider>
	);
};
export const useConversations = (): ConversationsContextValue => {
	const context = useContext(ConversationsContext);
	if (context === undefined) {
		throw new Error("useConversations must be used within a ChatProvider");
	}
	return context;
};

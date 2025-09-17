import { useInfiniteQuery } from "@tanstack/react-query";
import { getConversations } from "@/lib/supabase/agent";

// Conversations infinite query
export function useInfiniteConversations(userId: string, pageSize = 10) {
	return useInfiniteQuery({
		queryKey: ["conversations", userId],
		queryFn: async ({ pageParam = 0 }) => {
			const conversations = await getConversations(userId, pageParam, pageSize);
			return conversations;
		},
		getNextPageParam: (lastPage, allPages) => {
			return lastPage.length === pageSize ? allPages.length : undefined;
		},
		initialPageParam: 0,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
	});
}

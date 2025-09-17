import { getMessages } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

// Messages infinite query
export function useGetMessages(conversationId: string | null) {
	return useQuery({
		queryKey: ["messages", conversationId], // user.id is not needed if the API uses the auth token
		queryFn: () => getMessages(conversationId!),
		enabled: !!conversationId,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
	});
}

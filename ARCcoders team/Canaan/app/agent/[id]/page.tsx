import React from "react";
import MessageListWrapper from "@/components/agent/message-list";
import { getConversation } from "@/lib/supabase";
import { redirect } from "next/navigation";

async function AgentConvPage({ params }: { params: { id: string } }) {
	const conversation = await getConversation(params.id);
	if (!conversation) {
		redirect(`/agent?notFound=${params.id}`);
	}

	return (
		<MessageListWrapper
			conversation={conversation}
			conversationId={params.id}
		/>
	);
}

export default AgentConvPage;

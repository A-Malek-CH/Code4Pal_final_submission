import AgentWrapper from "@/components/agent/agent-layout";
import ChatProvider from "@/providers/chat-provider";
import { ReactNode } from "react";

export default function AgentLayout({ children }: { children: ReactNode }) {
	return (
		<ChatProvider>
			<AgentWrapper>{children}</AgentWrapper>
		</ChatProvider>
	);
}

import React from "react";

import { AuthStatus } from "../auth.status";
import ThemeIndicator from "../theme-indicator";
import VoiceIndicator from "../voice-indicator";
import { SidebarTrigger } from "../ui/sidebar";

function AgentHeader() {
	return (
		<header className="flex items-center gap-2 justify-end px-2 py-3 border-b">
			<SidebarTrigger sidebarId="main" className="mr-auto" />
			<VoiceIndicator />
			{/* Theme Switcher */}
			<ThemeIndicator />
			{/* Voice Selector */}
			<AuthStatus />
		</header>
	);
}

export default AgentHeader;

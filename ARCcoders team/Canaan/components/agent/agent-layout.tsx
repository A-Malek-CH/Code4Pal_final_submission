"use client";
import type React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";

import AgentHeader from "./header";
import { AppSidebar } from "./app-sidebar";
import SourceSideBar from "./source-side-bar";

function AgentWrapper({ children }: { children: React.ReactNode }) {
	return (
		// ... (This section is unchanged) ...
		<div className="h-screen flex">
			{/* Mobile Sidebar Overlay */}
			<SidebarProvider>
				<AppSidebar id="main" />

				{/* Main Content */}
				<div className="flex-1 flex flex-col">
					<AgentHeader />
					{children}
				</div>
				<SourceSideBar />
			</SidebarProvider>
		</div>
	);
}

export default AgentWrapper;

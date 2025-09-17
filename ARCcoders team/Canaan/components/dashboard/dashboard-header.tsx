import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Bell, Search, Settings } from "lucide-react";
import { Button } from "../ui/button";

function DashboardHeader() {
	return (
		<header className="flex items-center gap-2 justify-end px-2 py-3 border-b">
			<SidebarTrigger sidebarId="dashboard" className="mr-auto" />
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<input
							type="text"
							placeholder="Search events, actors, locations..."
							className="pl-10 pr-4 py-2 w-96 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
						/>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Button variant="ghost" size="sm">
						<Bell className="h-4 w-4" />
					</Button>
					<Button variant="ghost" size="sm">
						<Settings className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</header>
	);
}

export default DashboardHeader;

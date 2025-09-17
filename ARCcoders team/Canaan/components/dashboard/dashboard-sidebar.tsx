import * as React from "react";
import {
	Calendar,
	Users,
	MapPin,
	FileText,
	Network,
	Menu,
	Search,
	Bell,
	Settings,
	Plus,
	Star,
	Box,
	StopCircleIcon,
	Circle,
	Database,
	Image as ImageIcon,
} from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { LogoSvg } from "../icons/logo-svg";
const navigationItems = [
	{ name: "Events Overview", icon: Calendar, href: "/dashboard/events" },
	{ name: "Historical Actors", icon: Users, href: "/dashboard/actors" },
	{ name: "Locations", icon: MapPin, href: "/dashboard/locations" },
	{ name: "Sources", icon: FileText, href: "/dashboard/sources" }, // Combined sources and media

	{ name: "Media", icon: ImageIcon, href: "/dashboard/media" }, // Combined sources and media

	{ name: "Storage Management", icon: Database, href: "/dashboard/storage" }, // Combined sources and media
	{
		name: "Relationship Network",
		icon: Network,
		href: "/dashboard/relationships",
	},

	{ name: "Rewards", icon: Circle, href: "/dashboard/rewards" },

	{ name: "Reward Boxes", icon: Box, href: "/dashboard/reward-boxes" },

	{
		name: "Achievements",
		icon: Star,
		href: "/dashboard/achievements",
	},
];

export function DashboardSideBar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<a href="/dashboard">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg  ">
									<Image
										src="/olive-branch.png"
										alt="Olive Branch"
										width={32}
										height={32}
									/>
								</div>
								<div className="flex flex-col gap-0.5 leading-none">
									<LogoSvg className="w-auto h-6 max-md:place-self-center md:w-full md:h-auto max-w-96" />
								</div>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent className="h-full flex flex-col">
				{" "}
				{/* <-- Add flex flex-col */}
				<SidebarGroup className="h-full flex flex-col flex-1">
					{" "}
					{/* <-- Add flex flex-col */}
					<SidebarGroupLabel>Platform</SidebarGroupLabel>
					{/* This menu needs to be a flex container that allows its children to grow */}
					<SidebarMenu className="h-full flex flex-col flex-1">
						{" "}
						{/* <-- Add flex flex-col and flex-1 */}
						{navigationItems.map((item) => (
							<SidebarMenuItem>
								<a href={item.href}>
									<SidebarMenuButton tooltip={item.name}>
										<item.icon />
										<span>{item.name}</span>
									</SidebarMenuButton>
								</a>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>

			<SidebarRail />
		</Sidebar>
	);
}

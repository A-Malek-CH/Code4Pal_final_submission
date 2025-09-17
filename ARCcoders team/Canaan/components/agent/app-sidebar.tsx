import * as React from "react";
import { ChevronRight, GalleryVerticalEnd, MessageSquare } from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { LogoSvg } from "../icons/logo-svg";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../ui/collapsible";
import { ConversationList } from "./conversation-list";

// This is sample data.
const data = {
	navMain: [
		{
			title: "Chat List",
			icon: () => <MessageSquare />,
			isActive: true,
			component: () => <ConversationList />,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<a href="/agent">
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
						{data.navMain.map((item) => (
							<Collapsible
								key={item.title}
								asChild
								defaultOpen={item.isActive}
								className="group/collapsible"
							>
								<SidebarMenuItem>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton tooltip={item.title}>
											{item.icon()}
											<span>{item.title}</span>
											<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
										</SidebarMenuButton>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarMenuSub className="h-full border-l-0 mx-0">
											{/* {item.items?.map((subItem) => (
												<SidebarMenuSubItem key={subItem.title}>
													<SidebarMenuSubButton asChild>
														<a href={subItem.url}>
															<span>{subItem.title}</span>
														</a>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))} */}
											{item.component()}
										</SidebarMenuSub>
									</CollapsibleContent>
								</SidebarMenuItem>
							</Collapsible>
						))}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>

			<SidebarRail />
		</Sidebar>
	);
}

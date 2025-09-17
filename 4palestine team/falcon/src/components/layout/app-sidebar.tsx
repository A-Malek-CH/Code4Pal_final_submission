"use client"

import Image from "next/image"
import * as React from "react"
import {
  Users,
  UserCheck,
  MapPin,
  AlertTriangle,
  Home,
} from "lucide-react"

import { NavMain } from "@/components/layout/nav-main"
import { NavUser } from "@/components/layout/nav-user"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"

// Updated navigation data for admin dashboard
const data = {
  user: {
    name: "Admin",
    email: "admin@4pal.com",
    avatar: "/imgs/user.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
      items: [],
    },
    {
      title: "Contributors",
      url: "/dashboard/contributors",
      icon: UserCheck,
      isActive: true,
      items: [],
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: Users,
      isActive: true,
      items: [],
    },
    {
      title: "Locations",
      url: "/dashboard/locations",
      icon: MapPin,
      isActive: true,
      items: [],
    },
    {
      title: "Emergencies",
      url: "/dashboard/emergencies",
      icon: AlertTriangle,
      isActive: true,
      items: [],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-4">
          <Image src="/imgs/bird.png" alt="Logo" width={64} height={64} />
          {state === "expanded" && (
            <Image src="/imgs/title.png" alt="Logo" width={128} height={128} className="max-w-[128px]" />
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

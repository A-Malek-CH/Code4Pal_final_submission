"use client"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { withAuth } from "@/contexts/AuthContext"

function DashboardLayout({ children }: React.PropsWithChildren) {
  const pathname = usePathname()

  const segments = pathname?.split("/").filter(Boolean) || []
  const subpage = segments[segments.length - 1] || "Dashboard"

  const title = subpage.charAt(0).toUpperCase() + subpage.slice(1).replace(/_/g, " ")

  return (
    <div className="screen max-h-screen max-w-screen overflow-hidden">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="bg-gradient-to-b from-emerald-700 to-emerald-500 p-4 flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold text-white">{title}</h1>
          </div>
          <main className="overflow-hidden full">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

export default withAuth(DashboardLayout)

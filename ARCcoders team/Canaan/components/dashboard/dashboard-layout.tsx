"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Menu, Plus, Search, Settings } from "lucide-react";
import { Sidebar, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { DashboardSideBar } from "./dashboard-sidebar";
import DashboardHeader from "./dashboard-header";

interface DashboardLayoutProps {
	children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
	return (
		<div className="min-h-screen bg-background">
			<SidebarProvider>
				{/* Sidebar */}
				<DashboardSideBar id="dashboard" />
				<section className="flex-1 flex flex-col">
					<DashboardHeader></DashboardHeader>
					<main className="p-6">{children}</main>
				</section>
			</SidebarProvider>
		</div>
	);
}

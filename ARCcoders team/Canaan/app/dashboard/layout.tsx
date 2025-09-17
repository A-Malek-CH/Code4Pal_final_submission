import type React from "react";
import type { Metadata } from "next";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export const metadata: Metadata = {
	title: "Dashboard Historical Insights Dashboard",
	description: "Manage complex historical data relationships and research",
};

export default function DashboardLayoutWrapper({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <DashboardLayout>{children}</DashboardLayout>;
}

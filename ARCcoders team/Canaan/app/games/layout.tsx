import type React from "react";
import type { Metadata } from "next";
import { GameProgressProvider } from "@/providers/game-result-provider";
import { GameStatsNavbar } from "@/components/layout/game-stats-navbar";
import { UserGameStatsProvider } from "@/providers/user-game-stats-provider";

export const metadata: Metadata = {
	title: "Games Hub",
	description: "Manage complex historical data relationships and research",
};

export default function GamesLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<GameProgressProvider>
			<UserGameStatsProvider>
				{/* The navbar is placed here so it can access the context */}
				<GameStatsNavbar />
				<main className="container py-8">{children}</main>
			</UserGameStatsProvider>
		</GameProgressProvider>
	);
}

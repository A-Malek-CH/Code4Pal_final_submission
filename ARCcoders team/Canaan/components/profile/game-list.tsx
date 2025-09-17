"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2, Trophy, Star, Repeat } from "lucide-react";
import type { UserProfileWithDetails } from "@/hooks/use-user-profile";

type GameStats = UserProfileWithDetails["user_game_stats"];

interface GameStatsListProps {
	stats: GameStats;
}

export function GameStatsList({ stats }: GameStatsListProps) {
	if (stats.length === 0) {
		return (
			<p className="text-center text-sm text-muted-foreground py-8">
				No game stats available yet.
			</p>
		);
	}

	return (
		<div className="space-y-4">
			{stats.map((stat) => (
				<Card key={stat.game_type} className="bg-muted/50">
					<CardHeader className="pb-2">
						<CardTitle className="text-base flex items-center gap-2">
							<Gamepad2 className="h-5 w-5 text-primary" />
							{stat.game_type}
						</CardTitle>
					</CardHeader>
					<CardContent className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
						<div className="flex items-center gap-2">
							<Trophy className="h-4 w-4 text-muted-foreground" /> Wins:{" "}
							{stat.total_wins}
						</div>
						<div className="flex items-center gap-2">
							<Star className="h-4 w-4 text-muted-foreground" /> Best Score:{" "}
							{stat.best_score}
						</div>
						<div className="flex items-center gap-2">
							<Repeat className="h-4 w-4 text-muted-foreground" /> Played:{" "}
							{stat.total_games_played}
						</div>
						<div className="flex items-center gap-2">
							Streak: {stat.current_win_streak}
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}

"use client";

import { Award } from "lucide-react";
import type { UserProfileWithDetails } from "@/hooks/use-user-profile";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

type Achievements = UserProfileWithDetails["user_achievement"];

interface AchievementsListProps {
	achievements: Achievements;
}

export function AchievementsList({ achievements }: AchievementsListProps) {
	if (achievements.length === 0) {
		return (
			<p className="text-center text-sm text-muted-foreground py-8">
				No achievements unlocked yet.
			</p>
		);
	}

	return (
		<TooltipProvider>
			<div className="space-y-3">
				{achievements.map(({ achievement, created_at }) => (
					<Tooltip key={achievement.id}>
						<TooltipTrigger asChild>
							<div className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
								<div className="bg-primary/10 p-2 rounded-md">
									<Award className="h-6 w-6 text-primary" />
								</div>
								<div className="flex-1">
									<p className="font-semibold">{achievement.name}</p>
									<p className="text-xs text-muted-foreground">
										Unlocked on {new Date(created_at).toLocaleDateString()}
									</p>
								</div>
								<span className="text-xs font-bold text-yellow-500">
									+{achievement.xp_bonus} XP
								</span>
							</div>
						</TooltipTrigger>
						<TooltipContent>
							<p>{achievement.description}</p>
						</TooltipContent>
					</Tooltip>
				))}
			</div>
		</TooltipProvider>
	);
}

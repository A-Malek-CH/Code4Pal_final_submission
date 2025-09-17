"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	calculateLevel,
	calculateXpThresholdForLevel,
} from "@/lib/gamification";
import { UserProfileWithDetails } from "@/hooks/use-user-profile";
import { GameStatsList } from "./game-list";
import { AchievementsList } from "./achievement-list";
import { RewardBoxesList } from "./reward-boxes-list";

interface UserProfileCardProps {
	user: UserProfileWithDetails;
}

export function UserProfileCard({ user }: UserProfileCardProps) {
	const currentXp = user.xp;
	const currentLevel = calculateLevel(currentXp);
	const xpAtStartOfCurrentLevel = calculateXpThresholdForLevel(currentLevel);
	const xpAtStartOfNextLevel = calculateXpThresholdForLevel(currentLevel + 1);
	const xpEarnedInCurrentLevel = currentXp - xpAtStartOfCurrentLevel;
	const totalXpSpanOfCurrentLevel =
		xpAtStartOfNextLevel - xpAtStartOfCurrentLevel;
	const progressPercentage =
		(xpEarnedInCurrentLevel / totalXpSpanOfCurrentLevel) * 100;

	return (
		<Card className=" h-screen  m-20">
			<CardHeader className="flex flex-row items-center gap-4 relative">
				<Avatar className="h-16 w-16">
					<AvatarImage
						src={user.photo_url ?? undefined}
						alt={user.display_name}
					/>
					<AvatarFallback>
						{user.display_name?.charAt(0).toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<div>
					<CardTitle className="text-xl">{user.display_name}</CardTitle>
					<p className="text-sm text-muted-foreground">{user.email}</p>
				</div>
				<div className="absolute top-4 right-4 bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
					<span className="text-primary font-bold">LVL {currentLevel}</span>
				</div>
			</CardHeader>
			<CardContent>
				{/* XP Progress Bar */}
				<div className="mb-6">
					<div className="flex items-center justify-between mb-1">
						<span className="text-xs font-medium text-muted-foreground">
							Level Progress
						</span>
						<span className="text-xs font-medium text-primary">
							{xpEarnedInCurrentLevel} / {totalXpSpanOfCurrentLevel} XP
						</span>
					</div>
					<Progress value={progressPercentage} className="h-2" />
				</div>

				{/* Tabs for Stats, Achievements, and Boxes */}
				<Tabs defaultValue="stats" className="w-full">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="stats">Stats</TabsTrigger>
						<TabsTrigger value="achievements">Achievements</TabsTrigger>
						<TabsTrigger value="rewards">Rewards</TabsTrigger>
					</TabsList>

					<TabsContent value="stats" className="mt-4">
						<GameStatsList stats={user.user_game_stats} />
					</TabsContent>
					<TabsContent value="achievements" className="mt-4">
						<AchievementsList achievements={user.user_achievement} />
					</TabsContent>
					<TabsContent value="rewards" className="mt-4">
						<RewardBoxesList boxes={user.user_reward_box} />
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}

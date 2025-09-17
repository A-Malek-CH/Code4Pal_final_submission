"use client";

import { Trophy, Lock, Star } from "lucide-react";
import { useGamification } from "../hooks/use-gamification";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

export function AchievementsPanel() {
	const { achievements } = useGamification();

	const getRarityColor = (rarity: string) => {
		switch (rarity) {
			case "common":
				return "bg-gray-100 text-gray-800 border-gray-300";
			case "rare":
				return "bg-blue-100 text-blue-800 border-blue-300";
			case "epic":
				return "bg-purple-100 text-purple-800 border-purple-300";
			case "legendary":
				return "bg-yellow-100 text-yellow-800 border-yellow-300";
			default:
				return "bg-gray-100 text-gray-800 border-gray-300";
		}
	};

	const getRarityIcon = (rarity: string) => {
		switch (rarity) {
			case "legendary":
				return <Star className="h-4 w-4" />;
			default:
				return <Trophy className="h-4 w-4" />;
		}
	};

	return (
		<Card className="bg-white shadow-lg border-2 border-gray-200">
			<CardHeader className="p-4 border-b">
				<CardTitle className="text-xl font-semibold flex items-center gap-2">
					<Trophy className="h-6 w-6 text-yellow-600" />
					Achievements
				</CardTitle>
			</CardHeader>
			<CardContent className="p-4">
				<div className="grid gap-3">
					{achievements.map((achievement) => (
						<div
							key={achievement.id}
							className={`p-3 rounded-lg border-2 transition-all ${
								achievement.isUnlocked
									? "bg-green-50 border-green-200"
									: "bg-gray-50 border-gray-200 opacity-60"
							}`}
						>
							<div className="flex items-start justify-between">
								<div className="flex items-start gap-3">
									<div
										className={`p-2 rounded-full ${
											achievement.isUnlocked ? "bg-green-100" : "bg-gray-100"
										}`}
									>
										{achievement.isUnlocked ? (
											getRarityIcon(achievement.rarity)
										) : (
											<Lock className="h-4 w-4 text-gray-400" />
										)}
									</div>
									<div>
										<h3
											className={`font-semibold ${
												achievement.isUnlocked
													? "text-green-800"
													: "text-gray-600"
											}`}
										>
											{achievement.name}
										</h3>
										<p
											className={`text-sm ${
												achievement.isUnlocked
													? "text-green-600"
													: "text-gray-500"
											}`}
										>
											{achievement.description}
										</p>
										{achievement.isUnlocked && achievement.unlockedAt && (
											<p className="text-xs text-green-500 mt-1">
												Unlocked {achievement.unlockedAt.toLocaleDateString()}
											</p>
										)}
									</div>
								</div>
								<div className="flex flex-col items-end gap-2">
									<Badge className={getRarityColor(achievement.rarity)}>
										{achievement.rarity}
									</Badge>
									<div className="text-sm font-medium text-yellow-600">
										+{achievement.xpBonus} XP
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

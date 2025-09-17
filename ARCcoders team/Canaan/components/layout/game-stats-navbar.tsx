"use client";

import { useUserGameStats } from "@/providers/user-game-stats-provider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Trophy, Medal, Star, RotateCcwIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import ThemeIndicator from "../theme-indicator";

// A small component to handle the countdown logic
const HeartTimer = ({ regenTime }: { regenTime: string }) => {
	const calculateTimeLeft = () => {
		const difference = +new Date(regenTime) - +new Date();
		let timeLeft = { minutes: 0, seconds: 0 };
		if (difference > 0) {
			timeLeft = {
				minutes: Math.floor((difference / 1000 / 60) % 60),
				seconds: Math.floor((difference / 1000) % 60),
			};
		}
		return timeLeft;
	};

	const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
	const { refetchStats } = useUserGameStats();

	useEffect(() => {
		const timer = setTimeout(() => {
			const newTimeLeft = calculateTimeLeft();
			setTimeLeft(newTimeLeft);
			if (newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
				refetchStats(); // Auto-refetch when timer hits zero
			}
		}, 1000);
		return () => clearTimeout(timer);
	});

	return (
		<span className="text-xs font-mono text-muted-foreground">
			{String(timeLeft.minutes).padStart(2, "0")}:
			{String(timeLeft.seconds).padStart(2, "0")}
		</span>
	);
};

export function GameStatsNavbar() {
	const { stats, isLoading } = useUserGameStats();

	// A simple component to render a single stat item
	const StatItem = ({
		icon,
		value,
		label,
	}: {
		icon: React.ReactNode;
		value: string | number;
		label: string;
	}) => (
		<div className="flex items-center gap-2 text-sm text-muted-foreground">
			{icon}
			<span className="font-medium text-foreground">{value}</span>
			<span className="hidden sm:inline-block">{label}</span>
		</div>
	);

	const LoadingSkeleton = () => (
		<div className="flex items-center gap-6">
			<Skeleton className="h-6 w-24" />
			<Skeleton className="h-6 w-24" />
			<Skeleton className="h-6 w-24" />
		</div>
	);

	return (
		<header className="sticky top-10 z-30 w-full">
			<div className="container flex items-center justify-between h-14 bg-background/80 backdrop-blur-lg py-8 rounded-full drop-shadow-lg">
				<div className="text-lg font-bold capitalize">
					{stats?.game_type || "Games"}
				</div>

				<div className="flex items-center gap-4 sm:gap-6">
					{isLoading ? (
						<LoadingSkeleton />
					) : (
						stats && (
							<>
								<div className="flex items-center gap-1.5">
									{stats.heart_regeneration_time && (
										<HeartTimer
											regenTime={stats.heart_regeneration_time as any}
										/>
									)}

									<Heart className="h-5 w-5 text-red-500" />
									<Badge
										variant="destructive"
										className="px-2.5 py-1 text-sm font-bold"
									>
										{stats.hearts}
									</Badge>
								</div>
								<StatItem
									icon={<Trophy className="h-5 w-5 text-yellow-500" />}
									value={stats.total_wins}
									label="Wins"
								/>
								<StatItem
									icon={<Medal className="h-5 w-5 text-blue-500" />}
									value={stats.best_score}
									label="Best"
								/>
								<StatItem
									icon={<RotateCcwIcon className="h-5 w-5 text-green-500" />}
									value={stats.current_daily_streak}
									label=" Daily Streak"
								/>
								<StatItem
									icon={<Star className="h-5 w-5 text-amber-500" />}
									value={stats.current_daily_streak}
									label=" Win Streak"
								/>
							</>
						)
					)}
					<ThemeIndicator />
				</div>
			</div>
		</header>
	);
}

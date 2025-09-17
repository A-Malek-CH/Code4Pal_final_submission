"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AchievementModal } from "@/components/achievement-modal";
import { Trophy, Target, Gamepad2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase/supabase";
import { Alert, AlertDescription } from "./ui/alert";
import { useAuth } from "./firebase-auth/AuthContext";
import { GameResult } from "@prisma/client";

interface Achievement {
	id: string;
	name: string;
	description: string;
	icon: string;
	xp_bonus: number;
}

interface AchievementResult {
	newly_unlocked_achievements: Achievement[];
	total_xp_gained: number;
}

export function GameResultTester() {
	const { user } = useAuth();
	const { toast } = useToast();

	const [gameResult, setGameResult] = useState<
		Omit<GameResult, "id" | "user_id">
	>({
		// === Core GameResult fields ===
		game_type: "Bingo",
		is_win: true,
		level: 3,
		base_points: 1500,
		final_points: 1850,
		time_spent: 85,
		correct_answers: 10,
		total_questions: 10,
		speed_bonus: 250,
		first_attempt_bonus: 100,
		played_at: new Date(),
		// === Extra fields (clean and simple) ===
		// Contains only the data needed for achievement logic.
		extra: {
			is_perfect: true,
			first_try_placements: 10,
			max_combo: 8,
		},
	});

	const [isLoading, setIsLoading] = useState(false);
	const [achievementResult, setAchievementResult] =
		useState<AchievementResult | null>(null);
	const [showModal, setShowModal] = useState(false);

	const gameTemplates = [
		{
			name: "Perfect Game",
			result: {
				// Core GameResult fields
				game_type: "Bingo",
				is_win: true,
				level: 3,
				base_points: 1500,
				final_points: 2000,
				time_spent: 90,
				correct_answers: 10,
				total_questions: 10,
				speed_bonus: 250,
				first_attempt_bonus: 250,

				// Correctly nested extra data
				extra: {
					is_perfect: true,
					first_try_placements: 10,
					max_combo: 8,
				},
			},
		},
		{
			name: "High Score (Quiz)",
			result: {
				// Core GameResult fields
				game_type: "Quiz",
				is_win: true,
				level: 2,
				base_points: 1200,
				final_points: 1500,
				time_spent: 180,
				correct_answers: 8,
				total_questions: 10,
				speed_bonus: 100,
				first_attempt_bonus: 200,

				// Correctly nested extra data
				extra: {
					is_perfect: false,
					first_try_placements: 7,
					max_combo: 5,
				},
			},
		},
		{
			name: "First Game (Loss)",
			result: {
				// Core GameResult fields
				game_type: "Bingo",
				is_win: false,
				level: 1,
				base_points: 300,
				final_points: 300,
				time_spent: 240,
				correct_answers: 3,
				total_questions: 10,
				speed_bonus: 0,
				first_attempt_bonus: 0,

				// Correctly nested extra data
				extra: {
					is_perfect: false,
					first_try_placements: 1,
					max_combo: 1,
				},
			},
		},
		{
			name: "Combo Master (Quiz)",
			result: {
				// Core GameResult fields
				game_type: "Quiz",
				is_win: true,
				level: 2,
				base_points: 900,
				final_points: 1200,
				time_spent: 150,
				correct_answers: 9,
				total_questions: 10,
				speed_bonus: 150,
				first_attempt_bonus: 150,

				// Correctly nested extra data
				extra: {
					is_perfect: false,
					first_try_placements: 8,
					max_combo: 10,
				},
			},
		},
		{
			name: "Win Streak Builder",
			result: {
				// Core GameResult fields
				game_type: "Bingo",
				is_win: true,
				level: 1,
				base_points: 500,
				final_points: 750,
				time_spent: 200,
				correct_answers: 7,
				total_questions: 10,
				speed_bonus: 100,
				first_attempt_bonus: 150,

				// Correctly nested extra data
				extra: {
					is_perfect: false,
					first_try_placements: 5,
					max_combo: 4,
				},
			},
		},
	];

	const isSupabaseConfigured = Boolean(
		supabase &&
			process.env.NEXT_PUBLIC_SUPABASE_URL &&
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
	);

	const handleSubmitGameResult = async () => {
		if (!user) {
			toast({
				title: "Error",
				description: "User not authenticated",
				variant: "destructive",
			});
			return;
		}

		if (!isSupabaseConfigured) {
			toast({
				title: "Configuration Error",
				description:
					"Supabase integration is not configured. Please set up Supabase in Project Settings.",
				variant: "destructive",
			});
			return;
		}

		setIsLoading(true);

		try {
			const { data, error } = await supabase.rpc(
				"handle_game_result_and_check_achievements",
				{
					p_user_id: user.id,
					p_game_result_payload: gameResult,
				}
			);

			if (error) {
				console.error("RPC Error:", error);
				throw new Error(error.message);
			}

			const result: AchievementResult = {
				newly_unlocked_achievements: data.newly_unlocked_achievements || [],
				total_xp_gained: data.total_xp_gained || 0,
			};

			setAchievementResult(result);

			if (result.newly_unlocked_achievements.length > 0) {
				setShowModal(true);
				toast({
					title: "Achievements Unlocked!",
					description: `You unlocked ${result.newly_unlocked_achievements.length} achievement(s) and gained ${result.total_xp_gained} XP!`,
				});
			} else {
				toast({
					title: "Game Result Processed",
					description: "No new achievements unlocked this time.",
				});
			}
		} catch (error) {
			console.error("Error processing game result:", error);
			toast({
				title: "Error",
				description: "Failed to process game result",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const loadTemplate = (template: (typeof gameTemplates)[0]) => {
		setGameResult({ ...template.result, played_at: new Date() });
		toast({
			title: "Template Loaded",
			description: `Loaded "${template.name}" template`,
		});
	};

	return (
		<div className="space-y-6">
			{!isSupabaseConfigured && (
				<Alert>
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>
						Supabase integration is not configured. Please add Supabase
						integration in Project Settings (gear icon in top right) to test the
						achievement system.
					</AlertDescription>
				</Alert>
			)}

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Gamepad2 className="h-5 w-5" />
						Quick Templates
					</CardTitle>
					<CardDescription>
						Load predefined game results for quick testing
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
						{gameTemplates.map((template, index) => (
							<Button
								key={index}
								variant="outline"
								onClick={() => loadTemplate(template)}
								className="h-auto p-3 flex flex-col items-center gap-2"
							>
								<span className="font-medium">{template.name}</span>
								<div className="flex gap-1">
									<Badge variant="secondary" className="text-xs">
										{template.result.final_points}pts
									</Badge>
									{template.result.extra.is_perfect && (
										<Badge variant="default" className="text-xs">
											Perfect
										</Badge>
									)}
								</div>
							</Button>
						))}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Target className="h-5 w-5" />
						Game Result Configuration
					</CardTitle>
					<CardDescription>
						Configure the game result parameters to test different achievement
						scenarios
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Section for Core Game Info */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="space-y-2">
							<Label htmlFor="game-type">Game Type</Label>
							<Select
								value={gameResult.game_type}
								onValueChange={(value) =>
									setGameResult((prev) => ({ ...prev, game_type: value }))
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Bingo">Bingo</SelectItem>
									<SelectItem value="Quiz">Quiz</SelectItem>
									<SelectItem value="Map">Map</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="level">Level</Label>
							<Input
								id="level"
								type="number"
								value={gameResult.level}
								onChange={(e) =>
									setGameResult((prev) => ({
										...prev,
										level: Number.parseInt(e.target.value) || 1,
									}))
								}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="time-spent">Time Spent (seconds)</Label>
							<Input
								id="time-spent"
								type="number"
								value={gameResult.time_spent}
								onChange={(e) =>
									setGameResult((prev) => ({
										...prev,
										time_spent: Number.parseInt(e.target.value) || 0,
									}))
								}
							/>
						</div>
					</div>

					<Separator />

					{/* Section for Points & Score */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="space-y-2">
							<Label htmlFor="base-points">Base Points</Label>
							<Input
								id="base-points"
								type="number"
								value={gameResult.base_points}
								onChange={(e) =>
									setGameResult((prev) => ({
										...prev,
										base_points: Number.parseInt(e.target.value) || 0,
									}))
								}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="final-points">Final Points</Label>
							<Input
								id="final-points"
								type="number"
								value={gameResult.final_points}
								onChange={(e) =>
									setGameResult((prev) => ({
										...prev,
										final_points: Number.parseInt(e.target.value) || 0,
									}))
								}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="speed-bonus">Speed Bonus</Label>
							<Input
								id="speed-bonus"
								type="number"
								value={gameResult.speed_bonus}
								onChange={(e) =>
									setGameResult((prev) => ({
										...prev,
										speed_bonus: Number.parseInt(e.target.value) || 0,
									}))
								}
							/>
						</div>
					</div>

					{/* Section for Answers & Bonuses */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="space-y-2">
							<Label htmlFor="correct-answers">Correct Answers</Label>
							<Input
								id="correct-answers"
								type="number"
								value={gameResult.correct_answers}
								onChange={(e) =>
									setGameResult((prev) => ({
										...prev,
										correct_answers: Number.parseInt(e.target.value) || 0,
									}))
								}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="total-questions">Total Questions</Label>
							<Input
								id="total-questions"
								type="number"
								value={gameResult.total_questions}
								onChange={(e) =>
									setGameResult((prev) => ({
										...prev,
										total_questions: Number.parseInt(e.target.value) || 0,
									}))
								}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="first-attempt-bonus">First Attempt Bonus</Label>
							<Input
								id="first-attempt-bonus"
								type="number"
								value={gameResult.first_attempt_bonus}
								onChange={(e) =>
									setGameResult((prev) => ({
										...prev,
										first_attempt_bonus: Number.parseInt(e.target.value) || 0,
									}))
								}
							/>
						</div>
					</div>

					<Separator />

					{/* Section for Achievement-Specific 'extra' data */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<Label htmlFor="first-try">First Try Placements</Label>
							<Input
								id="first-try"
								type="number"
								value={
									(gameResult.extra as Record<string, any>)
										?.first_try_placements ?? 0
								}
								onChange={(e) =>
									setGameResult((prev) => ({
										...prev,
										extra: {
											...(typeof prev.extra === "object" && prev.extra
												? prev.extra
												: {}),
											first_try_placements:
												Number.parseInt(e.target.value) || 0,
										},
									}))
								}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="max-combo">Max Combo</Label>
							<Input
								id="max-combo"
								type="number"
								value={
									(gameResult.extra as Record<string, any>)?.max_combo ?? 0
								}
								onChange={(e) =>
									setGameResult((prev) => ({
										...prev,
										extra: {
											...(typeof prev.extra === "object" && prev.extra
												? prev.extra
												: {}),
											max_combo: Number.parseInt(e.target.value) || 0,
										},
									}))
								}
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label htmlFor="is-win">Game Won</Label>
								<p className="text-sm text-muted-foreground">
									Did the player win this game?
								</p>
							</div>
							<Switch
								id="is-win"
								checked={gameResult.is_win}
								onCheckedChange={(checked) =>
									setGameResult((prev) => ({
										...prev,
										is_win: Boolean(checked),
									}))
								}
							/>
						</div>

						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label htmlFor="is-perfect">Perfect Game</Label>
								<p className="text-sm text-muted-foreground">
									Was this a perfect score?
								</p>
							</div>
							<Switch
								id="is-perfect"
								checked={
									!!(gameResult.extra as Record<string, any>)?.is_perfect
								}
								onCheckedChange={(checked) =>
									setGameResult((prev) => ({
										...prev,
										extra: {
											...(typeof prev.extra === "object" && prev.extra
												? prev.extra
												: {}),
											is_perfect: Boolean(checked),
										},
									}))
								}
							/>
						</div>
					</div>

					<Separator />

					<div className="flex justify-center">
						<Button
							onClick={handleSubmitGameResult}
							disabled={isLoading || !isSupabaseConfigured}
							size="lg"
							className="min-w-48"
						>
							{isLoading ? (
								<>
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
									Processing...
								</>
							) : (
								<>
									<Trophy className="h-4 w-4 mr-2" />
									Generate Game Result
								</>
							)}
						</Button>
					</div>
				</CardContent>
			</Card>

			{achievementResult && (
				<AchievementModal
					isOpen={showModal}
					onClose={() => setShowModal(false)}
					achievements={achievementResult.newly_unlocked_achievements}
					totalXp={achievementResult.total_xp_gained}
				/>
			)}
		</div>
	);
}

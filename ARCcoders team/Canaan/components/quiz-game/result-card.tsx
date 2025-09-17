"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils"; // Import your cn utility
import {
	CheckCircle,
	XCircle,
	Trophy,
	RotateCcw,
	ArrowRight,
	Loader2,
	Flag,
} from "lucide-react";

interface ResultCardProps {
	isVisible: boolean;
	isWin: boolean;
	currentScore?: number | null; // Score is null before server responds
	totalQuestions: number;
	correctAnswers: number;
	onSubmit: () => void; // Function to trigger the API submission
	onProceed: () => void; // Function to go to the next level after result is shown
	isSaving: boolean; // True while the API submission is in flight
	hasResult: boolean; // True only after the server has responded with a score
}

export function ResultCard({
	isVisible,
	isWin,
	currentScore,
	totalQuestions,
	correctAnswers,
	onSubmit,
	onProceed,
	isSaving,
	hasResult,
}: ResultCardProps) {
	const [showConfetti, setShowConfetti] = useState(false);
	const [showSadAnimation, setShowSadAnimation] = useState(false);

	useEffect(() => {
		// Trigger animations only AFTER the result from the server is available
		if (isVisible && hasResult) {
			if (isWin) {
				setShowConfetti(true);
				setTimeout(() => setShowConfetti(false), 5000);
			} else {
				setShowSadAnimation(true);
				setTimeout(() => setShowSadAnimation(false), 2000);
			}
		}
	}, [isVisible, hasResult, isWin]);

	if (!isVisible) return null;

	const percentage =
		totalQuestions > 0
			? Math.round((correctAnswers / totalQuestions) * 100)
			: 0;

	return (
		<>
			{/* Confetti animation remains the same, triggered by `showConfetti` state */}
			{showConfetti && (
				<div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50">
					{[...Array(60)].map((_, i) => (
						<div
							key={i}
							className="absolute w-2 h-4"
							style={{
								left: `${Math.random() * 100}%`,
								top: "-5%",
								backgroundColor: [
									"#ff6b6b",
									"#4ecdc4",
									"#45b7d1",
									"#96ceb4",
									"#feca57",
									"#ff9ff3",
								][Math.floor(Math.random() * 6)],
								animation: `fall ${3 + Math.random() * 3}s ${
									Math.random() * 2
								}s linear infinite`,
								"--translateX-end": `${(Math.random() - 0.5) * 400}px`,
								"--rotate-end": `${(Math.random() - 0.5) * 720}deg`,
							}}
						/>
					))}
				</div>
			)}

			<div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-40 p-4">
				<Card className="w-full max-w-md shadow-2xl border bg-card text-card-foreground animate-in zoom-in-95 duration-300">
					<CardHeader className="text-center space-y-4">
						{/* Icon changes based on whether we have a result from the server */}
						<div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center">
							{hasResult ? (
								isWin ? (
									<div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
										<CheckCircle className="w-8 h-8 text-primary" />
									</div>
								) : (
									<div className="bg-destructive/10 w-16 h-16 rounded-full flex items-center justify-center">
										<XCircle className="w-8 h-8 text-destructive" />
									</div>
								)
							) : (
								<div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center">
									<Flag className="w-8 h-8 text-muted-foreground " />
								</div>
							)}
						</div>

						<div className="space-y-2">
							<CardTitle
								className={cn(
									"text-2xl font-bold",
									hasResult && (isWin ? "text-primary" : "text-destructive")
								)}
							>
								{hasResult
									? isWin
										? "Game Complete!"
										: "Try Again!"
									: "Game Over"}
							</CardTitle>

							<div className="text-4xl">
								{hasResult ? (
									isWin ? (
										<span className="inline-block animate-bounce">😊</span>
									) : (
										<span
											className={cn(
												"inline-block",
												showSadAnimation && "animate-pulse"
											)}
										>
											😔
										</span>
									)
								) : (
									<span>🤔</span>
								)}
							</div>
						</div>
					</CardHeader>

					<CardContent className="space-y-6">
						<div className="bg-muted/50 rounded-lg p-4 space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium text-muted-foreground">
									Final Score:
								</span>
								{/* Shows the final score only after server responds */}
								<Badge variant="secondary">
									<Trophy className="w-3 h-3 mr-1" />
									{hasResult ? `${currentScore} points` : "Calculating..."}
								</Badge>
							</div>

							<div className="flex items-center justify-between">
								<span className="text-sm font-medium text-muted-foreground">
									Progress:
								</span>
								<span className="text-sm font-bold text-foreground">
									{correctAnswers}/{totalQuestions} correct
								</span>
							</div>

							<div className="w-full bg-muted rounded-full h-2">
								<div
									className="bg-primary h-2 rounded-full transition-all duration-500"
									style={{ width: `${percentage}%` }}
								/>
							</div>
						</div>

						<div className="flex gap-3">
							{/* THE MAIN ACTION BUTTON: Changes function and text based on state */}
							<Button
								onClick={hasResult ? onProceed : onSubmit}
								disabled={isSaving}
								className="flex-1"
							>
								{isSaving ? (
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								) : (
									hasResult && <ArrowRight className="w-4 h-4 ml-2" />
								)}
								{isSaving
									? "Submitting..."
									: hasResult
									? "Next Game"
									: "Submit & Continue"}
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>

			<style jsx>{`
				@keyframes fall {
					from {
						transform: translateY(0) translateX(0) rotate(0deg);
						opacity: 1;
					}
					to {
						transform: translateY(105vh) translateX(var(--translateX-end))
							rotate(var(--rotate-end));
						opacity: 0.5;
					}
				}
			`}</style>
		</>
	);
}

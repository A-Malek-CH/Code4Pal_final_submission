"use client";

import React, { useState, useCallback, useEffect } from "react";
import ReactFlow, {
	addEdge,
	Connection,
	useEdgesState,
	useNodesState,
	Node /* ... reactflow imports ... */,
	Edge,
	Controls,
	Background,
} from "reactflow";
import "reactflow/dist/style.css";

// --- HOOK & DATA IMPORTS ---
import { useRandomGame } from "@/hooks/use-random-game";
import { useSubmitGameResult } from "@/hooks/use-submit-game-result";
import {
	useGameProgress,
	UserInputPayload,
} from "@/providers/game-result-provider";
import { useAuth } from "../firebase-auth/AuthContext";
import { HistoricalEvent } from "@/types/quiz";

// --- COMPONENT IMPORTS ---
import { QuizNode } from "./quiz-node";
import { ResultCard } from "./result-card";
import { AchievementModal } from "@/components/achievement-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Error as ErrorComponent } from "../error-handlers";
import { Loader } from "../ui/loader";
import {
	Trophy,
	Target,
	CheckCircle,
	Network,
	Shield,
	Heart,
} from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useUserGameStats } from "@/providers/user-game-stats-provider";

const nodeTypes = { quiz: QuizNode };

export function MindMapQuiz({ gameMode = "single" }) {
	const { user } = useAuth();
	const { refetchStats, canPlay } = useUserGameStats();

	const {
		data: gameRecord,
		isLoading: isGameLoading,
		isError: isGameError,
		error: gameError,
	} = useRandomGame("quiz");
	const {
		status,
		userInput,
		dbResult,
		startGame,
		answerQuestion,
		endGame,
		setDbResult,
		resetGame,
	} = useGameProgress();
	const { mutate: submitResult, isPending: isSaving } = useSubmitGameResult();
	const queryClient = useQueryClient(); // <-- 2. GET AN INSTANCE OF THE QUERY CLIENT
	if (!canPlay) {
		return (
			<div className="flex flex-col items-center justify-center h-screen text-center">
				<Heart className="w-16 h-16 mb-4 text-red-500/50" />
				<h2 className="text-2xl font-bold">Out of Hearts!</h2>
				<p className="text-muted-foreground">
					Please wait for your hearts to regenerate to play again.
				</p>
			</div>
		);
	}
	// --- LOCAL UI & REACTFLOW STATE ---
	const [nodes, setNodes, onNodesChange] = useNodesState([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);
	const [totalQuestionsInLevel, setTotalQuestionsInLevel] = useState(0);
	// const [attemptsLeft, setAttemptsLeft] = useState(0);
	const [quizKey, setQuizKey] = useState(0);
	const [achievementData, setAchievementData] = useState<any>(null);
	const [showAchievementModal, setShowAchievementModal] = useState(false);

	const handleAnswerResult = useCallback(
		(isCorrect: boolean) => {
			answerQuestion({ isCorrect });
		},
		[answerQuestion]
	);

	const onConnect = useCallback(
		(params: Connection) => setEdges((eds) => addEdge(params, eds)),
		[setEdges]
	);

	const createMindMapNodes = useCallback(
		(event: HistoricalEvent) => {
			if (!user?.id || !gameRecord?.event_id) return;

			const centerNode: Node = {
				id: "center",
				type: "quiz",
				position: { x: 450, y: 250 },
				data: {
					label: event.title,
					isHidden: false,
					correctAnswer: event.title,
					options: [],
					category: "title",
					onAnswerResult: handleAnswerResult,
				},
				style: {
					background: "hsl(var(--background))",
					color: "hsl(var(--primary-foreground))",
					border: "none",
					borderRadius: "15px",
					fontSize: "13px",
					fontWeight: "bold",
					// width: 300,
					// height: 90,
					textAlign: "center",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				},
			};
			const allNodes: Node[] = [centerNode];
			const allEdges: Edge[] = [];
			let nodeId = 1;
			let hiddenCount = 0;
			const elementsToHide = [0, 1, 2, 3, 4];
			event.storyElements.forEach((element: any, index: number) => {
				const shouldHide =
					elementsToHide.includes(index) && element.options.length > 0;
				if (shouldHide) hiddenCount++;
				allNodes.push({
					id: `story-${nodeId}`,
					type: "quiz",
					position: element.position,
					data: {
						label: shouldHide ? `${element.category}?` : element.text,
						isHidden: shouldHide,
						correctAnswer: element.correctAnswer,
						options: shouldHide ? element.options : [],
						category: element.category,
						onAnswerResult: handleAnswerResult,
					},
					style: { border: "none", borderRadius: "12px", fontSize: "11px" },
				});
				allEdges.push({
					id: `edge-center-story-${nodeId}`,
					source: "center",
					target: `story-${nodeId}`,
					animated: true,
				});
				nodeId++;
			});
			event.storyConnections.forEach((connection: any) => {
				allEdges.push({
					id: `edge-story-${connection.from}-${connection.to}`,
					source: `story-${connection.from + 1}`,
					target: `story-${connection.to + 1}`,
					style: {
						stroke: "hsl(var(--border))",
						strokeWidth: 1.5,
						strokeDasharray: "5,5",
					},
					animated: false,
					label: connection.relationship,
					labelStyle: {
						fontSize: "10px",
						fill: "hsl(var(--muted-foreground))",
					},
				});
			});
			hiddenCount++;
			allNodes.push({
				id: `date-${nodeId}`,
				type: "quiz",
				position: { x: 450, y: 50 },
				data: {
					label: "Date Range?",
					isHidden: true,
					correctAnswer: event.date,
					options: event.dateOptions,
					category: "date",
					onAnswerResult: handleAnswerResult,
				},
				style: {
					background: "hsl(var(--accent))",
					color: "hsl(var(--accent-foreground))",
					border: "none",
					borderRadius: "12px",
					fontSize: "12px",
					width: 200,
					height: 60,
				},
			});
			allEdges.push({
				id: `edge-center-date-${nodeId}`,
				source: "center",
				target: `date-${nodeId}`,
				style: { stroke: "hsl(var(--ring))", strokeWidth: 2 },
				animated: true,
			});

			setTotalQuestionsInLevel(hiddenCount);
			// setAttemptsLeft(hiddenCount * 2);
			setNodes(allNodes);
			setEdges(allEdges);
			startGame({
				userId: user.id,
				gameType: "quiz",
				firstAttempt: true, // You'll need logic to determine this
				extra: { eventId: gameRecord.event_id },
			});
		},
		[handleAnswerResult, setNodes, setEdges, user, gameRecord, startGame]
	);

	useEffect(() => {
		if (gameRecord) {
			createMindMapNodes(gameRecord.game);
			setQuizKey((prev) => prev + 1);
		}
	}, [gameRecord, createMindMapNodes]);

	useEffect(() => {
		const answeredCount = userInput.total_questions || 0;
		// attemptsLeft <= 0
		if (
			status === "playing" &&
			answeredCount >= totalQuestionsInLevel &&
			totalQuestionsInLevel > 0
		) {
			endGame();
		}
	}, [
		userInput.total_questions,
		totalQuestionsInLevel,
		// attemptsLeft,
		status,
		endGame,
	]);

	const proceedToNextLevel = useCallback(() => {
		setShowAchievementModal(false);

		// --- 3. THE CRUCIAL FIX ---
		// First, clear the visual state and the game progress state.
		setNodes([]);
		setEdges([]);
		resetGame();

		// Then, tell react-query that the old random game data is stale.
		// This will force `useRandomGame` to refetch from the server on its next render.
		queryClient.invalidateQueries({ queryKey: ["randomGame", "quiz"] });
	}, [resetGame, queryClient]);

	const handleNextLevel = useCallback(() => {
		if (status !== "finished" || !userInput.user_id) return;
		submitResult(userInput as UserInputPayload, {
			onSuccess: (data) => {
				setDbResult({ points: data.points, is_win: data.is_win });
				toast.success(`You gained ${data.total_xp_gained} XP!`);
				setAchievementData(data);
				if (data.newly_unlocked_achievements?.length > 0) {
					setShowAchievementModal(true);
				} else {
					// No achievements, but we want the user to see their score before moving on.
					// The ResultCard will now have a button that calls proceedToNextLevel.
				}
				refetchStats();

				setNodes([]);
				setEdges([]);
			},
		});
	}, [status, userInput, submitResult, setDbResult, proceedToNextLevel]);

	if (!user)
		return (
			<div className="flex items-center justify-center h-screen">
				<p>Please sign in to play.</p>
			</div>
		);
	if (isGameLoading)
		return (
			<div className="flex items-center justify-center h-screen w-full">
				<Loader size="lg" />
			</div>
		);
	if (isGameError)
		return (
			<ErrorComponent message={`Error loading game: ${gameError.message}`} />
		);
	if (!gameRecord)
		return (
			<div className="flex items-center justify-center h-screen">
				<p>No game available. Try again later.</p>
			</div>
		);

	const progress =
		totalQuestionsInLevel > 0
			? ((userInput.correct_answers || 0) / totalQuestionsInLevel) * 100
			: 0;

	return (
		<div className="h-screen w-full relative">
			<ResultCard
				// --- FIX: Visibility is now tied ONLY to the game status ---
				isVisible={status === "finished"}
				isWin={dbResult?.is_win || false}
				currentScore={dbResult?.points || 0} // Can be null initially
				totalQuestions={totalQuestionsInLevel}
				correctAnswers={userInput.correct_answers || 0}
				// Differentiate between triggering the submission and proceeding after
				onSubmit={handleNextLevel}
				onProceed={proceedToNextLevel}
				isSaving={isSaving}
				// Let the card know if the result has been calculated by the server
				hasResult={!!dbResult}
			/>

			{achievementData && (
				<AchievementModal
					isOpen={showAchievementModal}
					onClose={proceedToNextLevel}
					achievements={achievementData.newly_unlocked_achievements || []}
					totalXp={achievementData.total_xp_gained}
				/>
			)}

			<Card className="absolute top-4 left-4 z-10 bg-card/90 backdrop-blur-sm border-0 shadow-lg w-64">
				<CardHeader className="pb-2">
					<CardTitle className="text-lg flex items-center gap-2 text-card-foreground">
						<Trophy className="w-5 h-5 text-yellow-500" />
						History Mind Map Quiz
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					<div className="text-xs text-muted-foreground">
						Player: {user.display_name || "Player"}
					</div>
					<div className="flex items-center gap-2">
						<Network className="w-4 h-4 text-purple-500" />
						<span className="text-sm font-medium text-card-foreground">
							{gameRecord.game.title}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<Target className="w-4 h-4 text-blue-500" />
						{/* Show final score only after it's calculated */}
						<span className="text-sm font-medium text-card-foreground">
							Score:{" "}
							{dbResult
								? dbResult.points
								: (userInput.correct_answers || 0) * 10}
							{status === "playing" && "..."}
						</span>
					</div>
					{/* <div className="flex items-center gap-2">
						<Shield className="w-4 h-4 text-red-500" />
						<span className="text-sm font-medium text-card-foreground">
							{attemptsLeft} Attempts Left
						</span>
					</div> */}
					<div className="flex items-center gap-2">
						<CheckCircle className="w-4 h-4 text-green-500" />
						<span className="text-sm font-medium text-card-foreground">
							{userInput.correct_answers || 0}/{totalQuestionsInLevel} Correct
						</span>
					</div>
					<Progress value={progress} className="w-full" />
					{progress === 100 && totalQuestionsInLevel > 0 && (
						<Badge className="bg-primary text-primary-foreground animate-pulse">
							🎉 History Mastered!
						</Badge>
					)}
				</CardContent>
			</Card>

			<ReactFlow
				key={quizKey}
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				nodeTypes={nodeTypes}
				fitView
				className="bg-background"
			>
				<Controls className="bg-popover/80 backdrop-blur-sm border-none shadow-lg" />
				<Background color="hsl(var(--border))" gap={20} />
			</ReactFlow>
		</div>
	);
}

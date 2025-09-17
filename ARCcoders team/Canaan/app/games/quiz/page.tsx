"use client";

import { useState } from "react";
import { MindMapQuiz } from "@/components/quiz-game/mind-map-quiz";
import { GameModeSelector } from "@/components/quiz-game/game-mode-selector";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Play, Network } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
	const [gameStarted, setGameStarted] = useState(false);
	const [gameKey, setGameKey] = useState(0);
	const [showModeSelector, setShowModeSelector] = useState(false);
	const [gameMode, setGameMode] = useState<"single" | "multiplayer">("single");
	const router = useRouter();
	const startNewGame = () => {
		setShowModeSelector(true);
	};

	const handleModeSelect = (mode: "single" | "multiplayer") => {
		setGameMode(mode);
		setShowModeSelector(false);
		if (mode === "multiplayer") {
			router.push("/quiz-game/multiplayer");
			return;
		}
		setGameStarted(true);
		setGameKey((prev) => prev + 1);
	};

	const resetGame = () => {
		setGameStarted(false);
		setShowModeSelector(false);
		setGameKey((prev) => prev + 1);
	};

	if (showModeSelector) {
		return (
			<>
				<GameModeSelector
					onModeSelect={handleModeSelect}
					onBack={() => setShowModeSelector(false)}
				/>
			</>
		);
	}

	if (!gameStarted) {
		return (
			<div className="min-h-screen bg-background  flex items-center justify-center p-4">
				<Card className="w-full max-w-2xl shadow-2xl border-0  backdrop-blur-sm">
					<CardHeader className="text-center space-y-4">
						<div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center">
							<Network className="w-8 h-8" />
						</div>
						<CardTitle className="text-3xl font-bold  bg-clip-text text-primary">
							Palestinian History Mind Map
						</CardTitle>
						<CardDescription className="text-lg ">
							Learn about the roots of Palestinian peasant resistance and its
							steadfastness over time(1900-2025)
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="bg-gradient-to-r  rounded-lg p-4">
							<h3 className="font-semibold  mb-2">Historical Event:</h3>
							<p className="text-base  mb-3">
								"A century of Palestinian resistance to land seizure"
							</p>
							<ul className="text-base  space-y-1">
								<li>
									• Trace the intertwined history of land grabs and defiance
								</li>
								<li>
									• 6 story elements are hidden - complete the historical
									narrative
								</li>
								<li>
									• Explor Ottoman policies,native resistance and Imperial
									influence
								</li>
								<li>
									• See how one event led to another in this complex historical
									moment
								</li>
							</ul>
						</div>
						<Button
							onClick={startNewGame}
							className="w-full  py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
						>
							<Play className="w-5 h-5 mr-2" />
							Explore the Story Network
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Note: The UI for this view is handled inside the MindMapQuiz component */}
			<MindMapQuiz key={gameKey} gameMode={gameMode} />
		</div>
	);
}

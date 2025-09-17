import { GameResult } from "@prisma/client";

// A union of all possible event names for type safety.
export type GamificationEventName = "user_login" | "game_completed";

// A mapped type that ensures each event name is associated with the correct payload shape.
export type GamificationEventPayload = {
	user_login: {
		userId: string;
	};
	game_completed: {
		gameType: "Map" | "Bingo" | string;
		score: number;
		isWin: boolean;
		isPerfectGame: boolean;
		timeSpentSeconds: number;
		// The 'extra' field from a GameResult, for custom tracking
		extra?: {
			[key: string]: any; // Allows for any other game-specific metrics
		};
	};
};

// Generic type for the trackEvent function
export type TrackEventFunction = <T extends GamificationEventName>(
	name: T,
	payload: GamificationEventPayload[T]
) => void;

// The shape of the context value provided by GamificationProvider
export interface GamificationContextType {
	trackEvent: TrackEventFunction;
	isProcessing: boolean;
}

// Types for the GameProgressProvider

// New interface for configurable game settings
export interface GameConfig {
	userId: string;
	gameType: "Bingo" | "Map" | string;
	level: number;
	winConditionScore: number;
	mockCharacterPlacements: number;
}

export type GameStatus = "idle" | "playing" | "finished";

// Updated GameState to include the config
export interface GameState {
	status: GameStatus;
	score: number;
	startTime: number | null;
	correctAnswers: number;
	totalQuestions: number;
	extra: Record<string, any>;
	gameResult: GameResult | null;
	gameConfig: GameConfig;
}

// Updated GameProgressContextType to include config and updater function
export interface GameProgressContextType extends GameState {
	startGame: () => void;
	answerQuestion: (isCorrect: boolean) => void;
	endGame: () => void;
	resetGame: () => void;
	updateConfig: (newConfig: Partial<GameConfig>) => void;
}

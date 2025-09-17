"use client";
import React, {
	createContext,
	useContext,
	useReducer,
	ReactNode,
	useCallback,
} from "react";
import { JsonValue } from "@prisma/client/runtime/library";
import { GameResult } from "@prisma/client";

// Define the shape of the data the client sends to the server
export type UserInputPayload = Omit<GameResult, "id" | "played_at">;

// Define the shape of the data the server calculates and returns
export type DbResultPayload = {
	points: number;
	is_win: boolean;
};

// The combined state object for a completed game
export type CompletedGameResult = {
	userInput: UserInputPayload;
	dbResult: DbResultPayload | null; // Null until the server responds
};

// The state managed by our reducer
type GameProgressState = {
	status: "idle" | "playing" | "finished";
	startTime: number | null;
	userInput: Partial<UserInputPayload>; // Build the user input piece by piece
	dbResult: DbResultPayload | null;
};

// Payload to start a game
type StartGamePayload = {
	userId: string;
	gameType: string;
	firstAttempt: boolean;
	extra?: JsonValue;
};

// Actions for the reducer
type Action =
	| { type: "START_GAME"; payload: StartGamePayload }
	| { type: "ANSWER_QUESTION"; payload: { isCorrect: boolean } }
	| { type: "END_GAME" }
	| { type: "SET_DB_RESULT"; payload: DbResultPayload }
	| { type: "RESET_GAME" };

// The initial state for the game progress
const initialState: GameProgressState = {
	status: "idle",
	startTime: null,
	userInput: {},
	dbResult: null,
};

// The reducer function to manage game state
const gameProgressReducer = (
	state: GameProgressState,
	action: Action
): GameProgressState => {
	switch (action.type) {
		case "START_GAME": {
			const { userId, gameType, firstAttempt, extra } = action.payload;
			return {
				...initialState, // Fully reset
				status: "playing",
				startTime: Date.now(),
				userInput: {
					user_id: userId,
					game_type: gameType,
					first_attempt: firstAttempt,
					extra: extra || {},
					correct_answers: 0,
					total_questions: 0,
				},
			};
		}

		case "ANSWER_QUESTION": {
			if (state.status !== "playing") return state;
			const { isCorrect } = action.payload;
			return {
				...state,
				userInput: {
					...state.userInput,
					total_questions: (state.userInput.total_questions || 0) + 1,
					correct_answers: isCorrect
						? (state.userInput.correct_answers || 0) + 1
						: state.userInput.correct_answers,
				},
			};
		}

		case "END_GAME": {
			if (state.status !== "playing" || !state.startTime) return state;
			const timeSpent = Math.round((Date.now() - state.startTime) / 1000);
			return {
				...state,
				status: "finished",
				userInput: {
					...state.userInput,
					time_spent: timeSpent,
				},
			};
		}

		case "SET_DB_RESULT": {
			// After submission, store the server's calculated result
			return {
				...state,
				dbResult: action.payload,
			};
		}

		case "RESET_GAME":
			return initialState;

		default:
			return state;
	}
};

// The shape of the context provided to consuming components
type GameProgressContextType = GameProgressState & {
	startGame: (payload: StartGamePayload) => void;
	answerQuestion: (payload: { isCorrect: boolean }) => void;
	endGame: () => void;
	setDbResult: (payload: DbResultPayload) => void;
	resetGame: () => void;
};

const GameProgressContext = createContext<GameProgressContextType | undefined>(
	undefined
);

export const GameProgressProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [state, dispatch] = useReducer(gameProgressReducer, initialState);

	const startGame = useCallback(
		(payload: StartGamePayload) => dispatch({ type: "START_GAME", payload }),
		[]
	);
	const answerQuestion = useCallback(
		(payload: { isCorrect: boolean }) =>
			dispatch({ type: "ANSWER_QUESTION", payload }),
		[]
	);
	const endGame = useCallback(() => dispatch({ type: "END_GAME" }), []);
	const setDbResult = useCallback(
		(payload: DbResultPayload) => dispatch({ type: "SET_DB_RESULT", payload }),
		[]
	);
	const resetGame = useCallback(() => dispatch({ type: "RESET_GAME" }), []);

	const contextValue: GameProgressContextType = {
		...state,
		startGame,
		answerQuestion,
		endGame,
		setDbResult,
		resetGame,
	};

	return (
		<GameProgressContext.Provider value={contextValue}>
			{children}
		</GameProgressContext.Provider>
	);
};

export const useGameProgress = (): GameProgressContextType => {
	const context = useContext(GameProgressContext);
	if (context === undefined) {
		throw new Error(
			"useGameProgress must be used within a GameProgressProvider"
		);
	}
	return context;
};

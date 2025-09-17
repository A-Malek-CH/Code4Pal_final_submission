"use client";

import { useState, useCallback } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X, EyeOff, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you have a cn utility

interface QuizNodeData {
	label: string;
	isHidden: boolean;
	correctAnswer: string;
	options: string[];
	category: string;
	onAnswerResult?: (isCorrect: boolean) => void;
}

export function QuizNode({ data }: NodeProps<QuizNodeData>) {
	const [showOptions, setShowOptions] = useState(false);
	const [selectedOption, setSelectedOption] = useState<string | null>(null);
	const [isRevealed, setIsRevealed] = useState(!data.isHidden);
	const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
	const [isAnswered, setIsAnswered] = useState(false); // <-- NEW: Tracks if the question has been answered

	const handleReveal = useCallback(() => {
		// Only allow revealing if it's a hidden question and hasn't been answered yet
		if (
			data.isHidden &&
			!isRevealed &&
			!isAnswered &&
			data.options?.length > 0
		) {
			setShowOptions(true);
		}
	}, [data.isHidden, isRevealed, isAnswered, data.options]);

	const handleOptionSelect = useCallback(
		(option: string) => {
			if (isAnswered) return; // Prevent changing the answer

			const correct = option === data.correctAnswer;

			// Set all states to lock the node
			setIsAnswered(true);
			setSelectedOption(option);
			setIsCorrect(correct);

			// Report the result (correct or incorrect) to the parent component ONCE
			if (data.onAnswerResult) {
				data.onAnswerResult(correct);
			}

			// Reveal the correct answer after a short delay, regardless of the user's choice
			setTimeout(() => {
				setIsRevealed(true);
				setShowOptions(false);
			}, 1200); // Give the user time to see the feedback
		},
		[data.correctAnswer, data.onAnswerResult, isAnswered]
	);

	// --- (Helper functions `getCategoryIcon` and `getQuestionText` remain the same) ---
	const getCategoryIcon = (category: string) => {
		switch (category) {
			case "date":
				return "📅";
			case "location":
				return "📍";
			case "context":
				return "📖";
			case "action":
				return "🎬";
			case "title":
				return "🏷️";
			default:
				return "📋";
		}
	};
	const getQuestionText = (category: string) => {
		return `What was the ${category.toLowerCase()} of this event?`;
	};

	if (showOptions && !isRevealed) {
		return (
			<>
				<Handle
					type="target"
					position={Position.Top}
					className="!bg-transparent"
				/>
				<Card className="p-4 min-w-[350px] max-w-[450px] shadow-lg border-2 border-dashed border-primary/50 bg-card z-20">
					<div className="space-y-3">
						<div className="text-center">
							<div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mb-2">
								{getCategoryIcon(data.category)}
								<span className="capitalize font-medium">{data.category}</span>
							</div>
							<div className="text-sm font-medium text-primary flex items-center justify-center gap-2 text-center px-2">
								<HelpCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
								<span>{getQuestionText(data.category)}</span>
							</div>
						</div>
						<div className="space-y-2">
							{data.options.map((option, index) => (
								<Button
									key={index}
									onClick={() => handleOptionSelect(option)}
									variant="outline"
									className={cn(
										"w-full text-left justify-start p-3 h-auto text-xs leading-relaxed hover:bg-primary/5 transition-all whitespace-normal",
										selectedOption === option &&
											isCorrect === true &&
											"bg-primary/10 border-primary/50 text-primary",
										selectedOption === option &&
											isCorrect === false &&
											"bg-destructive/10 border-destructive/50 text-destructive"
									)}
									disabled={isAnswered} // Disable all buttons after an answer is selected
								>
									<div className="flex items-start gap-2 w-full">
										<span className="font-medium text-primary/80 mt-0.5">
											{String.fromCharCode(65 + index)}.
										</span>
										<span className="flex-1">{option}</span>
										{selectedOption === option && (
											<span className="ml-2 self-center">
												{isCorrect ? (
													<Check className="w-4 h-4 text-primary" />
												) : (
													<X className="w-4 h-4 text-destructive" />
												)}
											</span>
										)}
									</div>
								</Button>
							))}
						</div>
						{/* No need for a "Cancel" button if an answer is final */}
					</div>
				</Card>
				<Handle
					type="source"
					position={Position.Bottom}
					className="!bg-transparent"
				/>
			</>
		);
	}

	return (
		<Card
			className={cn(
				"p-3 min-w-[140px] shadow-lg transition-all duration-200",
				data.isHidden &&
					!isRevealed &&
					"cursor-pointer hover:shadow-xl border-2 border-dashed border-primary/40 hover:border-primary/60",
				!data.isHidden && "border-0"
			)}
			onClick={handleReveal}
		>
			<Handle type="target" position={Position.Top} className="w-3 h-3" />
			<Handle type="source" position={Position.Bottom} className="w-3 h-3" />
			<div className="text-center">
				<div className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1">
					{getCategoryIcon(data.category)}
					<span className="capitalize">{data.category}</span>
				</div>
				<div className="font-medium text-sm flex items-center justify-center gap-2">
					{data.isHidden && !isRevealed ? (
						<>
							<EyeOff className="w-4 h-4 text-primary/70" />
							<span className="text-primary/90">Click to reveal</span>
						</>
					) : (
						<span
							className={cn(
								"leading-tight text-center text-card-foreground",
								isAnswered && isCorrect === true && "text-primary font-bold",
								isAnswered &&
									isCorrect === false &&
									"text-destructive line-through"
							)}
						>
							{isAnswered && !isCorrect ? selectedOption : data.correctAnswer}
						</span>
					)}
				</div>
				{isAnswered && !isCorrect && (
					<div className="text-xs text-primary dark:text-green-400 mt-1 flex items-center justify-center gap-1">
						<Check className="w-3 h-3" /> Correct was: {data.correctAnswer}
					</div>
				)}
			</div>
		</Card>
	);
}

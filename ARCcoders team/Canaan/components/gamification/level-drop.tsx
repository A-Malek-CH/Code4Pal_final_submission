// enhanced-design-opaque/LevelDrop.tsx

"use client";

import { Badge } from "@/components/ui/badge";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";
import { motion } from "motion/react";

export default function LevelDrop() {
	const level = 30;
	const xp = 750;
	const xpToNextLevel = 1000;
	const progressPercentage = (xp / xpToNextLevel) * 100;

	return (
		<div className="fixed top-0 left-0 z-[999] w-full pointer-events-none base-grid py-sides">
			<div className="col-span-8 col-start-5">
				<div className="hidden px-6 lg:block">
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, ease: "easeInOut" }}
					>
						<Popover>
							<PopoverTrigger asChild>
								<Badge
									// The key changes are in this className prop
									className="
                                        pointer-events-auto cursor-pointer transition-all 
                                        h-10 px-4 rounded-full text-base font-semibold
                                        bg-background text-primary border border-border
                                        hover:bg-background/70 hover:scale-105
                                    "
								>
									<Star className="w-4 h-4 mr-2 text-yellow-400 fill-yellow-400" />
									Level <AnimatedNumber num={level} />
								</Badge>
							</PopoverTrigger>
							<PopoverContent className="w-64 mt-2 pointer-events-auto">
								<div className="grid gap-4">
									<div className="space-y-2">
										<h4 className="font-medium leading-none">Your Progress</h4>
										<p className="text-sm text-muted-foreground">
											You're on your way to Level {level + 1}!
										</p>
									</div>
									<div className="grid gap-2">
										<div className="flex items-baseline justify-between">
											<span className="text-sm font-medium">Next Level</span>
											<span className="text-sm text-muted-foreground">
												{xp} / {xpToNextLevel} XP
											</span>
										</div>
										<Progress value={progressPercentage} className="h-2" />
									</div>
								</div>
							</PopoverContent>
						</Popover>
					</motion.div>
				</div>
			</div>
		</div>
	);
}

// Helper component to animate the number change
function AnimatedNumber({ num }: { num: number }) {
	return (
		<motion.span
			key={num}
			initial={{ y: 10, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			exit={{ y: -10, opacity: 0 }}
			transition={{ duration: 0.2 }}
			className="inline-block ml-1"
		>
			{num}
		</motion.span>
	);
}

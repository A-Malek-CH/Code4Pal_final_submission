"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trophy, Star, Zap, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface Achievement {
	id: string;
	name: string;
	description: string;
	icon: string;
	xp_bonus: number;
}

interface AchievementModalProps {
	isOpen: boolean;
	onClose: () => void;
	achievements: Achievement[];
	totalXp: number;
}

export function AchievementModal({
	isOpen,
	onClose,
	achievements,
	totalXp,
}: AchievementModalProps) {
	if (achievements.length === 0) return null;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-md bg-card border-border fixed bottom-4 right-4 top-auto left-auto translate-x-0 translate-y-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom-2 data-[state=open]:slide-in-from-bottom-2">
				<DialogHeader className="text-center pb-4">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
						<Trophy className="h-8 w-8 text-primary" />
					</div>
					<DialogTitle className="text-2xl font-bold text-foreground">
						{achievements.length === 1
							? "Achievement Unlocked!"
							: "Achievements Unlocked!"}
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					{achievements.map((achievement, index) => (
						<div key={achievement.id}>
							<div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border border-border">
								<div className="flex-shrink-0">
									<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl">
										<Avatar>
											<AvatarImage
												src={achievement.icon}
												alt={achievement.name}
											/>
											<AvatarFallback>
												{achievement.name.charAt(0).toUpperCase()}
											</AvatarFallback>
										</Avatar>
									</div>
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2 mb-1">
										<h3 className="font-semibold text-foreground truncate">
											{achievement.name}
										</h3>
										<Badge
											variant="secondary"
											className="flex items-center gap-1"
										>
											<Star className="h-3 w-3" />
											{achievement.xp_bonus} XP
										</Badge>
									</div>
									<p className="text-sm text-muted-foreground">
										{achievement.description}
									</p>
								</div>
							</div>
							{index < achievements.length - 1 && (
								<Separator className="my-2" />
							)}
						</div>
					))}

					{totalXp > 0 && (
						<>
							<Separator />
							<div className="flex items-center justify-center gap-2 p-4 rounded-lg bg-primary/5 border border-primary/20">
								<Zap className="h-5 w-5 text-primary" />
								<span className="font-semibold text-foreground">
									Total XP Gained: {totalXp}
								</span>
							</div>
						</>
					)}

					<div className="flex justify-center pt-4">
						<Button onClick={onClose} className="min-w-32">
							<X className="h-4 w-4 mr-2" />
							Close
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

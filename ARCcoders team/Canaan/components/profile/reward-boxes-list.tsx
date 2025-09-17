"use client";

import { Box, MailOpen } from "lucide-react";
import type { UserProfileWithDetails } from "@/hooks/use-user-profile";

type RewardBoxes = UserProfileWithDetails["user_reward_box"];

interface RewardBoxesListProps {
	boxes: RewardBoxes;
}

export function RewardBoxesList({ boxes }: RewardBoxesListProps) {
	if (boxes.length === 0) {
		return (
			<p className="text-center text-sm text-muted-foreground py-8">
				No reward boxes earned yet.
			</p>
		);
	}

	return (
		<div className="grid grid-cols-2 gap-4">
			{boxes.map(({ reward_box, is_opened, earned_at }) => (
				<div
					key={reward_box.id}
					className="p-4 border rounded-lg text-center flex flex-col items-center justify-center"
				>
					{is_opened ? (
						<MailOpen className="h-8 w-8 text-muted-foreground mb-2" />
					) : (
						<Box className="h-8 w-8 text-primary mb-2" />
					)}
					<p className="font-semibold text-sm">{reward_box.name}</p>
					<p className="text-xs text-muted-foreground">
						{is_opened
							? "Opened"
							: `Earned ${new Date(earned_at).toLocaleDateString()}`}
					</p>
				</div>
			))}
		</div>
	);
}

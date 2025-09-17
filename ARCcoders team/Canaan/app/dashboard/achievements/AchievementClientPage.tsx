"use client";

import { useState } from "react";
import {
	useGetAchievements,
	useDeleteAchievement,
} from "@/hooks/useAchievements";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { AchievementForm } from "./AchievementForm";
import { Achievement } from "@/types/database.types";
import { Trash2, Edit } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AchievementClientPage() {
	const { data: achievements, isLoading, error } = useGetAchievements();
	const deleteMutation = useDeleteAchievement();

	const [isFormOpen, setIsFormOpen] = useState(false);
	const [selectedAchievement, setSelectedAchievement] =
		useState<Achievement | null>(null);

	const handleAddNew = () => {
		setSelectedAchievement(null);
		setIsFormOpen(true);
	};

	const handleEdit = (achievement: Achievement) => {
		setSelectedAchievement(achievement);
		setIsFormOpen(true);
	};

	const handleDelete = (id: string) => {
		if (window.confirm("Are you sure you want to delete this achievement?")) {
			deleteMutation.mutate(id);
		}
	};

	const closeForm = () => {
		setIsFormOpen(false);
		setSelectedAchievement(null);
	};

	if (isLoading) return <div>Loading achievements...</div>;
	if (error) return <div>Error: {error.message}</div>;

	if (isFormOpen) {
		return (
			<AchievementForm
				achievement={selectedAchievement}
				onFinished={closeForm}
			/>
		);
	}

	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-semibold">Manage Achievements</h2>
				<Button onClick={handleAddNew}>Add New Achievement</Button>
			</div>

			<div className="space-y-4">
				{achievements?.map((achievement) => (
					<Card key={achievement.id}>
						<CardHeader className="flex flex-row items-center justify-between">
							<div>
								<Avatar>
									<AvatarImage src={achievement.icon} alt={achievement.name} />
									<AvatarFallback>{achievement.name.charAt(0)}</AvatarFallback>
								</Avatar>
								<CardTitle>{achievement.name}</CardTitle>
								<CardDescription>
									{achievement.category} - {achievement.xp_bonus} XP
								</CardDescription>
							</div>
							<div className="flex items-center space-x-2">
								<Button
									variant="ghost"
									size="icon"
									onClick={() => handleEdit(achievement)}
								>
									<Edit className="h-4 w-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => handleDelete(achievement.id)}
									disabled={deleteMutation.isPending}
								>
									<Trash2 className="h-4 w-4 text-red-500" />
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<p>{achievement.description}</p>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}

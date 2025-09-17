"use client";

import { useState } from "react";
import { useActors } from "@/hooks/useActors";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search, User, Eye } from "lucide-react";
import { Actor } from "@prisma/client";
import { RichTextReader } from "../text-editor/rich-text-reader";

export function ActorsManagement() {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedActor, setSelectedActor] = useState<Actor | null>(null);
	const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

	const { data: actors = [], isLoading, error } = useActors();

	const filteredActors = actors.filter(
		(actor) =>
			actor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			actor.description?.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleViewActor = (actor: Actor) => {
		setSelectedActor(actor);
		setIsDetailDialogOpen(true);
	};

	if (isLoading) {
		return (
			<div className="p-4 sm:p-6 lg:p-8">
				<div className="h-8 bg-muted rounded w-64 mb-8 animate-pulse"></div>
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
					{[...Array(6)].map((_, i) => (
						<div key={i} className="h-48 bg-muted rounded animate-pulse"></div>
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<p className="text-destructive p-8">
				Error loading actors: {error.message}
			</p>
		);
	}

	return (
		<div className="p-4 sm:p-6 lg:p-8 space-y-8">
			<div>
				<h1 className="text-3xl font-bold text-slate-50">Actors</h1>
			</div>

			<div className="relative w-full">
				<Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
				<Input
					placeholder="Search actors by name or biography..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-full pl-12 pr-4 py-3 text-base bg-slate-900 border-slate-700"
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
				{filteredActors.map((actor) => (
					// FINAL HOVER EFFECT: This combines the pop-up, shadow, and green border color
					<Card
						key={actor.id}
						className="bg-card border-2 border-slate-800 transition-all duration-300 ease-in-out hover:border-green-500 hover:shadow-xl hover:scale-[1.02]"
					>
						<CardHeader>
							<CardTitle className="text-lg">{actor.name}</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-sm text-muted-foreground line-clamp-4 h-20">
								{actor.bio}
							</p>
							<div className="flex items-center gap-2 pt-2">
								<Button
									variant="outline"
									size="sm"
									className="w-full text-green-400 border-green-500 hover:bg-green-500 hover:text-slate-900 transition-colors"
									onClick={() => handleViewActor(actor)}
								>
									<Eye className="h-4 w-4 mr-2" />
									View Details
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* No Results Card */}
			{filteredActors.length === 0 && !isLoading && (
				<Card className="bg-card col-span-full">
					<CardContent className="flex flex-col items-center justify-center py-16">
						<User className="h-12 w-12 text-muted-foreground mb-4" />
						<h3 className="text-lg font-semibold mb-2">No actors found</h3>
						<p className="text-muted-foreground text-center">
							Try adjusting your search terms.
						</p>
					</CardContent>
				</Card>
			)}

			{/* Actor Detail Dialog */}
			<Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
				<DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
					{selectedActor && (
						<>
							<DialogHeader>
								<DialogTitle className="text-2xl">
									{selectedActor.name}
								</DialogTitle>
							</DialogHeader>
							<div className="py-4">
								<RichTextReader content={selectedActor.description} />
							</div>
						</>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}

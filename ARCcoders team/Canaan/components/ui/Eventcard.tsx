// src/components/ui/EventCard.tsx

import React from "react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { RichTextReader } from "../text-editor/rich-text-reader";
import { EventWLinks } from "@/types/events";
import { format } from "date-fns";
interface EventCardProps {
	event: EventWLinks;
	onSelect: (event: EventWLinks) => void;
	isSelected: boolean;
}

export default function EventCard({
	event,
	onSelect,
	isSelected,
}: EventCardProps) {
	console.log("🚀 ~ EventCard ~ event:", event);

	return (
		<div className="transform transition-transform duration-300 ease-in-out hover:scale-105">
			<Card
				className={`bg-slate-900 border-2 ${
					isSelected ? "border-border" : "border-border/65"
				}`}
			>
				<CardHeader>
					<CardTitle className="text-slate-50">{event.name}</CardTitle>
					<CardDescription className="text-slate-400">
						{format(new Date(event.start_date), "yyyy-MM-dd")}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<RichTextReader content={event.description} />

					<Button
						onClick={() => onSelect(event)}
						variant="outline"
						className="w-full"
					>
						Read more
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}

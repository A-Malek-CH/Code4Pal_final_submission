import React from "react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { RichTextReader } from "../text-editor/rich-text-reader";
import { EventWLinks } from "@/types/events";

interface EventDetailsProps {
	event: EventWLinks | null;
}

export default function EventDetails({ event }: EventDetailsProps) {
	return (
		// 'sticky top-24' ensures it stays in view while scrolling the timeline
		<div className="sticky top-24">
			{/* 
        NEW: We make the card a flex column with a max height.
        This allows the content area to grow and become scrollable.
      */}
			<Card className="bg-card border border-border flex flex-col max-h-[80vh]">
				<CardHeader>
					{event ? (
						<>
							<CardTitle className="text-2xl text-primary">
								{event.name}
							</CardTitle>
							<CardDescription className="text-muted-foreground">
								{new Date(event.start_date).toLocaleDateString()}
							</CardDescription>
						</>
					) : (
						<CardTitle className="text-muted-foreground">Select an Event</CardTitle>
					)}
				</CardHeader>

				{/* 
          NEW: 'overflow-y-auto' adds a vertical scrollbar ONLY if the content is too long.
        */}
				<CardContent className="overflow-y-auto">
					{event ? (
						<RichTextReader content={event.description} />
					) : (
						<p className="text-center text-muted-foreground pt-10">
							Click "Read more" on an event to see its full details here.
						</p>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

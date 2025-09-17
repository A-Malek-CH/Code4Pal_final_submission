import React from "react";
import Link from "next/link";
import type { Event } from "@prisma/client";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { RichTextReader } from "../text-editor/rich-text-reader";
import { format } from "date-fns";

const CalendarIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		{...props}
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		{" "}
		<rect width="18" height="18" x="3" y="4" rx="2" ry="2" />{" "}
		<line x1="16" x2="16" y1="2" y2="6" /> <line x1="8" x2="8" y1="2" y2="6" />{" "}
		<line x1="3" x2="21" y1="10" y2="10" />{" "}
	</svg>
);

const EventCard: React.FC<{ event: Event }> = ({ event }) => {
	return (
		<Card className="hover:shadow-lg hover:-translate-y-1 ">
			<CardHeader>
				<CardTitle>{event.name}</CardTitle>
				<div className="flex items-center text-sm text-muted-foreground pt-2">
					<CalendarIcon className="mr-2 h-4 w-4" />
					{event.start_date && (
						<span>
							{format(new Date(event.start_date as any), "yyyy-mm-dd")}
						</span>
					)}
					{event.end_date && <span className="mx-2">-</span>}
					{event.end_date && (
						<span>{format(new Date(event.end_date as any), "yyyy")}</span>
					)}
				</div>
			</CardHeader>
			<CardContent>
				<RichTextReader content={event.description} />
			</CardContent>
			<CardFooter className="flex flex-col items-start gap-4">
				<div className="flex flex-wrap gap-2">
					{event.tags.map((tag) => (
						<Badge key={tag}>{tag}</Badge>
					))}
				</div>
				{/* UPDATED: Link now points to /library/events */}
				<Link href="/library/events" passHref className="w-full">
					<Button variant="outline" className="w-full mt-2 transition-colors">
						Explore All Events
						<ArrowRight className="h-4 w-4 ml-2" />
					</Button>
				</Link>
			</CardFooter>
		</Card>
	);
};

export default EventCard;

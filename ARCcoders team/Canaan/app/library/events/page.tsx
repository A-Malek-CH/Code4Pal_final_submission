"use client";

import React, { useState, useRef } from "react";
import { useEvents } from "@/hooks/useEvents";
import { Skeleton } from "@/components/ui/skeleton";
import EventCard from "@/components/ui/Eventcard";
import EventDetails from "@/components/ui/EventDetails";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { EventWLinks } from "@/types/events";

export default function EventsPage() {
	const { data: events, isLoading, isError, error } = useEvents();
	const [selectedEvent, setSelectedEvent] = useState<EventWLinks | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const eventRefs = useRef<Record<string, HTMLDivElement | null>>({});

	const handleSearch = () => {
		if (!searchTerm || !events) return;

		const targetEvent = events.find(
			(event) =>
				new Date(event.startDate).getFullYear().toString() === searchTerm
		);

		if (targetEvent) {
			const node = eventRefs.current[targetEvent.id];
			if (node) {
				node.scrollIntoView({
					behavior: "smooth",
					block: "center",
				});
			}
		} else {
			alert(`No events found for the year ${searchTerm}`);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	if (isLoading) {
		return (
			<div className="container mx-auto px-4 pt-16">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div className="md:col-span-2 space-y-8">
						<Skeleton className="h-48 w-full" />
						<Skeleton className="h-48 w-full" />
					</div>
					<div className="md:col-span-1">
						<Skeleton className="h-[50vh] w-full" />
					</div>
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<p className="text-destructive mt-4 dark:text-red-400">
				Failed to load events: {error.message}
			</p>
		);
	}

	return (
		<div className="container mx-auto px-4 pt-16">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
				<div className="lg:col-span-2 space-y-8">
					<div>
						<h1 className="text-3xl font-bold text-slate-50 mb-8">Events</h1>
						<div className="relative w-full">
							<Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
							<Input
								type="text"
								placeholder="Enter a year (e.g., 1948) and press Enter..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								onKeyPress={handleKeyPress}
								className="w-full pl-12 pr-4 py-3 text-base bg-slate-900 border-slate-700"
							/>
						</div>
					</div>

					<div className="relative">
						<div className="absolute left-1/2 top-0 h-full w-0 border-l-2 border-green-500 -translate-x-1/2"></div>

						<div className="space-y-12">
							{!events || events.length === 0 ? (
								<p className="text-muted-foreground mt-4 dark:text-slate-400 text-center">
									No events have been added yet.
								</p>
							) : (
								events.map((event, index) => (
									<div
										key={event.id}
										ref={(el) => {
											eventRefs.current[event.id] = el;
										}}
										className="relative w-full flex items-center group"
									>
										<div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-green-500 rounded-full z-10 border-4 border-slate-950 transition-transform duration-300 ease-in-out group-hover:scale-110"></div>

										<div
											className={`w-[calc(50%-2rem)] z-20 ${
												index % 2 === 0 ? "mr-auto" : "ml-auto"
											}`}
										>
											<EventCard
												event={event}
												onSelect={setSelectedEvent}
												isSelected={selectedEvent?.id === event.id}
											/>
										</div>
									</div>
								))
							)}
						</div>
					</div>
				</div>

				<div className="lg:col-span-1">
					<EventDetails event={selectedEvent} />
				</div>
			</div>
		</div>
	);
}

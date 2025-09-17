"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
	Calendar,
	MapPin,
	Clock,
	Network,
	ImageIcon,
	Plus,
	Search,
	Filter,
	Edit,
	Trash2,
	Eye,
	Loader2,
} from "lucide-react";
import { EventDetail } from "./event-detail";
import { EventForm } from "./event-form";
import { getEvents, deleteEvent } from "@/lib/supabase";
import { toast } from "sonner";
import { EventWLinks } from "@/types/events";

export function EventsManagement() {
	const [searchTerm, setSearchTerm] = useState("");
	const [filterTag, setFilterTag] = useState("all");
	const [sortBy, setSortBy] = useState("name");
	const [selectedEvent, setSelectedEvent] = useState<EventWLinks | null>(null);
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

	const queryClient = useQueryClient();

	const {
		data: events = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ["events"],
		queryFn: getEvents,
	});

	const deleteMutation = useMutation({
		mutationFn: deleteEvent,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["events"] });
			toast.success("Event deleted successfully");
		},
		onError: (error) => {
			toast.error("Failed to delete event");
			console.error("Error deleting event:", error);
		},
	});

	const allTags = Array.from(
		new Set(events.flatMap((event) => event.tags || []))
	);

	// Filter and sort events
	const filteredEvents = events
		.filter((event) => {
			const matchesSearch =
				event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				event.location_name?.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesTag =
				filterTag === "all" || (event.tags || []).includes(filterTag);
			return matchesSearch && matchesTag;
		})
		.sort((a, b) => {
			switch (sortBy) {
				case "name":
					return (a.name || "").localeCompare(b.name || "");
				case "startDate":
					return (
						new Date(a.start_date || 0).getTime() -
						new Date(b.start_date || 0).getTime()
					);
				case "location":
					return (a.location_name || "").localeCompare(b.location_name || "");
				default:
					return 0;
			}
		});

	const handleViewEvent = (event: any) => {
		setSelectedEvent(event);
		setIsDetailDialogOpen(true);
	};

	const handleEditEvent = (event: any) => {
		setSelectedEvent(event);
		setIsCreateDialogOpen(true);
	};

	const handleDeleteEvent = (eventId: string) => {
		if (confirm("Are you sure you want to delete this event?")) {
			deleteMutation.mutate(eventId);
		}
	};

	const handleFormSuccess = () => {
		queryClient.invalidateQueries({ queryKey: ["events"] });
		setIsCreateDialogOpen(false);
		setSelectedEvent(null);
	};

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="animate-pulse">
					<div className="h-8 bg-muted rounded w-64 mb-2"></div>
					<div className="h-4 bg-muted rounded w-96"></div>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
					{[...Array(6)].map((_, i) => (
						<div key={i} className="h-64 bg-muted rounded animate-pulse"></div>
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<Card className="bg-card">
				<CardContent className="flex flex-col items-center justify-center py-12">
					<p className="text-destructive mb-4">
						Error loading events: {error.message}
					</p>
					<Button
						onClick={() =>
							queryClient.invalidateQueries({ queryKey: ["events"] })
						}
					>
						Try Again
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-6">
			<EventForm
				isCreateDialogOpen={isCreateDialogOpen}
				selectedEvent={selectedEvent}
				onOpenChange={(open: boolean) => {
					setIsCreateDialogOpen(open);
					if (!open) {
						setSelectedEvent(null);
					}
				}}
				onSuccess={handleFormSuccess}
			/>

			{/* Filters and Search */}
			<Card className="bg-card">
				<CardHeader>
					<CardTitle className="text-lg">Filters & Search</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col md:flex-row gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search events by name, description, or location..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
						<Select value={filterTag} onValueChange={setFilterTag}>
							<SelectTrigger className="w-full md:w-48">
								<Filter className="h-4 w-4 mr-2" />
								<SelectValue placeholder="Filter by tag" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Tags</SelectItem>
								{allTags.map((tag) => (
									<SelectItem key={tag} value={tag}>
										{tag}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Select value={sortBy} onValueChange={setSortBy}>
							<SelectTrigger className="w-full md:w-48">
								<SelectValue placeholder="Sort by" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="name">Name</SelectItem>
								<SelectItem value="startDate">Start Date</SelectItem>
								<SelectItem value="location">Location</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Events Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
				{filteredEvents.map((event) => (
					<Card
						key={event.id}
						className="bg-card hover:shadow-lg transition-shadow"
					>
						<CardHeader>
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<CardTitle
										className="text-lg mb-2"
										style={{ fontFamily: "var(--font-heading)" }}
									>
										{event.name}
									</CardTitle>
									<CardDescription className="line-clamp-2">
										{event.description}
									</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							{/* Event Details */}
							<div className="space-y-2">
								<div className="flex items-center gap-2 text-sm text-muted-foreground">
									<Clock className="h-3 w-3" />
									{event.start_date
										? new Date(event.start_date).getFullYear()
										: "Unknown"}{" "}
									-
									{event.end_date
										? new Date(event.end_date).getFullYear()
										: "Present"}
								</div>
								<div className="flex items-center gap-2 text-sm text-muted-foreground">
									<MapPin className="h-3 w-3" />
									{event.location_name || "Unknown Location"}
								</div>
							</div>

							{/* Stats */}
							<div className="grid grid-cols-3 gap-2 text-xs">
								<div className="flex items-center gap-1 text-muted-foreground">
									<ImageIcon className="h-3 w-3" />
									{event.media_assets?.length || 0} media
								</div>
								<div className="flex items-center gap-1 text-muted-foreground">
									<Network className="h-3 w-3" />
									{(event.source_relationships?.length || 0) +
										(event.target_relationships?.length || 0)}{" "}
									links
								</div>
								<div className="flex items-center gap-1 text-muted-foreground">
									<Calendar className="h-3 w-3" />
									{event.event_sources?.length || 0} sources
								</div>
							</div>

							{event.actorLinks && event.actorLinks.length > 0 && (
								<div className="space-y-2">
									<h4 className="text-sm font-medium text-foreground">
										Key Actors
									</h4>
									<div className="flex flex-wrap gap-1">
										{event.actorLinks.slice(0, 3).map((link: any) => (
											<Badge
												key={link.actor.id}
												variant="outline"
												className="text-xs"
											>
												{link.actor.name} ({link.role})
											</Badge>
										))}
										{event.actorLinks.length > 3 && (
											<Badge variant="secondary" className="text-xs">
												+{event.actorLinks.length - 3} more
											</Badge>
										)}
									</div>
								</div>
							)}

							{event.sourceLinks && event.sourceLinks.length > 0 && (
								<div className="space-y-2">
									<h4 className="text-sm font-medium text-foreground">
										Sources
									</h4>
									<div className="space-y-1">
										{event.sourceLinks.slice(0, 2).map((link: any) => (
											<div
												key={link.source.id}
												className="text-xs text-muted-foreground truncate"
											>
												{link.source.title} - {link.source.author}
											</div>
										))}
										{event.sourceLinks.length > 2 && (
											<div className="text-xs text-muted-foreground">
												+{event.sourceLinks.length - 2} more sources
											</div>
										)}
									</div>
								</div>
							)}

							{/* Tags */}
							<div className="flex flex-wrap gap-1">
								{(event.tags || []).slice(0, 3).map((tag: string) => (
									<Badge key={tag} variant="secondary" className="text-xs">
										{tag}
									</Badge>
								))}
								{(event.tags || []).length > 3 && (
									<Badge variant="outline" className="text-xs">
										+{(event.tags || []).length - 3} more
									</Badge>
								)}
							</div>

							{/* Actions */}
							<div className="flex items-center gap-2 pt-2">
								<Button
									variant="outline"
									size="sm"
									className="flex-1 bg-transparent"
									onClick={() => handleViewEvent(event)}
								>
									<Eye className="h-3 w-3 mr-1" />
									View
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => handleEditEvent(event)}
								>
									<Edit className="h-3 w-3" />
								</Button>
								<Button
									variant="ghost"
									size="sm"
									className="text-destructive hover:text-destructive"
									onClick={() => handleDeleteEvent(event.id)}
									disabled={deleteMutation.isPending}
								>
									{deleteMutation.isPending ? (
										<Loader2 className="h-3 w-3 animate-spin" />
									) : (
										<Trash2 className="h-3 w-3" />
									)}
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* No Results */}
			{filteredEvents.length === 0 && !isLoading && (
				<Card className="bg-card">
					<CardContent className="flex flex-col items-center justify-center py-12">
						<Calendar className="h-12 w-12 text-muted-foreground mb-4" />
						<h3 className="text-lg font-semibold mb-2">No events found</h3>
						<p className="text-muted-foreground text-center mb-4">
							Try adjusting your search terms or filters, or create a new event.
						</p>
						<Button onClick={() => setIsCreateDialogOpen(true)}>
							<Plus className="h-4 w-4 mr-2" />
							Add New Event
						</Button>
					</CardContent>
				</Card>
			)}

			{/* Event Detail Dialog */}
			<Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
				<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
					{selectedEvent && (
						<EventDetail
							event={selectedEvent}
							onEdit={() => {
								setIsDetailDialogOpen(false);
								setIsCreateDialogOpen(true);
							}}
							onClose={() => {
								setIsDetailDialogOpen(false);
								console.log("🚀 ~ setIsDetailDialogOpen:");
								setSelectedEvent(null);
							}}
						/>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}

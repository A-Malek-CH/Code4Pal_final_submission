"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Tag, X, BookOpen, Users, Plus } from "lucide-react";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	getSources,
	getActors,
	createEvent,
	updateEvent,
	getLocations,
} from "@/lib/supabase";
import { format } from "date-fns"; // Import the format function

import { eventSchema, type EventFormData } from "@/lib/validations/event";
import { toast } from "sonner";
import { Actor, Source, Location } from "@prisma/client";
import { SelectionMultiSelect } from "../ui/multi-select";
import { RichTextEditor } from "../text-editor/rich-text-editor";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { EventWLinks } from "@/types/events";

interface EventFormProps {
	isCreateDialogOpen: boolean;

	selectedEvent: EventWLinks | null;
	onOpenChange: (open: boolean) => void;
	onSuccess?: () => void;
}

export function EventForm({
	selectedEvent,
	onOpenChange,
	onSuccess,
	isCreateDialogOpen,
}: EventFormProps) {
	console.log("🚀 ~ EventForm ~ selectedEvent:", selectedEvent);
	const form = useForm<EventFormData>({
		resolver: zodResolver(eventSchema),
		defaultValues: {
			name: "",
			description: "",
			startDate: "",
			endDate: "",
			tags: [],
		},
	});

	const [newTag, setNewTag] = useState("");
	const [locations, setLocations] = useState<Location[]>([]);
	const [sources, setSources] = useState<Source[]>([]);
	const [actors, setActors] = useState<Actor[]>([]);
	const [selectedLocations, setSelectedLocations] = useState<string[]>(
		selectedEvent?.locationLinks?.map((link: any) => link.location.id) || []
	);
	const [selectedSources, setSelectedSources] = useState<string[]>(
		selectedEvent?.sourceLinks?.map((link: any) => link.source.id) || []
	);
	const [selectedActors, setSelectedActors] = useState<
		{ actorId: string; role: string }[]
	>(
		selectedEvent?.actorLinks?.map((link: any) => ({
			actorId: link.actor.id,
			role: link.role || "participant",
		})) || []
	);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		loadSources();
		loadActors();
		loadLocations();
	}, []);
	// 2. Add the useEffect hook to sync props with state
	useEffect(() => {
		// This code runs whenever `selectedEvent` changes.
		if (selectedEvent) {
			// We are in "Edit" mode. Populate the form and local state.
			form.reset({
				name: selectedEvent.name || "",
				description: selectedEvent.description || "",
				startDate: selectedEvent.start_date
					? format(new Date(selectedEvent.start_date), "yyyy-MM-dd")
					: "",
				endDate: selectedEvent.end_date
					? format(new Date(selectedEvent.end_date), "yyyy-MM-dd")
					: "",
				tags: selectedEvent.tags || [],
			});

			// Also update the local state for your multi-select components
			setSelectedLocations(
				selectedEvent.locationLinks?.map((link: any) => link.location.id) || []
			);
			setSelectedSources(
				selectedEvent.sourceLinks?.map((link: any) => link.source.id) || []
			);
			setSelectedActors(
				selectedEvent.actorLinks?.map((link: any) => ({
					actorId: link.actor.id,
					role: link.role || "participant",
				})) || []
			);
		} else {
			// We are in "Create" mode or the dialog is closing. Reset everything to default.
			form.reset({
				name: "",
				description: "",
				startDate: "",
				endDate: "",
				tags: [],
			});
			setSelectedLocations([]);
			setSelectedSources([]);
			setSelectedActors([]);
		}
	}, [selectedEvent, form.reset]); // The dependency array is crucial!

	const loadSources = async () => {
		try {
			const sourcesData = await getSources();
			setSources(sourcesData);
		} catch (error) {
			console.error("Error loading sources:", error);
		}
	};
	const loadLocations = async () => {
		try {
			const locationsData = await getLocations();
			setLocations(locationsData);
		} catch (error) {
			console.error("Error loading locations:", error);
		}
	};
	const loadActors = async () => {
		try {
			const actorsData = await getActors();
			setActors(actorsData);
		} catch (error) {
			console.error("Error loading actors:", error);
		}
	};

	const onSubmit = async (data: EventFormData) => {
		setLoading(true);

		try {
			const eventData = {
				...data,
				start_date: data.startDate ? new Date(data.startDate) : null,
				end_date: data.endDate ? new Date(data.endDate) : null,
			};

			if (selectedEvent) {
				await updateEvent(
					selectedEvent.id,
					eventData,
					selectedSources,
					selectedActors,
					selectedLocations
				);
				toast.success("selectedEvent updated successfully");
			} else {
				await createEvent(
					eventData,
					selectedSources,
					selectedActors,
					selectedLocations
				);
				toast.success("selectedEvent created successfully");
			}
			onSuccess?.();

			form.reset({});
		} catch (error) {
			console.error("Error saving selectedEvent:", error);
			toast.error("Failed to save selectedEvent. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const addTag = () => {
		if (newTag.trim() && !form.getValues("tags").includes(newTag.trim())) {
			const currentTags = form.getValues("tags");
			form.setValue("tags", [...currentTags, newTag.trim()]);
			setNewTag("");
		}
	};

	const removeTag = (tagToRemove: string) => {
		const currentTags = form.getValues("tags");
		form.setValue(
			"tags",
			currentTags.filter((tag) => tag !== tagToRemove)
		);
	};

	const handleSourceToggle = (sourceId: string) => {
		setSelectedSources((prev) =>
			prev.includes(sourceId)
				? prev.filter((id) => id !== sourceId)
				: [...prev, sourceId]
		);
	};
	useEffect(() => {
		if (isCreateDialogOpen) return;
		console.log("🚀 ~ EventForm ~ isCreateDialogOpen:", isCreateDialogOpen);

		form.reset({});
	}, [isCreateDialogOpen]);
	const handleActorToggle = (actorId: string) => {
		setSelectedActors((prev) => {
			const exists = prev.find((a) => a.actorId === actorId);
			if (exists) {
				return prev.filter((a) => a.actorId !== actorId);
			} else {
				return [...prev, { actorId, role: "participant" }];
			}
		});
	};
	const tags = form.watch("tags");
	const endDate = form.watch("endDate");

	return (
		<div className="flex items-center justify-between">
			<div>
				<h1
					className="text-3xl font-bold text-foreground"
					style={{ fontFamily: "var(--font-heading)" }}
				>
					Events Management
				</h1>
				<p className="text-muted-foreground mt-2">
					Manage and explore historical events with detailed information and
					relationships.
				</p>
			</div>
			<Dialog
				open={isCreateDialogOpen}
				onOpenChange={(open) => {
					console.log("🚀 ~ open:", open);
					if (!open) {
						form.reset({});
					}
					onOpenChange(open);
				}}
			>
				<DialogTrigger asChild>
					<Button className="gap-2">
						<Plus className="h-4 w-4" />
						Add New Event
					</Button>
				</DialogTrigger>
				<DialogContent className="max-w-4xl  ">
					<DialogHeader>
						<DialogTitle>
							{selectedEvent ? "Edit Event" : "Create New Event"}
						</DialogTitle>
						<DialogDescription>
							{selectedEvent
								? "Update the Event information below."
								: "Add a new historical Event to your database."}
						</DialogDescription>
					</DialogHeader>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-6  overflow-y-auto max-h-[80vh] p-4"
						>
							{/* Basic Information */}
							<div className="space-y-4">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Event Name *</FormLabel>
											<FormControl>
												<Input placeholder="Enter Event name" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Description</FormLabel>
											<FormControl>
												<RichTextEditor
													onChange={field.onChange}
													content={field.value || ""}
													placeholder="Describe the historical Event"
												></RichTextEditor>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							{/* Date Range */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="startDate"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="flex items-center gap-2">
												<Calendar className="h-4 w-4" />
												Start Date
											</FormLabel>
											<FormControl>
												<Input type="date" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="endDate"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="flex items-center gap-2">
												<Calendar className="h-4 w-4" />
												End Date
											</FormLabel>
											<FormControl>
												<Input type="date" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							{/* Actors */}
							<div className="space-y-2">
								<Label className="flex items-center gap-2">
									<Users className="h-4 w-4" />
									Actors ({selectedActors.length} selected)
								</Label>

								<SelectionMultiSelect
									options={actors.map((actor) => ({
										id: actor.id,
										label: `${actor.actor_type}: ${actor.name}`,
										role:
											selectedActors.find(
												(innerActor) => actor.id == innerActor.actorId
											)?.role || "participant",
									}))}
									selected={actors
										.filter((actor) =>
											selectedActors
												.map((actor) => actor.actorId)
												.includes(actor.id)
										)
										.map((actor) => ({
											id: actor.id,
											label: `${actor.actor_type}: ${actor.name}`,
											role:
												selectedActors.find(
													(innerActor) => actor.id == innerActor.actorId
												)?.role || "participant",
										}))}
									onChange={(selected) => {
										setSelectedActors(
											actors
												.filter((actor) =>
													selected.some((sel) => sel.id === actor.id)
												)
												.map((actor) => {
													const selectionInfo = selected.find(
														(sel) => sel.id === actor.id
													);
													return {
														actorId: actor.id,
														role: selectionInfo?.role ?? "participant",
													};
												})
										);
									}}
									label="Actors"
								/>
							</div>

							{/* Sources */}
							<div className="space-y-2">
								<Label className="flex items-center gap-2">
									<BookOpen className="h-4 w-4" />
									Sources ({selectedSources.length} selected)
								</Label>

								<SelectionMultiSelect
									options={sources.map((source) => ({
										id: source.id,
										label: source.title + "  By" + source.author,
									}))}
									selected={sources
										.filter((source) => selectedSources.includes(source.id))
										.map((source) => ({
											id: source.id,
											label: source.title + "  By" + source.author,
										}))}
									onChange={(selected) => {
										setSelectedSources(
											sources
												.filter((source) => {
													return selected.some((sel) => sel.id === source.id);
												})
												.map((source) => source.id)
										);
									}}
									label="Sources"
								/>
							</div>

							{/* Locations */}
							<div className="space-y-2">
								<Label className="flex items-center gap-2">
									<MapPin className="h-4 w-4" />
									Locations ({selectedLocations.length} selected)
								</Label>

								<SelectionMultiSelect
									options={locations.map((location) => ({
										id: location.id,
										label: `${location.country}, ${location.region}, ${location.name}`,
									}))}
									selected={locations
										.filter((location) =>
											selectedLocations.includes(location.id)
										)
										.map((location) => ({
											id: location.id,
											label: `${location.country}, ${location.region}, ${location.name}`,
										}))}
									onChange={(selected) => {
										setSelectedLocations(
											locations
												.filter((location) => {
													return selected.some((sel) => sel.id === location.id);
												})
												.map((location) => location.id)
										);
									}}
									label="Locations"
								/>
							</div>

							{/* Tags */}
							<div>
								<Label className="flex items-center gap-2">
									<Tag className="h-4 w-4" />
									Tags
								</Label>
								<div className="flex gap-2 mt-2">
									<Input
										value={newTag}
										onChange={(e) => setNewTag(e.target.value)}
										placeholder="Add a tag"
										onKeyPress={(e) =>
											e.key === "Enter" && (e.preventDefault(), addTag())
										}
									/>
									<Button type="button" onClick={addTag} variant="outline">
										Add
									</Button>
								</div>
								<div className="flex flex-wrap gap-2 mt-3">
									{tags &&
										tags.length > 0 &&
										tags.map((tag) => (
											<Badge key={tag} variant="secondary" className="gap-1">
												{tag}
												<button
													type="button"
													onClick={() => removeTag(tag)}
													className="hover:text-destructive"
												>
													<X className="h-3 w-3" />
												</button>
											</Badge>
										))}
								</div>
							</div>

							{/* Actions */}
							<div className="flex justify-end gap-3 pt-4 border-t">
								<Button
									type="button"
									variant="outline"
									onClick={() => {
										onOpenChange(false);
									}}
								>
									Cancel
								</Button>
								<Button type="submit" disabled={loading}>
									{loading
										? "Saving..."
										: selectedEvent
										? "Update Event"
										: "Create Event"}
								</Button>
							</div>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</div>
	);
}

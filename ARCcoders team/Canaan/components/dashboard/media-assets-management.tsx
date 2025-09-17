"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	ImageIcon,
	Video,
	Music,
	FileText,
	Upload,
	Search,
	Filter,
	Grid3X3,
	List,
	Edit,
	Trash2,
	Eye,
	Download,
	Link,
	Calendar,
	Loader2,
} from "lucide-react";
import { MediaDetail } from "./media-detail";
import {
	getMediaAssets,
	getEvents,
	createMediaAsset,
	updateMediaAsset,
	deleteMediaAsset,
} from "@/lib/supabase";
import {
	mediaAssetSchema,
	type MediaAssetFormData,
} from "@/lib/validations/media";
import { toast } from "sonner";
import { MediaAsset } from "@prisma/client";
import { SelectionSingleSelect } from "../ui/single-select";
import { TSelected } from "@/types/selected";
import { MediaAssetInput } from "@/types/media-asset";
import { RichTextEditor } from "../text-editor/rich-text-editor";
import { format } from "date-fns";

const assetTypeIcons = {
	image: ImageIcon,
	video: Video,
	audio: Music,
	document: FileText,
};

const assetTypeColors = {
	image: "bg-blue-100 text-blue-800",
	video: "bg-purple-100 text-purple-800",
	audio: "bg-green-100 text-green-800",
	document: "bg-orange-100 text-orange-800",
};

export function MediaAssetsManagement() {
	const [searchTerm, setSearchTerm] = useState("");
	const [filterType, setFilterType] = useState("all");
	const [filterEvent, setFilterEvent] = useState("all");
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [selectedMedia, setSelectedMedia] = useState<MediaAsset | null>(null);
	const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
	const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

	const queryClient = useQueryClient();

	const {
		data: mediaAssets = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ["mediaAssets"],
		queryFn: getMediaAssets,
	});

	const { data: events = [] } = useQuery({
		queryKey: ["events"],
		queryFn: getEvents,
	});

	const form = useForm<MediaAssetFormData>({
		resolver: zodResolver(mediaAssetSchema),
		defaultValues: {
			eventId: "",
			assetType: "image",
			storageUrl: "",
			title: "",
			sourceText: "",
		},
	});

	const createMutation = useMutation({
		mutationFn: createMediaAsset,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["mediaAssets"] });
			toast.success("Media asset created successfully");
			setIsUploadDialogOpen(false);
			form.reset();
			setSelectedMedia(null);
		},
		onError: (error) => {
			toast.error("Failed to create media asset");
			console.error("Error creating media asset:", error);
		},
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: MediaAssetInput }) =>
			updateMediaAsset(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["mediaAssets"] });
			toast.success("Media asset updated successfully");
			setIsUploadDialogOpen(false);
			form.reset();
			setSelectedMedia(null);
		},
		onError: (error) => {
			toast.error("Failed to update media asset");
			console.error("Error updating media asset:", error);
		},
	});

	const deleteMutation = useMutation({
		mutationFn: deleteMediaAsset,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["mediaAssets"] });
			toast.success("Media asset deleted successfully");
		},
		onError: (error) => {
			toast.error("Failed to delete media asset");
			console.error("Error deleting media asset:", error);
		},
	});

	const onSubmit = (data: MediaAssetFormData) => {
		if (selectedMedia) {
			updateMutation.mutate({
				id: selectedMedia.id,
				data: {
					event_id: data.eventId,
					asset_type: data.assetType,
					storage_url: data.storageUrl,
					title: data.title || "",
					source_text: null,
					embedding: null,
				},
			});
		} else {
			createMutation.mutate({
				event_id: data.eventId,
				asset_type: data.assetType,
				storage_url: data.storageUrl,
				title: data.title || "",
				source_text: null,
				embedding: null,
			});
		}
	};

	const handleEditMedia = (asset: MediaAsset) => {
		setSelectedMedia(asset);
		form.reset({
			eventId: asset.event_id || "",
			assetType: asset.asset_type as any,
			storageUrl: asset.storage_url || "",
			title: asset.title || "",
			sourceText: asset.source_text || "",
		});
		setIsUploadDialogOpen(true);
	};

	const handleDeleteMedia = (assetId: string) => {
		if (confirm("Are you sure you want to delete this media asset?")) {
			deleteMutation.mutate(assetId);
		}
	};

	// Filter media assets
	const filteredAssets = mediaAssets.filter((asset) => {
		const matchesSearch =
			asset.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			asset.source_text?.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesType = filterType === "all" || asset.asset_type === filterType;

		return matchesSearch && matchesType;
	});

	const handleViewMedia = (asset: MediaAsset) => {
		setSelectedMedia(asset);
		setIsDetailDialogOpen(true);
	};

	const getAssetTypeStats = () => {
		const stats = {
			image: mediaAssets.filter((a) => a.asset_type === "image").length,
			video: mediaAssets.filter((a) => a.asset_type === "video").length,
			audio: mediaAssets.filter((a) => a.asset_type === "audio").length,
			document: mediaAssets.filter((a) => a.asset_type === "document").length,
		};
		return stats;
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	if (error) {
		return (
			<Card className="bg-card">
				<CardContent className="flex flex-col items-center justify-center py-12">
					<p className="text-destructive mb-4">
						Error loading media assets: {error.message}
					</p>
					<Button
						onClick={() =>
							queryClient.invalidateQueries({ queryKey: ["mediaAssets"] })
						}
					>
						Try Again
					</Button>
				</CardContent>
			</Card>
		);
	}

	const stats = getAssetTypeStats();

	return (
		<div className="space-y-6">
			{/* Stats Overview */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				{Object.entries(stats).map(([type, count]) => {
					const Icon = assetTypeIcons[type as keyof typeof assetTypeIcons];
					return (
						<Card key={type} className="bg-card">
							<CardContent className="flex items-center justify-between p-4">
								<div>
									<p className="text-2xl font-bold">{count}</p>
									<p className="text-sm text-muted-foreground capitalize">
										{type}s
									</p>
								</div>
								<Icon className="h-8 w-8 text-muted-foreground" />
							</CardContent>
						</Card>
					);
				})}
			</div>

			{/* Filters and Controls */}
			<Card className="bg-card">
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="text-lg">Filters & Search</CardTitle>
						<div className="flex items-center gap-2">
							<Dialog
								open={isUploadDialogOpen}
								onOpenChange={setIsUploadDialogOpen}
							>
								<DialogTrigger asChild>
									<Button className="gap-2">
										<Upload className="h-4 w-4" />
										Upload Media
									</Button>
								</DialogTrigger>
								<DialogContent className="max-w-2xl ">
									<DialogHeader>
										<DialogTitle>
											{selectedMedia
												? "Edit Media Asset"
												: "Upload Media Assets"}
										</DialogTitle>
										<DialogDescription>
											{selectedMedia
												? "Update the media asset information."
												: "Add new images, videos, audio files, or documents to your collection."}
										</DialogDescription>
									</DialogHeader>
									<Form {...form}>
										<form
											onSubmit={form.handleSubmit(onSubmit)}
											className="space-y-4 max-h-[80vh] overflow-y-auto p-4"
										>
											<FormField
												control={form.control}
												name="eventId"
												render={({ field }) => {
													// 1. Transform your `Event[]` data into the `TSelected[]` shape the component needs.
													const eventOptions: TSelected[] = events.map(
														(event) => ({
															id: event.id,
															label: event.name,
															// You can add a photoURL if you have one, otherwise it's fine to omit
															// photoURL: event.imageUrl || undefined,
														})
													);

													// 2. Find the full event object that corresponds to the form's current value (the ID).
													const selectedEventObject = eventOptions.find(
														(option) => option.id === field.value
													);

													return (
														<FormItem>
															<FormLabel>Event</FormLabel>
															<FormControl>
																{/* 3. Pass the correct props and implement the onChange handler. */}
																<SelectionSingleSelect
																	label="Event"
																	placeholder="Select an event..."
																	options={eventOptions}
																	// Pass the found object, or null if nothing is selected.
																	selected={selectedEventObject || null}
																	onChange={(selection: TSelected | null) => {
																		// When the selection changes, update the form with JUST the ID.
																		// If deselected, the value becomes null.
																		field.onChange(
																			selection ? selection.id : null
																		);
																	}}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													);
												}}
											/>

											<FormField
												control={form.control}
												name="assetType"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Asset Type</FormLabel>
														<Select
															onValueChange={field.onChange}
															defaultValue={field.value}
														>
															<FormControl>
																<SelectTrigger>
																	<SelectValue placeholder="Select asset type" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																<SelectItem value="image">Image</SelectItem>
																<SelectItem value="video">Video</SelectItem>
																<SelectItem value="audio">Audio</SelectItem>
																<SelectItem value="document">
																	Document
																</SelectItem>
															</SelectContent>
														</Select>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="storageUrl"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Storage URL</FormLabel>
														<FormControl>
															<Input
																placeholder="Enter storage URL"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="title"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Title</FormLabel>
														<FormControl>
															<Input
																placeholder="Enter media title"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="sourceText"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Description</FormLabel>
														<FormControl>
															<RichTextEditor
																onChange={field.onChange}
																content={field.value || ""}
																placeholder="Describe the Media "
															></RichTextEditor>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<div className="flex justify-end gap-2">
												<Button
													type="button"
													variant="outline"
													onClick={() => {
														setIsUploadDialogOpen(false);
														form.reset();
														setSelectedMedia(null);
													}}
												>
													Cancel
												</Button>
												<Button
													type="submit"
													disabled={
														createMutation.isPending || updateMutation.isPending
													}
												>
													{(createMutation.isPending ||
														updateMutation.isPending) && (
														<Loader2 className="mr-2 h-4 w-4 animate-spin" />
													)}
													{selectedMedia ? "Update Media" : "Create Media"}
												</Button>
											</div>
										</form>
									</Form>
								</DialogContent>
							</Dialog>
							<Button
								variant={viewMode === "grid" ? "default" : "outline"}
								size="sm"
								onClick={() => setViewMode("grid")}
							>
								<Grid3X3 className="h-4 w-4" />
							</Button>
							<Button
								variant={viewMode === "list" ? "default" : "outline"}
								size="sm"
								onClick={() => setViewMode("list")}
							>
								<List className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col md:flex-row gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search media by title, description, or event..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
						<Select value={filterType} onValueChange={setFilterType}>
							<SelectTrigger className="w-full md:w-48">
								<Filter className="h-4 w-4 mr-2" />
								<SelectValue placeholder="Filter by type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Types</SelectItem>
								<SelectItem value="image">Images</SelectItem>
								<SelectItem value="video">Videos</SelectItem>
								<SelectItem value="audio">Audio</SelectItem>
								<SelectItem value="document">Documents</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Media Grid/List */}
			{viewMode === "grid" ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{filteredAssets.map((asset) => {
						const Icon =
							assetTypeIcons[asset.asset_type as keyof typeof assetTypeIcons];
						return (
							<Card
								key={asset.id}
								className="bg-card hover:shadow-lg transition-shadow group"
							>
								<div className="relative">
									<div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
										{asset.asset_type === "image" ? (
											<img
												src={asset.storage_url || "/placeholder.svg"}
												alt={asset.title || "Media asset"}
												className="w-full h-full object-cover group-hover:scale-105 transition-transform"
											/>
										) : (
											<div className="w-full h-full flex items-center justify-center">
												<Icon className="h-12 w-12 text-muted-foreground" />
											</div>
										)}
									</div>
									<Badge
										className={`absolute top-2 right-2 ${
											assetTypeColors[
												asset.asset_type as keyof typeof assetTypeColors
											]
										}`}
									>
										{asset.asset_type}
									</Badge>
								</div>
								<CardContent className="p-4">
									<h3 className="font-semibold mb-2 line-clamp-1">
										{asset.title}
									</h3>
									<p className="text-sm text-muted-foreground mb-3 line-clamp-2">
										{asset.source_text}
									</p>

									<div className="flex items-center gap-2">
										<Button
											variant="outline"
											size="sm"
											className="flex-1 bg-transparent"
											onClick={() => handleViewMedia(asset)}
										>
											<Eye className="h-3 w-3 mr-1" />
											View
										</Button>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleEditMedia(asset)}
										>
											<Edit className="h-3 w-3" />
										</Button>
										<Button
											variant="ghost"
											size="sm"
											className="text-destructive hover:text-destructive"
											onClick={() => handleDeleteMedia(asset.id)}
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
						);
					})}
				</div>
			) : (
				<Card className="bg-card">
					<CardContent className="p-0">
						<div className="divide-y">
							{filteredAssets.map((asset) => {
								const Icon =
									assetTypeIcons[
										asset.asset_type as keyof typeof assetTypeIcons
									];
								return (
									<div
										key={asset.id}
										className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
									>
										<div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
											{asset.asset_type === "image" ? (
												<img
													src={asset.storage_url || "/placeholder.svg"}
													alt={asset.title || "Media asset"}
													className="w-full h-full object-cover rounded-lg"
												/>
											) : (
												<Icon className="h-6 w-6 text-muted-foreground" />
											)}
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 mb-1">
												<h3 className="font-semibold truncate">
													{asset.title}
												</h3>
												<Badge
													className={`${
														assetTypeColors[
															asset.asset_type as keyof typeof assetTypeColors
														]
													} text-xs`}
												>
													{asset.asset_type}
												</Badge>
											</div>
											<p className="text-sm text-muted-foreground line-clamp-1 mb-2">
												{asset.source_text}
											</p>
											<div className="flex items-center gap-4 text-xs text-muted-foreground">
												<span className="flex items-center gap-1">
													<Calendar className="h-3 w-3" />
													{format(new Date(asset.created_at), "yyyy-MM-dd")}
												</span>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleViewMedia(asset)}
											>
												<Eye className="h-3 w-3 mr-1" />
												View
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => handleEditMedia(asset)}
											>
												<Edit className="h-3 w-3" />
											</Button>
											<Button variant="ghost" size="sm">
												<Download className="h-3 w-3" />
											</Button>
											<Button
												variant="ghost"
												size="sm"
												className="text-destructive hover:text-destructive"
												onClick={() => handleDeleteMedia(asset.id)}
												disabled={deleteMutation.isPending}
											>
												{deleteMutation.isPending ? (
													<Loader2 className="h-3 w-3 animate-spin" />
												) : (
													<Trash2 className="h-3 w-3" />
												)}
											</Button>
										</div>
									</div>
								);
							})}
						</div>
					</CardContent>
				</Card>
			)}

			{/* No Results */}
			{filteredAssets.length === 0 && !isLoading && (
				<Card className="bg-card">
					<CardContent className="flex flex-col items-center justify-center py-12">
						<ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
						<h3 className="text-lg font-semibold mb-2">
							No media assets found
						</h3>
						<p className="text-muted-foreground text-center mb-4">
							{searchTerm || filterType !== "all" || filterEvent !== "all"
								? "Try adjusting your search terms or filters."
								: "Start by uploading media assets to your database."}
						</p>
						<Button onClick={() => setIsUploadDialogOpen(true)}>
							<Upload className="h-4 w-4 mr-2" />
							Upload Media
						</Button>
					</CardContent>
				</Card>
			)}

			{/* Media Detail Dialog */}
			<Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
				<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
					{selectedMedia && (
						<MediaDetail
							media={selectedMedia}
							onClose={() => {
								setIsDetailDialogOpen(false);
								setSelectedMedia(null);
							}}
						/>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}

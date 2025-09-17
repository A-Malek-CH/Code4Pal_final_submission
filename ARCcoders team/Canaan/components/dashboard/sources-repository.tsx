"use client";

import { Suspense, useEffect, useState } from "react";
import {
	useQuery,
	useMutation,
	useQueryClient,
	UseMutationResult,
} from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/components/ui/textarea";
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
	FileText,
	Upload,
	Search,
	Filter,
	BookOpen,
	Globe,
	FileImage,
	Calendar,
	User,
	Link,
	Eye,
	Edit,
	Trash2,
	Download,
	Quote,
	Grid3X3,
	List,
	Loader2,
	Zap,
	CheckCircle,
	XCircle,
} from "lucide-react";
import { SourceDetail } from "./source-detail";
import {
	getSources,
	createSource,
	updateSource,
	deleteSource,
	createDocumentEmbedding,
	EmbedApiResponse,
} from "@/lib/supabase";
import { sourceSchema, type SourceFormData } from "@/lib/validations/source";
import { toast } from "sonner";
import React from "react";
import { format } from "date-fns";
import { MarkdownMessageLazyLoader } from "../ui/react-markdown";
import { formatContent } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import { EmbeddingProgress } from "./embedding-progress";
import { SourceDB } from "@/types/source";

export default function SourceEmbedding({
	activeSource,
	onClose,
}: {
	activeSource: SourceDB | null;

	onClose: () => void;
}) {
	if (!activeSource) return null;

	return (
		<section className="flex justify-center  flex-col p-8">
			{/* <div className="overflow-auto max-h-[70dvh] max-w-[50rem]"> */}

			<Card className="bg-card ">
				<CardHeader>
					<CardTitle className="text-lg">Text Content</CardTitle>
				</CardHeader>
				<CardContent className="max-w-3xl">
					<div className="w-full h-96 overflow-hidden px-2 ">
						<ScrollArea className="h-full">
							<MarkdownMessageLazyLoader
								content={formatContent(activeSource.content)}
							/>
						</ScrollArea>
					</div>
				</CardContent>
			</Card>
			{/* </div> */}
			<EmbeddingProgress activeSource={activeSource} onClose={onClose} />
		</section>
	);
}

const sourceTypes = [
	{
		value: "book",
		label: "Book",
		icon: BookOpen,
		color: "bg-blue-100 text-blue-800",
	},
	{
		value: "article",
		label: "Article",
		icon: FileText,
		color: "bg-green-100 text-green-800",
	},
	{
		value: "document",
		label: "Document",
		icon: FileImage,
		color: "bg-orange-100 text-orange-800",
	},
	{
		value: "website",
		label: "Website",
		icon: Globe,
		color: "bg-purple-100 text-purple-800",
	},
	{
		value: "manuscript",
		label: "Manuscript",
		icon: FileText,
		color: "bg-yellow-100 text-yellow-800",
	},
	{
		value: "newspaper",
		label: "Newspaper",
		icon: FileText,
		color: "bg-red-100 text-red-800",
	},
	{
		value: "journal",
		label: "Journal",
		icon: BookOpen,
		color: "bg-indigo-100 text-indigo-800",
	},
	{
		value: "archive",
		label: "Archive",
		icon: FileImage,
		color: "bg-gray-100 text-gray-800",
	},
];

export function SourcesRepository() {
	const [searchTerm, setSearchTerm] = useState("");
	const [filterType, setFilterType] = useState("all");
	const [sortBy, setSortBy] = useState("title");
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [selectedSource, setSelectedSource] = useState<SourceDB | null>(null);
	const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
	const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
	const [embeddingMutation, setEmbeddingMutation] = useState<
		UseMutationResult<
			EmbedApiResponse,
			Error,
			{
				sourceId: string;
				content: string;
				metadata: any;
			},
			unknown
		>
	>();
	const [activeSource, setActiveSource] = useState<SourceDB | null>(null);
	const queryClient = useQueryClient();

	const {
		data: sources = [],
		isLoading,
		error,
	} = useQuery<SourceDB[]>({
		queryKey: ["sources"],
		queryFn: getSources,
	});
	console.log("🚀 ~ SourcesRepository ~ sources:", sources);
	const form = useForm<SourceFormData>({
		resolver: zodResolver(sourceSchema),
		defaultValues: {
			title: "",
			author: "",
			type: "book",
			url: "",
			content: "",
		},
	});

	const createMutation = useMutation({
		mutationFn: createSource,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["sources"] });
			toast.success("Source created successfully");
			setIsUploadDialogOpen(false);
			form.reset({});
			setSelectedSource(null);
		},
		onError: (error) => {
			toast.error("Failed to create source");
			console.error("Error creating source:", error);
		},
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: SourceFormData }) =>
			updateSource(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["sources"] });
			toast.success("Source updated successfully");
			setIsUploadDialogOpen(false);
			form.reset({});
			setSelectedSource(null);
		},
		onError: (error) => {
			toast.error("Failed to update source");
			console.error("Error updating source:", error);
		},
	});

	const deleteMutation = useMutation({
		mutationFn: deleteSource,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["sources"] });
			toast.success("Source deleted successfully");
		},
		onError: (error) => {
			toast.error("Failed to delete source");
			console.error("Error deleting source:", error);
		},
	});

	const onSubmit = (data: SourceFormData) => {
		if (selectedSource) {
			updateMutation.mutate({ id: selectedSource.id, data });
		} else {
			createMutation.mutate(data);
		}
	};

	const handleEditSource = (source: SourceDB) => {
		setSelectedSource(source);
		form.reset({
			title: source.title || "",
			author: source.author || "",
			type: source.type as any,
			url: source.url || "",
			publish_date: source.publish_date
				? format(new Date(source.publish_date), "yyyy-MM-dd")
				: "",

			content: source.content || "",
		});
		setIsUploadDialogOpen(true);
	};

	const handleDeleteSource = (sourceId: string) => {
		if (confirm("Are you sure you want to delete this source?")) {
			deleteMutation.mutate(sourceId);
		}
	};

	const handleViewSource = (source: SourceDB) => {
		setSelectedSource(source);
		setIsDetailDialogOpen(true);
	};

	const getEmbeddingStatusBadge = (is_embedded: boolean) => {
		const status = is_embedded ? "completed" : "not_started";

		switch (status) {
			case "completed":
				return (
					<Badge variant="secondary" className=" text-xs">
						<CheckCircle className="h-3 w-3 mr-1" />
						Embedded
					</Badge>
				);
			case "not_started":
				return (
					<Badge variant="outline" className="text-xs">
						Not Embedded
					</Badge>
				);
		}
	};

	const getSourceTypeInfo = (type: string) => {
		return sourceTypes.find((st) => st.value === type) || sourceTypes[0];
	};

	const getSourceStats = () => {
		const stats = {
			total: sources.length,
			book: sources.filter((s) => s.type === "book").length,
			article: sources.filter((s) => s.type === "article").length,
			document: sources.filter((s) => s.type === "document").length,
			website: sources.filter((s) => s.type === "website").length,
			withEmbeddings: sources.filter((s) => s.is_embedded).length,
		};
		return stats;
	};

	const filteredSources = sources
		.filter((source) => {
			const matchesSearch =
				source.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				source.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				source.content?.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesFilter = filterType === "all" || source.type === filterType;
			return matchesSearch && matchesFilter;
		})
		.sort((a, b) => {
			if (sortBy === "title") {
				return a.title.localeCompare(b.title);
			} else if (sortBy === "author") {
				return (a.author || "").localeCompare(b.author || "");
			} else if (sortBy === "publish_date") {
				return (
					new Date(a.publish_date || "").getTime() -
					new Date(b.publish_date || "").getTime()
				);
			} else if (sortBy === "created_at") {
				return (
					new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
				);
			}
			return 0;
		});

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
						Error loading sources: {error.message}
					</p>
					<Button
						onClick={() =>
							queryClient.invalidateQueries({ queryKey: ["sources"] })
						}
					>
						Try Again
					</Button>
				</CardContent>
			</Card>
		);
	}

	const stats = getSourceStats();

	return (
		<div className="space-y-6">
			{/* Stats Overview */}
			<div className="grid grid-cols-2 md:grid-cols-6 gap-4">
				<Card className="bg-card">
					<CardContent className="flex items-center justify-between p-4">
						<div>
							<p className="text-2xl font-bold">{stats.total}</p>
							<p className="text-sm text-muted-foreground">Total Sources</p>
						</div>
						<FileText className="h-8 w-8 text-muted-foreground" />
					</CardContent>
				</Card>
				{sourceTypes.slice(0, 4).map((type) => {
					const count = stats[type.value as keyof typeof stats] as number;
					const Icon = type.icon;
					return (
						<Card key={type.value} className="bg-card">
							<CardContent className="flex items-center justify-between p-4">
								<div>
									<p className="text-2xl font-bold">{count}</p>
									<p className="text-sm text-muted-foreground">{type.label}s</p>
								</div>
								<Icon className="h-8 w-8 text-muted-foreground" />
							</CardContent>
						</Card>
					);
				})}
				<Card className="bg-card">
					<CardContent className="flex items-center justify-between p-4">
						<div>
							<p className="text-2xl font-bold">{stats.withEmbeddings}</p>
							<p className="text-sm text-muted-foreground">AI Ready</p>
						</div>
						<Search className="h-8 w-8 text-muted-foreground" />
					</CardContent>
				</Card>
			</div>

			{/* Filters and Controls */}
			<Card className="bg-card">
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="text-lg">Filters & Search</CardTitle>
						<div className="flex items-center gap-2">
							<Dialog
								open={isUploadDialogOpen}
								onOpenChange={(open) => {
									form.reset({});
									setSelectedSource(null);
									setIsUploadDialogOpen(open);
								}}
							>
								<DialogTrigger asChild>
									<Button className="gap-2">
										<Upload className="h-4 w-4" />
										Add Source
									</Button>
								</DialogTrigger>
								<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
									<DialogHeader>
										<DialogTitle>
											{selectedSource ? "Edit Source" : "Add New Source"}
										</DialogTitle>
										<DialogDescription>
											{selectedSource
												? "Update the source information and content."
												: "Upload documents, add citations, or reference external sources."}
										</DialogDescription>
									</DialogHeader>
									<Form {...form}>
										<form
											onSubmit={form.handleSubmit(onSubmit)}
											className="space-y-4"
										>
											<FormField
												control={form.control}
												name="title"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Title</FormLabel>
														<FormControl>
															<Input
																placeholder="Enter source title"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="content"
												render={({ field }) => {
													const [fileName, setFileName] = useState<
														string | null
													>(null);

													// We need to sync the file name state when the form is reset
													if (field.value === "") {
														if (fileName !== null) setFileName(null);
													}

													const handleFileChange = (
														event: React.ChangeEvent<HTMLInputElement>
													) => {
														const file = event.target.files?.[0];
														if (!file) {
															setFileName(null);
															field.onChange("");
															return;
														}
														if (
															file.type !== "text/markdown" &&
															!file.name.endsWith(".md")
														) {
															form.setError("content", {
																type: "manual",
																message: "Please upload a valid .md file.",
															});
															setFileName(null);
															field.onChange("");
															return;
														}
														setFileName(file.name);
														const reader = new FileReader();
														reader.onload = (e) => {
															const text = e.target?.result as string;
															field.onChange(text); // Set the value for validation and submission
														};
														reader.onerror = () => {
															form.setError("content", {
																type: "manual",
																message: "Failed to read the file.",
															});
															setFileName(null);
															field.onChange("");
														};
														reader.readAsText(file);
													};

													return (
														<FormItem>
															<FormLabel>Content (from .md file)</FormLabel>
															<FormControl>
																<div className="flex flex-col gap-2">
																	<Input
																		id="content-file-upload"
																		type="file"
																		accept=".md,text/markdown"
																		onChange={handleFileChange}
																		className="sr-only"
																		ref={field.ref}
																	/>
																	<label
																		htmlFor="content-file-upload"
																		className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent h-10 px-4 py-2 cursor-pointer"
																	>
																		{fileName
																			? "Change File"
																			: "Upload .md File"}
																	</label>
																	{fileName && (
																		<p className="text-sm text-muted-foreground">
																			Selected file: {fileName}
																		</p>
																	)}
																</div>
															</FormControl>
															<FormMessage />

															{field.value &&
																typeof field.value === "string" &&
																field.value.length > 0 && (
																	<Textarea
																		readOnly
																		value={field.value}
																		placeholder="Content from uploaded file..."
																		rows={10}
																		className="mt-2 font-mono text-sm"
																	/>
																)}
														</FormItem>
													);
												}}
											/>

											<div className="grid grid-cols-2 gap-4">
												<FormField
													control={form.control}
													name="author"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Author</FormLabel>
															<FormControl>
																<Input
																	placeholder="Enter author name"
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>

												<FormField
													control={form.control}
													name="type"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Type</FormLabel>
															<Select
																onValueChange={field.onChange}
																defaultValue={field.value}
															>
																<FormControl>
																	<SelectTrigger>
																		<SelectValue placeholder="Select source type" />
																	</SelectTrigger>
																</FormControl>
																<SelectContent>
																	{sourceTypes.map((type) => (
																		<SelectItem
																			key={type.value}
																			value={type.value}
																		>
																			{type.label}
																		</SelectItem>
																	))}
																</SelectContent>
															</Select>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>

											<div className="grid grid-cols-2 gap-4">
												<FormField
													control={form.control}
													name="url"
													render={({ field }) => (
														<FormItem>
															<FormLabel>URL </FormLabel>
															<FormControl>
																<Input placeholder="Enter URL" {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>

												<FormField
													control={form.control}
													name="publish_date"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Publish Date (Optional)</FormLabel>
															<FormControl>
																<Input type="date" {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>

											<div className="flex justify-end gap-2">
												<Button
													type="button"
													variant="outline"
													onClick={() => {
														setIsUploadDialogOpen(false);
														form.reset({});
														setSelectedSource(null);
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
													{selectedSource ? "Update Source" : "Create Source"}
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
								placeholder="Search by title, author..."
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
								{sourceTypes.map((type) => (
									<SelectItem key={type.value} value={type.value}>
										{type.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Select value={sortBy} onValueChange={setSortBy}>
							<SelectTrigger className="w-full md:w-48">
								<SelectValue placeholder="Sort by" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="title">Title</SelectItem>
								<SelectItem value="author">Author</SelectItem>
								<SelectItem value="publish_date">Publish Date</SelectItem>
								<SelectItem value="created_at">Date Added</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Sources Grid/List */}
			{viewMode === "grid" ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredSources.map((source: SourceDB) => {
						const typeInfo = getSourceTypeInfo(source.type);
						const Icon = typeInfo.icon;
						return (
							<Card
								key={source.id}
								className="bg-card hover:shadow-lg transition-shadow"
							>
								<CardHeader>
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-2">
												<Icon className="h-5 w-5 text-muted-foreground" />
												<Badge className={`${typeInfo.color} text-xs`}>
													{typeInfo.label}
												</Badge>
												{getEmbeddingStatusBadge(source.is_embedded)}
											</div>
											<CardTitle className="text-lg mb-2 line-clamp-2">
												{source.title.length > 60
													? source.title.slice(0, 60) + "..."
													: source.title}
											</CardTitle>
											<CardDescription className="line-clamp-2  truncate text-wrap">
												{source.content.length > 100
													? source.content.slice(0, 100) + "..."
													: source.content}
											</CardDescription>
										</div>
									</div>
								</CardHeader>
								<CardContent className="space-y-4">
									{/* Metadata */}
									<div className="space-y-2">
										<div className="flex items-center gap-2 text-sm text-muted-foreground">
											<User className="h-3 w-3" />
											<span className="truncate">{source.author}</span>
										</div>
										{source.publish_date && (
											<div className="flex items-center gap-2 text-sm text-muted-foreground">
												<Calendar className="h-3 w-3" />
												<span>
													{new Date(source.publish_date).getFullYear()}
												</span>
											</div>
										)}
										{/* <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Link className="h-3 w-3" />
                      <span>{source._count.sourceLinks} event links</span>
                    </div> */}
									</div>

									{/* Features */}
									<div className="flex flex-wrap gap-2">
										{source.is_embedded && (
											<Badge variant="secondary" className="text-xs">
												AI Searchable
											</Badge>
										)}
										{source.url && (
											<Badge variant="secondary" className="text-xs">
												External Link
											</Badge>
										)}
									</div>

									{/* Actions */}
									<div className="flex items-center gap-2 pt-2">
										<Button
											variant="outline"
											size="sm"
											className="flex-1 bg-transparent"
											onClick={() => handleViewSource(source)}
										>
											<Eye className="h-3 w-3 mr-1" />
											View
										</Button>
										{!source.is_embedded && (
											<Button
												variant="outline"
												size="sm"
												className="bg-primary/10 hover:bg-primary/20"
												onClick={() => setActiveSource(source)}
												disabled={embeddingMutation?.isPending}
											>
												{embeddingMutation?.isPending ? (
													<Loader2 className="h-3 w-3 animate-spin" />
												) : (
													<Zap className="h-3 w-3" />
												)}
											</Button>
										)}
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleEditSource(source)}
										>
											<Edit className="h-3 w-3" />
										</Button>
										<Button
											variant="ghost"
											size="sm"
											className="text-destructive hover:text-destructive"
											onClick={() => handleDeleteSource(source.id)}
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
							{filteredSources.map((source) => {
								const typeInfo = getSourceTypeInfo(source.type);
								const Icon = typeInfo.icon;
								return (
									<div
										key={source.id}
										className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
									>
										<div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
											<Icon className="h-6 w-6 text-muted-foreground" />
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 mb-1">
												<h3 className="font-semibold truncate">
													{source.title}
												</h3>
												<Badge className={`${typeInfo.color} text-xs`}>
													{typeInfo.label}
												</Badge>
												{getEmbeddingStatusBadge(source.is_embedded)}
											</div>
											<div className="overflow-auto max-h-[70dvh] h-[70dvh]">
												<MarkdownMessageLazyLoader content={source.content} />
											</div>
											<div className="flex items-center gap-4 text-xs text-muted-foreground">
												<span className="flex items-center gap-1">
													<User className="h-3 w-3" />
													{source.author}
												</span>
												{source.publish_date && (
													<span className="flex items-center gap-1">
														<Calendar className="h-3 w-3" />
														{new Date(source.publish_date).getFullYear()}
													</span>
												)}
											</div>
										</div>
										<div className="flex items-center gap-2">
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleViewSource(source)}
											>
												<Eye className="h-3 w-3 mr-1" />
												View
											</Button>
											{!source.is_embedded && (
												<Button
													variant="outline"
													size="sm"
													className="bg-primary/10 hover:bg-primary/20"
													onClick={() => setActiveSource(source)}
													disabled={embeddingMutation?.isPending}
												>
													{embeddingMutation?.isPending ? (
														<Loader2 className="h-3 w-3 animate-spin" />
													) : (
														<Zap className="h-3 w-3" />
													)}
												</Button>
											)}
											<Button
												variant="ghost"
												size="sm"
												onClick={() => handleEditSource(source)}
											>
												<Edit className="h-3 w-3" />
											</Button>
											<Button variant="ghost" size="sm">
												<Quote className="h-3 w-3" />
											</Button>
											<Button variant="ghost" size="sm">
												<Download className="h-3 w-3" />
											</Button>
											<Button
												variant="ghost"
												size="sm"
												className="text-destructive hover:text-destructive"
												onClick={() => handleDeleteSource(source.id)}
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
			{filteredSources.length === 0 && !isLoading && (
				<Card className="bg-card">
					<CardContent className="flex flex-col items-center justify-center py-12">
						<FileText className="h-12 w-12 text-muted-foreground mb-4" />
						<h3 className="text-lg font-semibold mb-2">No sources found</h3>
						<p className="text-muted-foreground text-center mb-4">
							{searchTerm || filterType !== "all"
								? "Try adjusting your search terms or filters."
								: "Start by adding sources to your database."}
						</p>
						<Button onClick={() => setIsUploadDialogOpen(true)}>
							<Upload className="h-4 w-4 mr-2" />
							Add Source
						</Button>
					</CardContent>
				</Card>
			)}

			{/* Source Detail Dialog */}
			<Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
				<DialogContent className="max-w-4xl ">
					{selectedSource && (
						<SourceDetail
							source={selectedSource}
							onEdit={() => {
								setIsDetailDialogOpen(false);
								setIsUploadDialogOpen(true);
							}}
							onClose={() => {
								setIsDetailDialogOpen(false);
								setSelectedSource(null);
							}}
						/>
					)}
				</DialogContent>
			</Dialog>
			<Dialog
				open={!!activeSource}
				onOpenChange={(open) => !open && setActiveSource(null)}
			>
				<DialogContent className="max-w-4xl   p-4 ">
					<SourceEmbedding
						activeSource={activeSource}
						onClose={() => setActiveSource(null)}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}

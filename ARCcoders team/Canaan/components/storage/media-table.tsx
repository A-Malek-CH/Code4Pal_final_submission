"use client";

import { type FC, useState } from "react";
import JSZip from "jszip";
import { cn, formatSize } from "@/lib/utils";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import Pagination from "@/components/pagination";
import { SearchResultModal } from "./search-result-modal";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Copy,
	Download,
	MoreHorizontal,
	RefreshCcw,
	Search,
	Trash,
	Filter,
	Folder,
	File,
	FolderOpen,
	ArrowLeft,
	Plus,
} from "lucide-react";
import Link from "next/link";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { supabase } from "@/lib/supabase/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Badge } from "@/components/ui/badge";
import { countStorageItems } from "@/lib/supabase";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { NotFound, Error as LocalErrorBoundry } from "../error-handlers";

const searchSchema = z.object({
	searchQuery: z.string().optional(),
	folder: z.string().min(1, "Folder is required"),
});

type SearchSchema = z.infer<typeof searchSchema>;

interface StorageItem {
	name: string;
	id: string | null;
	updated_at: string | null;
	created_at: string | null;
	last_accessed_at: string | null;
	metadata: {
		eTag?: string;
		size?: number;
		mimetype?: string;
		cacheControl?: string;
		lastModified?: string;
		contentLength?: number;
		httpStatusCode?: number;
	} | null;
}

interface ISearchTableProps {
	page: number;
	folder: string;
	searchQuery: string;
}

// Safe ID formatter that handles null/undefined IDs
const formatId = (id: string | null): string => {
	if (!id || id.length < 6) {
		return "FOLDER";
	}
	return `..${id.substring(id.length - 6)}`;
};

// Check if item is a folder (no metadata or null id)
const isFolder = (item: StorageItem): boolean => {
	return !item.metadata || item.id === null;
};

// Get file type from name
const getFileType = (name: string): string => {
	const extension = name.split(".").pop()?.toLowerCase();
	if (!extension) return "folder";

	const imageTypes = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
	const videoTypes = ["mp4", "webm", "ogg", "mov", "avi"];
	const audioTypes = ["mp3", "wav", "ogg", "flac"];
	const docTypes = ["pdf", "doc", "docx", "txt", "md"];

	if (imageTypes.includes(extension)) return "image";
	if (videoTypes.includes(extension)) return "video";
	if (audioTypes.includes(extension)) return "audio";
	if (docTypes.includes(extension)) return "document";

	return "file";
};

export const SearchTable: FC<ISearchTableProps> = ({
	page,
	folder,
	searchQuery,
}) => {
	const router = useRouter();
	const { toast } = useToast();
	const queryClient = useQueryClient();

	const { data, error, isLoading } = useQuery({
		queryKey: ["search", page, folder, searchQuery],
		queryFn: async () => {
			const result = await supabase.storage.from("canaan").list(folder, {
				limit: 20,
				offset: (page - 1) * 20,
				search: searchQuery || undefined,
			});
			return result;
		},
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
	});

	const { data: count } = useQuery({
		queryKey: ["searchCount", folder, searchQuery],
		queryFn: () => countStorageItems("canaan", folder, searchQuery),
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
	});
	console.log("🚀 ~ SearchTable ~ count:", count);

	const [selectedResults, setSelectedResults] = useState<string[]>([]);
	const [selectedResult, setSelectedResult] = useState<string>("");
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const { register, handleSubmit, setValue, watch } = useForm<SearchSchema>({
		resolver: zodResolver(searchSchema),
		defaultValues: {
			searchQuery: searchQuery || "",
			folder: folder || "",
		},
	});

	const currentFolder = watch("folder");

	const onSubmit = handleSubmit((data) => {
		const params = new URLSearchParams();
		params.set("folder", data.folder);
		if (data.searchQuery) {
			params.set("searchQuery", data.searchQuery);
		}
		router.push(`/dashboard/storage?${params.toString()}`);
	});

	const navigateToFolder = (folderName: string) => {
		const newPath = currentFolder
			? `${currentFolder}/${folderName}`
			: folderName;
		setValue("folder", newPath);
		router.push(`/dashboard/storage?folder=${encodeURIComponent(newPath)}`);
	};

	const navigateUp = () => {
		const pathParts = currentFolder.split("/").filter(Boolean);
		pathParts.pop();
		const newPath = pathParts.join("/");
		setValue("folder", newPath);
		router.push(`/dashboard/storage?folder=${encodeURIComponent(newPath)}`);
	};

	const handleItemClick = (item: StorageItem) => {
		if (isFolder(item)) {
			navigateToFolder(item.name);
		} else {
			setSelectedResult(item.id || "");
		}
	};

	const handleDownloadAll = async () => {
		const zip = new JSZip();
		const selectedFiles = items.filter(
			(item) => selectedResults.includes(item.id || "") && !isFolder(item)
		);

		for (const file of selectedFiles) {
			const url = supabase.storage
				.from("canaan")
				.getPublicUrl(`${currentFolder}/${file.name}`).data.publicUrl;
			try {
				const response = await fetch(url);
				const blob = await response.blob();
				zip.file(file.name, blob);
			} catch (error) {
				console.error(`Failed to fetch ${file.name}:`, error);
				toast({
					title: `Error downloading ${file.name}`,
					description: "Could not fetch file.",
					variant: "destructive",
				});
			}
		}

		zip.generateAsync({ type: "blob" }).then((content) => {
			const link = document.createElement("a");
			link.href = URL.createObjectURL(content);
			link.download = "archive.zip";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		});
	};

	const handleDeleteSelected = async () => {
		const selectedFiles = items.filter((item) =>
			selectedResults.includes(item.id || "")
		);
		const paths = selectedFiles.map((file) => `${currentFolder}/${file.name}`);

		if (paths.length === 0) {
			toast({
				title: "No files selected",
				description: "Please select files to delete.",
				variant: "destructive",
			});
			return;
		}

		const { error } = await supabase.storage.from("canaan").remove(paths);

		if (error) {
			toast({
				title: "Error deleting files",
				description: error.message,
				variant: "destructive",
			});
		} else {
			toast({
				title: "Files deleted successfully",
				description: `${paths.length} files have been removed.`,
			});
			setSelectedResults([]);
			queryClient.invalidateQueries({
				queryKey: ["search", page, folder, searchQuery],
			});
			queryClient.invalidateQueries({
				queryKey: ["searchCount", folder, searchQuery],
			});
		}
		setIsDeleteDialogOpen(false);
	};

	if (error) {
		return <LocalErrorBoundry message={error.message} />;
	}

	if (isLoading) {
		return (
			<div className="min-h-screen  flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-primary font-mono">SCANNING_STORAGE_SYSTEM...</p>
				</div>
			</div>
		);
	}

	if (!data) {
		return <NotFound />;
	}

	const items: StorageItem[] = data.data || [];
	const folders = items.filter(isFolder);
	const files = items.filter((item) => !isFolder(item));

	return (
		<div className="min-h-screen py-20 flex flex-col">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-4xl font-bold text-primary mb-8 text-center font-mono">
					Storage Explorer
				</h1>

				{/* Navigation and Search */}
				<div className="flex flex-col lg:flex-row items-center justify-between mb-6 gap-4">
					<div className="flex items-center space-x-2">
						<Button
							onClick={() => {
								queryClient.invalidateQueries({
									queryKey: ["search", folder, page, searchQuery],
								});
								queryClient.invalidateQueries({
									queryKey: ["searchCount", folder, searchQuery],
								});
							}}
						>
							<RefreshCcw className="w-4 h-4 mr-2" />
							Refresh
						</Button>
						<Button asChild>
							<Link href="/dashboard/storage/create">
								<Plus className="w-4 h-4 mr-2" />
								Create New Item
							</Link>
						</Button>

						{currentFolder && (
							<Button onClick={navigateUp} variant="outline">
								<ArrowLeft className="w-4 h-4 mr-2" />
								Back
							</Button>
						)}
					</div>

					{/* Search Form */}
					<form onSubmit={onSubmit} className="flex items-center space-x-4">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
							<Input
								type="text"
								placeholder="Search files..."
								{...register("searchQuery")}
								className="focus:border-primary pl-10 w-64"
							/>
						</div>

						<div className="relative">
							<Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 " />
							<Input
								type="text"
								placeholder="Folder path..."
								{...register("folder")}
								className="focus:border-primary pl-10 w-48"
							/>
						</div>

						<Button
							variant="ghost"
							className="text-primary canaan"
							type="submit"
						>
							<Search className="h-4 w-4 mr-2" />
							Search
						</Button>
					</form>

					{/* <div className="flex items-center space-x-4">
            <Label className="flex items-center space-x-2">
              <Checkbox
                checked={folder === "user"}
                onCheckedChange={(checked) => {
                  const newFolder = checked ? "user" : "";
                  setValue("folder", newFolder);
                  router.push(`/search?folder=${newFolder}`);
                }}
              />
              <span className="text-primary font-mono">User Folder</span>
            </Label>
          </div> */}
				</div>

				{/* Breadcrumb */}
				{currentFolder && (
					<div className="mb-4 p-3 bg-background/70 rounded-lg border border-border">
						<div className="flex items-center space-x-2 text-sm font-mono">
							<FolderOpen className="h-4 w-4 " />
							<span className="text-gray-400">Current path:</span>
							<span className="text-primary">/{currentFolder}</span>
						</div>
					</div>
				)}

				<div className="bg-background/50 border border-border rounded-lg backdrop-blur-sm flex flex-col flex-grow">
					<Card className="bg-transparent border-none flex flex-col p-4">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
							<div className="flex justify-between w-full items-center">
								<h1 className="text-2xl font-bold text-primary font-mono">
									Storage Contents
								</h1>
								<div className="flex items-center space-x-4">
									<Badge variant="outline">{folders.length} folders</Badge>
									<Badge variant="outline" className="text-primary">
										{files.length} files
									</Badge>
									<span className="text-primary/70 font-mono text-sm">
										Total: {count} items
									</span>
								</div>
							</div>
						</CardHeader>

						<Table className="h-full">
							<TableHeader>
								<TableRow>
									<TableCell className="text-left w-10">
										<Popover>
											<PopoverTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													disabled={selectedResults.length === 0}
												>
													{selectedResults.length > 0 && (
														<span className="absolute top-2 left-2 flex h-5 w-5">
															<span className="relative inline-flex rounded-full h-5 w-5 bg-primary items-center justify-center text-xs text-secondary font-mono font-bold">
																{selectedResults.length}
															</span>
														</span>
													)}
													<MoreHorizontal className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-64 /95 backdrop-blur-sm border-2 border-border/80  p-0 overflow-hidden">
												{/* Bulk Actions Content */}
												<div className="bg-background  px-4 py-3 border-b border-border/70">
													<div className="flex items-center justify-between">
														<span className="text-primary font-mono text-sm font-bold">
															Bulk Actions
														</span>
														<span className="text-primary font-mono text-xs bg-background border border-border px-2 py-1 rounded">
															{selectedResults.length} Selected
														</span>
													</div>
												</div>

												<div className="p-2 space-y-1">
													<Button
														variant="ghost"
														className="w-full justify-start p-3 h-auto border border-transparent  font-mono group transition-all duration-300"
														onClick={handleDownloadAll}
													>
														<div className="flex items-center space-x-3 w-full">
															<Download className="w-5 h-5 group-hover:animate-bounce" />
															<div className="flex flex-col items-start">
																<span className="text-sm font-bold">
																	Download All
																</span>
																<span className="text-xs text-primary/70">
																	Export selected files
																</span>
															</div>
														</div>
													</Button>

													<Button
														variant="ghost"
														disabled={selectedResults.length !== 1}
														className="w-full justify-start p-3 h-auto  border border-transparent font-mono group transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
														onClick={() => {
															if (selectedResults.length === 1) {
																const selectedFile = items.find(
																	(item) => item.id === selectedResults[0]
																);
																if (selectedFile && !isFolder(selectedFile)) {
																	const publicUrl = supabase.storage
																		.from("canaan")
																		.getPublicUrl(
																			`${currentFolder}/${selectedFile.name}`
																		).data.publicUrl;

																	navigator.clipboard.writeText(publicUrl);
																	toast({
																		title: "URL copied to clipboard",
																	});
																}
															}
														}}
													>
														<div className="flex items-center space-x-3 w-full">
															<Copy className="w-5 h-5 group-hover:animate-pulse" />
															<div className="flex flex-col items-start">
																<span className="text-sm font-bold">
																	Copy URL
																</span>
																<span className="text-xs text-primary/70">
																	{selectedResults.length === 1
																		? "Copy public URL"
																		: `Select exactly ${selectedResults.length} file`}
																</span>
															</div>
														</div>
													</Button>

													<Button
														variant="ghost"
														className="w-full justify-start p-3 h-auto text-red-400 hover:bg-red-500/10 hover:text-red-300 border border-transparent hover:border-red-500/30 font-mono group transition-all duration-300"
														onClick={() => setIsDeleteDialogOpen(true)}
													>
														<div className="flex items-center space-x-3 w-full">
															<Trash className="w-5 h-5 group-hover:animate-pulse" />
															<div className="flex flex-col items-start">
																<span className="text-sm font-bold">
																	Delete Selected
																</span>
																<span className="text-xs text-primary/70">
																	Permanent removal ⚠
																</span>
															</div>
														</div>
													</Button>
												</div>
											</PopoverContent>
										</Popover>
									</TableCell>
									<TableHead className="text-left text-primary font-mono">
										Type
									</TableHead>
									<TableHead className="text-left text-primary font-mono">
										Name
									</TableHead>
									<TableHead className="text-left text-primary font-mono">
										Size
									</TableHead>
									<TableHead className="text-left text-primary font-mono">
										Modified
									</TableHead>
									<TableHead className="text-left text-primary font-mono">
										ID
									</TableHead>
									<TableHead className="w-12 p-0 text-center pt-4 pb-2">
										<Checkbox
											disabled={files.length === 0}
											checked={
												selectedResults.length > 0 &&
												selectedResults.length === files.length
											}
											onCheckedChange={(checked) =>
												checked
													? setSelectedResults(
															files.map((item) => item.id || item.name)
													  )
													: setSelectedResults([])
											}
											className="w-4 h-4 border-primary data-[state=checked]:bg-primary "
										/>
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{/* Render folders first */}
								{folders.map((folder) => (
									<TableRow
										key={folder.name}
										className="text-left  cursor-pointer"
										onClick={() => handleItemClick(folder)}
									>
										<TableCell className="text-left w-10"></TableCell>
										<TableCell className="text-left">
											<div className="flex items-center space-x-2">
												<Folder className="h-4 w-4 text-primary" />
												<Badge variant="outline" className=" text-xs">
													FOLDER
												</Badge>
											</div>
										</TableCell>
										<TableCell className="text-left font-mono font-semibold">
											{folder.name}
										</TableCell>
										<TableCell className="text-left  font-mono">—</TableCell>
										<TableCell className="text-left  font-mono">—</TableCell>
										<TableCell className="text-left  font-mono">
											{formatId(folder.id)}
										</TableCell>
										<TableCell className="p-0 w-12 text-center">
											{/* Folders can't be selected for bulk actions */}
											<div className="w-4 h-4"></div>
										</TableCell>
									</TableRow>
								))}

								{/* Render files */}
								{files.map((file) => (
									<TableRow
										key={file.id || file.name}
										className="text-left cursor-pointer"
										onClick={() => handleItemClick(file)}
									>
										<TableCell className="text-left w-10"></TableCell>
										<TableCell className="text-left">
											<div className="flex items-center space-x-2">
												<File className="h-4 w-4 text-primary" />
												<Badge
													variant="outline"
													className="border-primary/50 text-primary text-xs"
												>
													{getFileType(file.name).toUpperCase()}
												</Badge>
											</div>
										</TableCell>
										<TableCell className="text-left  font-mono">
											{file.name}
										</TableCell>
										<TableCell className="text-left  font-mono">
											{file.metadata?.size
												? formatSize(file.metadata.size)
												: "—"}
										</TableCell>
										<TableCell className="text-left  font-mono text-xs">
											{file.updated_at
												? new Date(file.updated_at).toLocaleDateString()
												: "—"}
										</TableCell>
										<TableCell className="text-left  font-mono">
											{formatId(file.id)}
										</TableCell>
										<TableCell className={cn("p-0 w-12 text-center")}>
											<Checkbox
												onClick={(e) => e.stopPropagation()}
												checked={selectedResults.includes(file.id || file.name)}
												onCheckedChange={(checked) =>
													checked
														? setSelectedResults([
																...selectedResults,
																file.id || file.name,
														  ])
														: setSelectedResults(
																selectedResults.filter(
																	(key) => key !== (file.id || file.name)
																)
														  )
												}
												className="w-4 h-4 border-primary data-[state=checked]:bg-primary"
											/>
										</TableCell>
									</TableRow>
								))}

								{items.length === 0 && (
									<TableRow>
										<TableCell colSpan={7} className="text-center py-8">
											<div className="text-gray-400 font-mono">
												<Folder className="h-8 w-8 mx-auto mb-2 opacity-50" />
												<p>No items found in this location</p>
												<p className="text-sm mt-1">
													Try searching or navigating to a different folder
												</p>
											</div>
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>

						{items.length > 0 && (
							<Pagination
								page={page}
								totalPages={
									count || 0 / 20 < 1 ? 1 : Math.ceil(count || 0 / 20)
								}
							/>
						)}
					</Card>
				</div>
			</div>

			{/* Search Result Modal */}
			{selectedResult && (
				<SearchResultModal
					open={!!selectedResult}
					onClose={() => setSelectedResult("")}
					name={files.find((f) => f.id === selectedResult)?.name || ""}
					url={
						supabase.storage
							.from("canaan")
							.getPublicUrl(
								`${currentFolder}/${
									files.find((f) => f.id === selectedResult)?.name
								}`
							).data.publicUrl
					}
				/>
			)}

			<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
				<DialogContent className=" backdrop-blur-sm border-2 font-mono">
					<DialogHeader>
						<DialogTitle className="text-red-400 text-2xl">
							CONFIRM_DELETION
						</DialogTitle>
						<DialogDescription className="text-gray-400">
							This action is irreversible. You are about to permanently delete{" "}
							<span className="text-red-400 font-bold">
								{selectedResults.length}
							</span>{" "}
							item(s). Are you sure you want to proceed?
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="gap-2">
						<Button
							variant="outline"
							onClick={() => setIsDeleteDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleDeleteSelected}
							className="bg-red-500 hover:bg-red-600 text-white"
						>
							Delete Now
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

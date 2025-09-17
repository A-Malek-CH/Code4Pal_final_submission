"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "@uploadthing/react";
import {
	LucideAlertCircle,
	LucideRepeat,
	Upload,
	Zap,
	CheckCircle,
	Copy,
	Check,
} from "lucide-react";
import Gallery from "./gallary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatSize } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { FolderSchema, folderSchema } from "@/schemas/folder-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Input } from "../ui/input";
import { supabase } from "@/lib/supabase/supabase";

const CyberpunkFileUploadForm = () => {
	const { toast } = useToast();
	const [filesPayload, setFilesPayload] = useState<
		{
			file: File;
			status: "pending" | "success" | "error";
		}[]
	>([]);
	const [succussfulFiles, setSuccussfulFiles] = useState<File[]>([]);
	const queryClient = useQueryClient();
	const [files, setFiles] = useState<File[]>([]);
	const [dataToCopy, setDataToCopy] = useState<any>(null);
	const [isCopied, setIsCopied] = useState(false);
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		watch,
		reset,
	} = useForm<FolderSchema>({
		resolver: zodResolver(folderSchema),
		defaultValues: {
			name: "",
		},
	});
	const name = watch("name");
	// Upload mutation with progress tracking
	const uploadMutation = useMutation({
		mutationFn: async (filesToUpload: File[]) => {
			if (!name) {
				toast({
					title: "Folder Name is required for Media",
					description: "Please enter a folder name",
					variant: "destructive",
				});
				throw new Error("Folder Name is required");
			}
			const successfulFiles: File[] = [];
			const dataToCopy: any[] = [];
			for (let i = 0; i < filesToUpload.length; i++) {
				const file = filesToUpload[i];

				// Update status to processing
				setFilesPayload((prev) =>
					prev.map((item) =>
						item.file === file ? { ...item, status: "pending" as const } : item
					)
				);

				try {
					const { data: uploadData, error: uploadError } =
						await supabase.storage
							.from("canaan")
							.upload(`${name}/${file.name}`, file, {
								contentType: file.type,
								upsert: false,
								cacheControl: "3600",
								metadata: { size: file.size },
							});
					console.log("uploadData:", uploadData);
					console.log("uploadError:", uploadError);
					if (uploadError) throw uploadError;
					dataToCopy.push({
						...uploadData,
						publicUrl: supabase.storage
							.from("canaan")
							.getPublicUrl(uploadData.path),
					});
					// Mark as success
					setFilesPayload((prev) =>
						prev.map((item) =>
							item.file === file
								? { ...item, status: "success" as const }
								: item
						)
					);

					successfulFiles.push(file);
				} catch (error) {
					// Mark as error
					setFilesPayload((prev) =>
						prev.map((item) =>
							item.file === file ? { ...item, status: "error" as const } : item
						)
					);
					throw error;
				}
			}

			setSuccussfulFiles(successfulFiles);
			setDataToCopy(dataToCopy);
		},
		onSuccess: () => {
			toast({
				title: "Upload Successful!",
				description: `Successfully uploaded ${files.length} files to the media library.`,
			});
			queryClient.invalidateQueries({
				queryKey: ["media"],
			});
		},
		onError: (error) => {
			toast({
				title: "Upload Failed",
				description:
					error instanceof Error ? error.message : "Failed to upload files",
				variant: "destructive",
			});
		},
	});
	const onSubmit = (data: FolderSchema) => {};

	const onDrop = useCallback((acceptedFiles: File[]) => {
		if (acceptedFiles.length <= 10) {
			setFiles((prevFiles) => {
				// Filter out files that already exist (same name and size)
				const newFiles = acceptedFiles.filter(
					(newFile) =>
						!prevFiles.some(
							(existingFile) =>
								existingFile.name === newFile.name &&
								existingFile.size === newFile.size
						)
				);

				// Combine existing files with new unique files, but don't exceed 10 total
				const combinedFiles = [...prevFiles, ...newFiles];
				if (combinedFiles.length > 10) {
					return prevFiles; // Don't add if it would exceed limit
				}

				return combinedFiles;
			});

			setFilesPayload((prevPayload) => {
				// Filter out files that already exist
				const newFiles = acceptedFiles.filter(
					(newFile) =>
						!prevPayload.some(
							(existingPayload) =>
								existingPayload.file.name === newFile.name &&
								existingPayload.file.size === newFile.size
						)
				);

				// Combine existing payload with new file payloads
				const newPayloads = newFiles.map((file) => ({
					file,
					status: "pending" as const,
				}));

				const combinedPayload = [...prevPayload, ...newPayloads];
				if (combinedPayload.length > 10) {
					return prevPayload; // Don't add if it would exceed limit
				}

				return combinedPayload;
			});
		}
	}, []);

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		accept: {
			"image/jpeg": [".jpeg", ".jpg"],
			"image/png": [".png"],
			"image/webp": [".webp"],
			"image/gif": [".gif"],
			"image/avif": [".avif"],
			"application/pdf": [".pdf"],
			"video/mp4": [".mp4"],
			"video/webm": [".webm"],
		},
		maxFiles: 10,
		maxSize: 1024 * 1024 * 20,
	});
	// In your component, before using useUploadThing

	return (
		<div className="min-h-screen py-20 px-4">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-4xl font-bold text-primary mb-8 text-center font-mono">
					Storage Upload
				</h1>

				<Card className="bg-background border-2 border-border backdrop-blur-sm">
					<CardHeader>
						<CardTitle className="text-primary font-mono flex items-center space-x-2">
							<Zap className="h-5 w-5" />
							<span>Upload Interface</span>
						</CardTitle>
					</CardHeader>

					<CardContent className="space-y-6">
						<div>
							<Label htmlFor="name" className="text-primary/70 font-mono">
								Folder Name
							</Label>
							<Input
								id="name"
								type="text"
								{...register("name")}
								className={`font-mono ${
									errors.name ? "border-red-500 focus:border-red-500" : ""
								}`}
							/>
							{errors.name && (
								<p className="text-red-500 text-sm mt-1 font-mono">
									{errors.name.message}
								</p>
							)}
						</div>
						{/* Upload Area */}
						{!uploadMutation.isPending && !uploadMutation.isSuccess && (
							<section className="flex flex-col">
								<div
									{...getRootProps()}
									className="flex flex-col items-center justify-center w-full h-32 p-4 border-2 border-dashed rounded-lg cursor-pointer relative overflow-hidden
                    border-border hover:border-border/70 hover:bg-background/70 
                     bg-background backdrop-blur-sm"
								>
									<input
										{...getInputProps()}
										disabled={uploadMutation.isPending}
									/>

									{/* <div className="absolute inset-0 bg-[linear-gradient(rgba(0,247,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,247,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] rounded-lg"></div> */}

									<div className="relative z-10 text-center">
										<Upload className="h-8 w-8 text-primary mx-auto mb-2 animate-pulse" />
										<p className="text-primary font-mono">
											Drop files here or click to browse
										</p>
										<p className="text-gray-400 font-mono text-xs mt-1">
											Advanced media processing zone
										</p>
									</div>

									{/* <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00f7ff] via-[#9600ff] to-[#ff00f7] opacity-50 animate-[dataStream_2s_linear_infinite] bg-[length:200%_100%]"></div> */}
								</div>

								{files.length > 0 && (
									<div className="flex justify-center space-x-4 mt-4 ">
										<Button
											type="button"
											onClick={() => uploadMutation.mutate(files)}
											disabled={uploadMutation.isPending}
										>
											<Upload className="h-4 w-4 mr-2" />
											Upload {files.length} files
										</Button>
										<Button
											type="button"
											onClick={() => {
												setFiles([]);
												setFilesPayload([]);
												uploadMutation.reset();
											}}
											variant="outline"
										>
											Clear Files
										</Button>
									</div>
								)}
							</section>
						)}
						{uploadMutation.isSuccess && (
							<Button
								type="button"
								onClick={() => {
									navigator.clipboard.writeText(JSON.stringify(dataToCopy));
									setIsCopied(true);
									setTimeout(() => setIsCopied(false), 2000);
								}}
								variant="outline"
							>
								Copy Files JSON
								{isCopied ? (
									<Check className="h-4 w-4 ml-2" />
								) : (
									<Copy className="h-4 w-4 ml-2" />
								)}
							</Button>
						)}
						{/* Progress with individual file status */}
						{uploadMutation.isPending && (
							<div className="flex flex-col w-full justify-center items-center py-4">
								<div className="w-full max-w-md space-y-4">
									<div className="text-center">
										<p className="text-primary font-mono text-lg mb-2">
											UPLOADING FILES...
										</p>
									</div>

									{/* Individual file progress */}
									<div className="space-y-3">
										{filesPayload.map((item, index) => (
											<div
												key={`${item.file.name}-${index}`}
												className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border"
											>
												<div className="flex items-center space-x-3 flex-1">
													{/* Status Icon */}
													<div className="flex-shrink-0">
														{item.status === "pending" && (
															<div className="w-5 h-5 border-2 border-border border-t-transparent rounded-full animate-spin"></div>
														)}
														{item.status === "success" && (
															<CheckCircle className="w-5 h-5 text-green-400" />
														)}
														{item.status === "error" && (
															<LucideAlertCircle className="w-5 h-5 text-red-400" />
														)}
													</div>

													{/* File Info */}
													<div className="flex-1 min-w-0">
														<p className="text-primary/70 font-mono text-sm truncate">
															{item.file.name}
														</p>
														<p className="text-primary/90 font-mono text-xs">
															{formatSize(item.file.size)}
														</p>
													</div>

													{/* Status Text */}
													<div className="flex-shrink-0">
														<span
															className={`font-mono text-xs px-2 py-1 rounded ${
																item.status === "pending"
																	? "text-primary bg-background/80"
																	: item.status === "success"
																	? "text-green-400 bg-green-400/20"
																	: "text-red-400 bg-red-400/20"
															}`}
														>
															{item.status === "pending" && "UPLOADING"}
															{item.status === "success" && "SUCCESS"}
															{item.status === "error" && "FAILED"}
														</span>
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						)}

						{/* Error State */}
						{uploadMutation.isError && (
							<div className="flex flex-col w-full justify-center items-center py-4">
								<div className="flex flex-col items-center space-y-4 p-6 border border-red-500/50 rounded-lg bg-red-500/10 backdrop-blur-sm">
									<div className="flex items-center space-x-4">
										<LucideAlertCircle color="red" className="h-6 w-6" />
										<p className="text-lg font-medium text-red-500 font-mono">
											UPLOAD_ERROR
										</p>
									</div>
									<p className="text-red-300 font-mono text-sm text-center">
										{uploadMutation.error?.message || "Upload failed"}
									</p>
									<Button
										type="button"
										onClick={() => uploadMutation.mutate(files)}
										className="px-4 py-2 bg-red-500/20 border border-red-500 text-red-400 hover:bg-red-500/30 font-mono rounded-md"
									>
										<LucideRepeat className="w-4 h-4 mr-2" />
										Retry Upload
									</Button>
								</div>
							</div>
						)}

						{/* Success State */}
						{uploadMutation.isSuccess && (
							<div className="flex flex-col items-center space-y-4 p-6 border border-green-500/50 rounded-lg bg-green-500/10 backdrop-blur-sm">
								<div className="flex items-center space-x-2 text-green-400">
									<CheckCircle className="h-6 w-6" />
									<p className="font-mono text-lg">UPLOAD_COMPLETE</p>
								</div>
								<p className="text-green-300 font-mono text-sm">
									All files uploaded successfully to the media library
								</p>
								<Button
									onClick={() => {
										uploadMutation.reset();
										setFiles([]);
									}}
									className="bg-green-500/20 border border-green-500 text-green-400 hover:bg-green-500/30 font-mono"
								>
									Upload More Files
								</Button>
							</div>
						)}

						{/* Enhanced Gallery with Edit Options */}
						<div className="space-y-4 min-h-96">
							<Gallery
								uploading={uploadMutation.isPending}
								completed={uploadMutation.isSuccess}
								images={files.map((file, index) => ({
									file,
									name: file.name,
									key: `file-${index}`,
									size: formatSize(file.size),
									url: URL.createObjectURL(file),
								}))}
								deleteImage={(index: number) => {
									if (!uploadMutation.isPending && !uploadMutation.isSuccess) {
										setFiles((prev) => prev.filter((_, i) => i !== index));
									}
								}}
							/>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default CyberpunkFileUploadForm;

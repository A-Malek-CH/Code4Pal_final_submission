"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Download, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface SearchResultModalProps {
	open: boolean;
	onClose: () => void;
	name: string;
	url: string;
}

export function SearchResultModal({
	open,
	onClose,
	name,
	url,
}: SearchResultModalProps) {
	const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(name);
	const isPDF = /\.pdf$/i.test(name);
	const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(name);
	const isAudio = /\.(mp3|wav|ogg)$/i.test(name);

	const handleCopyUrl = () => {
		navigator.clipboard.writeText(url);
		toast.success("URL copied to clipboard");
	};

	const handleDownload = () => {
		const link = document.createElement("a");
		link.href = url;
		link.download = name;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<>
			{/* <Button
        variant="ghost"
        size="sm"
        className="text-[#00f7ff] hover:bg-[#00f7ff]/20 border border-[#00f7ff]/30"
        onClick={() => (open ? onClose() : open)}
      >
        {isImage ? "View" : "Preview"}
      </Button> */}

			<Dialog open={open} onOpenChange={onClose}>
				<DialogContent className="sm:max-w-[800px] bg-background border-border p-4">
					{/* <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 z-10 text-gray-400 hover:text-white hover:bg-gray-800/50"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div> */}

					<div className="p-6">
						<div className="mb-4 flex items-center justify-between">
							<h2 className="text-xl font-bold text-primary font-mono truncate max-w-[500px]">
								{name}
							</h2>
							<div className="flex space-x-2">
								<Button variant="outline" size="sm" onClick={handleCopyUrl}>
									<Copy className="h-4 w-4 mr-2" />
									Copy URL
								</Button>
								<Button variant="outline" size="sm" onClick={handleDownload}>
									<Download className="h-4 w-4 mr-2" />
									Download
								</Button>
							</div>
						</div>

						<div className="bg-background rounded-lg border border-border overflow-hidden flex items-center justify-center">
							{isImage && (
								<div className="relative w-full h-[400px]">
									<Image
										src={url || "/placeholder.svg"}
										alt={name}
										fill
										className="object-contain"
									/>
								</div>
							)}

							{isPDF && (
								<iframe
									src={`${url}#view=FitH`}
									className="w-full h-[500px]"
									title={name}
								/>
							)}

							{isVideo && (
								<video controls className="w-full max-h-[500px]">
									<source src={url} type={`video/${name.split(".").pop()}`} />
									Your browser does not support the video tag.
								</video>
							)}

							{isAudio && (
								<audio controls className="w-full p-8">
									<source src={url} type={`audio/${name.split(".").pop()}`} />
									Your browser does not support the audio tag.
								</audio>
							)}

							{!isImage && !isPDF && !isVideo && !isAudio && (
								<div className="p-8 text-center">
									<p className="text-gray-400 font-mono">
										Preview not available for this file type
									</p>
									<p className="text-primary mt-2 font-mono">
										Download to view content
									</p>
								</div>
							)}
						</div>

						<div className="mt-4 bg-background p-3 rounded-md border border-border">
							<p className="text-primary text-sm font-mono break-all">
								<span className="text-primary">URL:</span> {url}
							</p>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}

import React from "react";
import { useEmbedDocument } from "@/hooks/use-embeddings";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { SourceDB } from "@/types/source";

interface EmbeddingProgressProps {
	activeSource: SourceDB;
	onClose: () => void; // A function to call when done (e.g., close a modal)
}

export const EmbeddingProgress: React.FC<EmbeddingProgressProps> = ({
	activeSource,
	onClose,
}) => {
	const { mutate, progress, isPending, isSuccess, isError, error, data } =
		useEmbedDocument();

	const handleStartEmbedding = () => {
		const metadata = {
			sourceName: activeSource.title,
			author: activeSource.author,
			publishDate: activeSource.publish_date ? activeSource.publish_date : null,
			type: activeSource.type,
			url: activeSource.url,
			createdAt: activeSource.created_at,
		};
		mutate(
			{
				sourceId: activeSource.id,
				content: activeSource.content,
				metadata,
			},
			{
				onSuccess: (result) => {
					toast.success(result.message);
					onClose();
				},
				onError: (err) => {
					toast.error(err.message);
					onClose();
				},
			}
		);
	};

	const percentage =
		progress.total > 0
			? Math.round((progress.current / progress.total) * 100)
			: 0;

	return (
		<div className="flex flex-col items-center gap-4 p-6">
			<h2 className="text-xl font-semibold">Document Embedding</h2>

			{!isPending && !isSuccess && !isError && (
				<>
					<p className="text-center text-muted-foreground">
						Click the button below to start processing the document and creating
						embeddings.
					</p>
					<div className="flex justify-end gap-2 pt-2">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							disabled={isPending}
						>
							Cancel
						</Button>
						<Button
							type="button"
							onClick={() => handleStartEmbedding()}
							disabled={isPending}
						>
							{isPending ? "Processing..." : "Start Processing"}
						</Button>
					</div>
				</>
			)}

			{isPending && (
				<div className="w-full">
					<p className="mb-2 text-center">
						Processing chunk {progress.current} of {progress.total}...
					</p>
					<div className="w-full bg-card rounded-full h-2.5 ">
						<div
							className="bg-primary h-2.5 rounded-full transition-all duration-300"
							style={{ width: `${percentage}%` }}
						></div>
					</div>
					<p className="mt-2 text-center font-semibold">{percentage}%</p>
				</div>
			)}

			{isSuccess && (
				<div className="text-center text-green-600 dark:text-green-400">
					<p>✅ Process Complete!</p>
					<p>{data?.message}</p>
				</div>
			)}

			{isError && (
				<div className="text-center text-red-600 dark:text-red-400">
					<p>❌ An error occurred:</p>
					<p>{error?.message}</p>
				</div>
			)}
		</div>
	);
};

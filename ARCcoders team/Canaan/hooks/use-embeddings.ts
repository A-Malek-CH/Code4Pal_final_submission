import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Define the structure of the data chunks we expect from the stream
type StreamedProgress = {
	type: "progress";
	data: { progress: number; total: number };
};

type StreamedComplete = {
	type: "complete";
	data: { message: string; sourceId: string };
};

type StreamedError = {
	type: "error";
	error: string;
};

type StreamedChunk = StreamedProgress | StreamedComplete | StreamedError;

// Define the arguments for our mutation
interface EmbedMutationArgs {
	sourceId: string;
	content: string;
	metadata: Record<string, any>;
}

// The hook itself
export const useEmbedDocument = () => {
	const queryClient = useQueryClient();
	const [progress, setProgress] = useState({ current: 0, total: 0 });

	const embeddingMutation = useMutation<
		StreamedComplete["data"], // Type of data returned on success
		Error, // Type of error
		EmbedMutationArgs // Type of variables passed to mutationFn
	>({
		// The core mutation function that handles the streaming fetch
		mutationFn: async ({ sourceId, content, metadata }) => {
			// Reset progress on new mutation
			setProgress({ current: 0, total: 0 });

			const response = await fetch("/api/embedding", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ sourceId, content, metadata }),
			});

			if (!response.ok) {
				const errorData: any = await response.json();
				throw new Error(
					errorData.error || "Failed to start embedding process."
				);
			}

			if (!response.body) {
				throw new Error("Response body is missing.");
			}

			// This promise will resolve or reject when the stream is complete
			return new Promise((resolve, reject) => {
				const reader = response.body!.getReader();
				const decoder = new TextDecoder();
				let buffer = "";

				const processStream = async () => {
					while (true) {
						const { done, value } = await reader.read();
						if (done) break;

						buffer += decoder.decode(value, { stream: true });
						const chunks = buffer.split("\n");

						// Keep the last partial chunk in the buffer
						buffer = chunks.pop() || "";

						for (const chunk of chunks) {
							if (chunk.trim() === "") continue;
							try {
								const parsed: StreamedChunk = JSON.parse(chunk);

								switch (parsed.type) {
									case "progress":
										setProgress({
											current: parsed.data.progress + 1, // +1 for 1-based index
											total: parsed.data.total,
										});
										break;
									case "complete":
										resolve(parsed.data); // Resolve the promise on completion
										return; // Stop processing
									case "error":
										reject(new Error(parsed.error)); // Reject on error
										return; // Stop processing
								}
							} catch (e) {
								console.error("Failed to parse stream chunk:", chunk, e);
								// Continue to the next chunk
							}
						}
					}
				};

				processStream().catch(reject);
			});
		},
		onSuccess: (data) => {
			console.log("Embedding successful:", data.message);
			// Invalidate queries to refetch the list of sources, which will now show as "Embedded"
			queryClient.invalidateQueries({ queryKey: ["sources"] });
		},
		onError: (error) => {
			console.error("Embedding mutation failed:", error.message);
			// You could also reset progress here if desired
			setProgress({ current: 0, total: 0 });
		},
	});

	return {
		mutate: embeddingMutation.mutate,
		mutateAsync: embeddingMutation.mutateAsync,
		progress,
		isPending: embeddingMutation.isPending,
		isSuccess: embeddingMutation.isSuccess,
		isError: embeddingMutation.isError,
		error: embeddingMutation.error,
		data: embeddingMutation.data,
	};
};

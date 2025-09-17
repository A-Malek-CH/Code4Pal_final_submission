/**
 * The expected shape of the API response for better type safety.
 */
export interface EmbedApiResponse {
	message: string;
	sourceId: string;
	chunksCreated: number;
}

/**
 * Triggers the embedding process by calling the backend API endpoint.
 * This function is designed to be called from client-side components.
 *
 * @param sourceId The UUID of the parent source.
 * @param content The full text content to be chunked and embedded.
 * @param metadata A JSON object with additional details about the source.
 * @returns A promise that resolves with the API response on success.
 * @throws An error with a user-friendly message if the API call fails.
 */
export async function createDocumentEmbedding(
	sourceId: string,
	content: string,
	metadata: Record<string, any>
): Promise<EmbedApiResponse> {
	// 1. Construct the request body from the function arguments
	const requestBody = {
		sourceId,
		content,
		metadata,
	};

	// 2. Call the API endpoint using fetch
	const response = await fetch("/api/embedding", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(requestBody),
	});

	// 3. Handle the response
	const data: any = await response.json();

	if (!response.ok) {
		// If the server returns an error (e.g., status 400 or 500),
		// throw an error to be caught by the calling component.
		// The `data.error` field will contain the specific message from our API handler.
		throw new Error(
			data.error || "Failed to create embeddings. Please try again."
		);
	}

	// 4. Return the successful response data
	return data as EmbedApiResponse;
}

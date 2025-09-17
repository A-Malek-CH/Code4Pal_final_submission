// File: lib/jina-embeddings.ts

import { getEnvironmentVariable } from "@langchain/core/utils/env";
import { chunkArray } from "@langchain/core/utils/chunk_array";
import { Embeddings, type EmbeddingsParams } from "@langchain/core/embeddings";
import { sleep } from "../utils";

export interface JinaAIEmbeddingsParams extends EmbeddingsParams {
	apiKey?: string;
	model?: string;
	task?:
		| "retrieval.document"
		| "retrieval.query"
		| "retrieval.passage"
		| "classification.claim"
		| "classification.sentence"
		| "reranking.pair";
	dimensions?: number;
	late_chunking?: boolean;
	/**
	 * The number of documents to embed in a single API call.
	 * @default 512
	 */
	batchSize?: number;
}

export class JinaAIEmbeddings extends Embeddings {
	private readonly apiKey: string;
	private readonly model: string;
	private readonly task?: string;
	private readonly dimensions?: number;
	private readonly late_chunking?: boolean;
	private readonly batchSize: number;
	/** Timeout in milliseconds to wait between each document embedding call. */
	timeoutBetweenDocs: number;
	/** Maximum number of retries for a failed API call. */
	maxRetries: number;
	/** Initial delay in milliseconds for retries, will be increased exponentially. */
	retryDelay: number;
	private readonly apiUrl = "https://api.jina.ai/v1/embeddings";

	constructor(
		fields?: JinaAIEmbeddingsParams & {
			timeoutBetweenDocs?: number;
			maxRetries?: number;
			retryDelay?: number;
		}
	) {
		super(fields ?? {});

		this.apiKey =
			(fields?.apiKey ?? getEnvironmentVariable("JINA_API_KEY")) || "";
		if (!this.apiKey) {
			throw new Error(
				"Jina AI API key not found. Please set the JINA_API_KEY environment variable or pass it to the constructor."
			);
		}

		this.model = fields?.model ?? "jina-embeddings-v4";
		this.batchSize = fields?.batchSize ?? 512; // A safe default batch size
		this.task = fields?.task;
		this.dimensions = fields?.dimensions;
		this.late_chunking = fields?.late_chunking;
		this.timeoutBetweenDocs = fields?.timeoutBetweenDocs ?? 50;
		this.maxRetries = fields?.maxRetries ?? 3;
		this.retryDelay = fields?.retryDelay ?? 1000;
	}
	async *embedDocumentsGenerator(texts: string[]) {
		for (let i = 0; i < texts.length; i++) {
			const text = texts[i];

			// Use the new method with retry logic to embed a single document
			const embedding = await this._embedSingleDocumentWithRetry(text);
			yield embedding;
			yield { progress: i, total: texts.length };
			// If it's not the last document, wait for the specified timeout.
			if (i < texts.length - 1) {
				await sleep(this.timeoutBetweenDocs);
			}
		}
	}
	/**
	 * Generates embeddings for a list of documents, one at a time.
	 * This method processes each document serially, with a configurable delay
	 * and retry mechanism between each API call.
	 */
	async embedDocuments(texts: string[]) {
		const allEmbeddings: number[][] = [];

		for (let i = 0; i < texts.length; i++) {
			const text = texts[i];

			// Use the new method with retry logic to embed a single document
			const embedding = await this._embedSingleDocumentWithRetry(text);
			allEmbeddings.push(embedding);

			// If it's not the last document, wait for the specified timeout.
			if (i < texts.length - 1) {
				await sleep(this.timeoutBetweenDocs);
			}
		}

		return allEmbeddings;
	}

	/**
	 * Generates an embedding for a single query text, with retry logic.
	 */
	async embedQuery(text: string): Promise<number[]> {
		// This now benefits from the same robust retry logic.
		return this._embedSingleDocumentWithRetry(text);
	}

	/**
	 * Private method to embed a single document with a retry-on-failure mechanism.
	 * Implements exponential backoff for delays between retries.
	 * @param doc The document text to embed.
	 * @returns A promise that resolves to the embedding array.
	 */
	private async _embedSingleDocumentWithRetry(doc: string): Promise<number[]> {
		for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
			try {
				// _callApi expects an array, so we wrap the single doc.
				const batchResponse = await this._callApi([{ text: doc }]);

				// The API returns an array of embeddings; we need the first one.
				if (batchResponse && batchResponse.length > 0) {
					return batchResponse[0];
				}

				// Handle cases where the API returns a successful but empty response.
				throw new Error(
					"API returned an empty or invalid response for the document."
				);
			} catch (error) {
				console.error(
					`Error embedding document on attempt ${attempt}/${this.maxRetries}:`,
					error
				);

				// If this was the last attempt, re-throw the error to fail the process.
				if (attempt === this.maxRetries) {
					throw error;
				}

				// Calculate delay with exponential backoff (e.g., 1s, 2s, 4s, ...)
				const delay = this.retryDelay * Math.pow(2, attempt - 1);
				await sleep(delay);
			}
		}
		// This line should be unreachable if maxRetries > 0, but it satisfies TypeScript's need for a return path.
		throw new Error("Embedding failed after all retries.");
	}

	/**
	 * Private method to make the actual API call.
	 * It accepts an array of text objects.
	 * (Note: The type signature was corrected from `Array<number[][]>` to `Promise<number[][]>`)
	 */
	private async _callApi(input: { text: string }[]): Promise<number[][]> {
		const body: Record<string, unknown> = {
			model: this.model,
			input: input,
		};
		// Note: removed `string` from input type as we now always send an array.
		if (this.task) body.task = this.task;
		if (this.dimensions) body.dimensions = this.dimensions;
		if (this.late_chunking !== undefined)
			body.late_chunking = this.late_chunking;

		const response = await fetch(this.apiUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.apiKey}`,
			},
			body: JSON.stringify(body),
		});

		if (!response.ok) {
			const errorData: any = await response.json();
			const detail = errorData.detail || JSON.stringify(errorData);
			throw new Error(
				`Jina AI API request failed with status ${response.status}: ${detail}`
			);
		}

		const json: any = await response.json();

		// The API returns an array of objects like { index: 0, embedding: [...] }
		// We must sort by index to guarantee the order matches the input batch.
		// Even for a single item, this is safe.
		const sortedData: any[] = json.data.sort(
			(a: any, b: any) => a.index - b.index
		);
		// console.log("🚀 ~ JinaAIEmbeddings ~ _callApi ~ sortedData:", sortedData);

		return sortedData.map((item: any) => item.embedding);
	}
}

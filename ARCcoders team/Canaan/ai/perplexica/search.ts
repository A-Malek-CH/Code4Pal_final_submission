import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { Handlers, THandlersKeys } from "../messageHandler";
import {
	AIMessage,
	BaseMessage,
	HumanMessage,
	MessageContentText,
} from "@langchain/core/messages";
import { MetaAgentType } from "../search/metaAgent";
import { Embeddings } from "@langchain/core/embeddings";
import EventEmitter from "eventemitter3";
import { Document } from "langchain/document";
import { RemoteFileAttachment } from "@/types/attachment";
import { JinaAIEmbeddings } from "@/lib/tools/jina-embedding";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// this utility function to convert EventEmitter to AsyncIterator
export function on(emitter: EventEmitter, event: string) {
	const queue: any[] = [];
	const resolvers: ((value: IteratorResult<any>) => void)[] = [];
	let finished = false;

	const listener = (data: any) => {
		if (resolvers.length > 0) {
			resolvers.shift()!({ value: data, done: false });
		} else {
			queue.push(data);
		}
	};

	const endListener = () => {
		if (resolvers.length > 0) {
			resolvers.shift()!({ value: undefined, done: true });
		}
		finished = true;
	};

	emitter.on(event, listener);
	emitter.on("end", endListener); // Listen for the 'end' event

	return {
		[Symbol.asyncIterator]() {
			return this;
		},
		next() {
			return new Promise((resolve) => {
				if (queue.length > 0) {
					resolve({ value: queue.shift(), done: false });
				} else if (finished) {
					resolve({ value: undefined, done: true });
				} else {
					resolvers.push(resolve);
				}
			});
		},
		return() {
			// Clean up listeners when the consumer stops listening
			emitter.removeListener(event, listener);
			emitter.removeListener("end", endListener);
			return Promise.resolve({ done: true });
		},
	};
}

async function* streamSearchResponse(
	query: MessageContentText[],
	history: BaseMessage[],
	llm: BaseChatModel,
	embeddings: Embeddings | undefined,
	searchHandler: MetaAgentType,
	attachments: RemoteFileAttachment[] = []
) {
	const emitter = await searchHandler.searchAndAnswer(
		query,
		history,
		llm,
		embeddings,
		attachments
	);

	let message = "";
	let reasoning_content = "";
	let sources: Document[] = [];

	try {
		for await (const event of on(emitter, "data") as any) {
			const parsedData = JSON.parse(event);
			console.log("🚀 ~ streamSearchResponse ~ parsedData:");
			if (parsedData.type === "end") {
				yield { type: "end" };
				break;
			}
			if (parsedData.type === "response") {
				if (!parsedData.data && message.length > 0) break;
				message += parsedData.data;
				yield { type: "message", data: parsedData.data };
			} else if (parsedData.type == "reasoning") {
				reasoning_content += parsedData.data;
				yield { type: "reasoning", data: parsedData.data };
			} else if (parsedData.type === "sources") {
				sources = parsedData.data;
				yield { type: "sources", data: parsedData.data };
			} else if (parsedData.type === "action") {
				console.log("action", parsedData.data);
				yield { type: "action", data: parsedData.data };
			} else if (parsedData.type === "error") {
				yield { type: "error", data: parsedData.data };
				break;
			}
		}
		console.log("End stream");
		yield { type: "end" };
	} catch (error) {
		console.log("🚀 ~ streamSearchResponse ~ error:", error);
		yield {
			type: "error",
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
export interface ChatRequestBody {
	signal?: AbortSignal;
	task: THandlersKeys;
	query: MessageContentText[];
	history: Array<[string, any]>;
	attachments?: RemoteFileAttachment[];
}
export type BackEndRequestBody = Omit<ChatRequestBody, "signal">;
export interface UserChatRequestBody {
	optimizationMode: "speed" | "balanced";
	query: MessageContentText[];
	history: Array<[string, any]>;
	attachments?: RemoteFileAttachment[];
}
async function initializeModels() {
	const llm = new ChatGoogleGenerativeAI({
		model: "gemini-2.5-flash",
		temperature: 0,
		apiKey: "AIzaSyBYxVUmc2y3lpA97ITqk4ZXY4mOSsOHZ6g",
		metadata: {
			isMultimodal: true,
		},
	});

	const embeddings = new JinaAIEmbeddings({
		apiKey: "jina_ff70fcb79ac341dcafad18970b711b67bjuoz_pC_DiS1dAFESA_AX25g7uP",
		...{
			model: "jina-embeddings-v3",
			task: "retrieval.query" as const,
			late_chunking: true,
			dimensions: 768,
		},
	});
	return { llm, embeddings };
}

export async function* handleChatRequest(body: BackEndRequestBody) {
	try {
		const { llm, embeddings } = await initializeModels();
		const searchHandler = Handlers[body.task];
		if (!searchHandler) {
			throw new Error("Invalid focus mode");
		}

		const history = body.history.map((msg) => {
			if (msg[0] === "user") {
				return new HumanMessage({ content: msg[1] });
			} else if (msg[0] === "assistant") {
				return new AIMessage({ content: msg[1] });
			} else {
				throw new Error("Unknown message type in history");
			}
		});

		yield* streamSearchResponse(
			body.query,
			history,
			llm,
			embeddings,
			searchHandler,
			body.attachments
		);
	} catch (error: any) {
		console.error("Error streaming response: " + error.message);
		yield {
			type: "error",
			data: error.message,
		};
	}
}

/**
 * Makes a streaming POST request and yields parsed events.
 * This is an async generator function.
 * @param {ChatRequestBody} requestBody - The body of the request.
 */
export async function* handleChatRequestFront(requestBody: ChatRequestBody) {
	// The API endpoint
	const api = "/api/agent"; // Or your actual API endpoint

	try {
		// 1. Make the API call using fetch with the signal for abortion
		const response = await fetch(api, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			// Pass the signal here to make the request cancellable
			signal: requestBody.signal,
			// The body doesn't need the signal inside it
			body: JSON.stringify({
				query: requestBody.query,
				history: requestBody.history,
				attachments: requestBody.attachments,
				task: requestBody.task,
			}),
		});

		// 2. Handle non-ok responses
		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(
				`API Error: ${response.status} ${response.statusText} - ${errorText}`
			);
		}

		// 3. Ensure the body is a readable stream
		if (!response.body) {
			throw new Error("Response body is not a readable stream.");
		}

		// 4. Set up the reader and decoder
		const reader = response.body.getReader();
		const decoder = new TextDecoder("utf-8");
		let buffer = "";

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			buffer += decoder.decode(value, { stream: true });

			// --- START: THE FIX IS HERE ---

			// Split by the boundary between JSON objects: a closing brace followed by an opening brace.
			// The positive lookahead (?={) ensures the opening brace of the next object is not consumed.
			const potentialJsons = buffer.split(/}(?={)/g);

			// The last element in the array might be an incomplete JSON object. We keep it in the buffer.
			buffer = potentialJsons.pop() || "";

			// Process all the complete JSON strings we've found.
			for (const jsonString of potentialJsons) {
				try {
					// The split removed the closing brace, so we need to add it back.
					const completeJson = jsonString + "}";
					const event = JSON.parse(completeJson);
					yield event;
				} catch (error) {
					console.error("Failed to parse JSON chunk:", jsonString + "}");
					// This might happen if the server sends a malformed chunk.
					// Depending on your needs, you might want to continue or yield an error.
				}
			}
			// --- END: THE FIX IS HERE ---
		}

		// After the loop, process any complete JSON object remaining in the buffer.
		if (buffer.trim()) {
			try {
				const event = JSON.parse(buffer);
				yield event;
			} catch (error) {
				console.error("Failed to parse final buffer content:", buffer);
			}
		}
	} catch (error: any) {
		// Handle errors, including the AbortError from cancellation
		if (error.name === "AbortError") {
			console.log("Chat request was aborted.");
			// Simply return to gracefully end the generator
			return;
		}
		// For other errors, yield an error event for the front-end to handle
		console.error("Error in handleChatRequest:", error);
		yield { type: "error", data: error.message };
	}
}

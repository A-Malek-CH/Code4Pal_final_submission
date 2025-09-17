import { ChatOpenAI } from "@langchain/openai";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import type { Embeddings } from "@langchain/core/embeddings";
import {
	ChatPromptTemplate,
	MessagesPlaceholder,
	HumanMessagePromptTemplate,
} from "@langchain/core/prompts";
import {
	RunnableLambda,
	RunnableMap,
	RunnableSequence,
} from "@langchain/core/runnables";
import {
	BaseMessage,
	HumanMessage,
	MessageContentText,
} from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import LineOutputParser from "@/ai/outputParsers/lineOutputParser";
import { Document } from "langchain/document";
import { Document as ResultDocument } from "@prisma/client";
// import { searchSearxng } from "@/ai/searxng";
import { EventEmitter } from "eventemitter3";
import { StreamEvent } from "@langchain/core/tracers/log_stream";
import { IterableReadableStream } from "@langchain/core/utils/stream";
import { RemoteFileAttachment } from "@/types/attachment";
import { searchDocuments } from "@/lib/supabase";
import { imageUrlToBase64 } from "@/lib/utils";
export interface MetaAgentType {
	searchAndAnswer: (
		message: MessageContentText[],
		history: BaseMessage[],
		llm: BaseChatModel,
		embeddings: Embeddings | undefined,
		attachments: RemoteFileAttachment[]
	) => Promise<EventEmitter>;
}
interface Config {
	searchDocuments: boolean;
	summarizer: boolean;
	queryGeneratorPrompt: string;
	responsePrompt: string;
	activeEngines: string[];
}
type BasicChainInput = { chat_history: BaseMessage[]; query: HumanMessage };
class MetaAgent implements MetaAgentType {
	private config: Config;
	private strParser = new StringOutputParser();
	private emitter = new EventEmitter();
	constructor(config: Config) {
		this.config = config;
	}
	private async createSearchRetrieverChain(
		llm: BaseChatModel,
		embeddings: Embeddings
	) {
		process.env.NODE_ENV == "development" &&
			console.log("Creating search retriever chain...");
		(llm as unknown as ChatOpenAI).temperature = 0;
		return RunnableSequence.from([
			ChatPromptTemplate.fromMessages([
				["system", this.config.queryGeneratorPrompt],
				new MessagesPlaceholder("chat_history"),
				new MessagesPlaceholder("query"),
			]),
			async (input) => {
				console.log("Search retriever chain input LLM:");
				return await llm.invoke(input);
			},
			this.strParser,
			RunnableLambda.from(async (generatedQuery: string) => {
				process.env.NODE_ENV === "development" &&
					console.log(
						"Lambda input (generated query):",
						generatedQuery.slice(0, 40)
					);

				try {
					if (generatedQuery.toLowerCase().trim() === "not_needed") {
						process.env.NODE_ENV === "development" &&
							console.log("Query not needed, returning empty result.");
						return { query: "", docs: [] };
					}

					// --- START: DOCUMENT RETRIEVAL (The only part that changes) ---
					this.emitter.emit(
						"data",
						JSON.stringify({
							type: "action",
							data: `Searching database for: "${generatedQuery}"`,
						})
					);

					const queryEmbedding = await embeddings.embedQuery(generatedQuery);
					let dbResults: ResultDocument[] = await searchDocuments(
						queryEmbedding,
						5 // Limit to 5 docs to avoid high cost/latency from summarization
					);

					if (!dbResults || dbResults.length === 0) {
						process.env.NODE_ENV === "development" &&
							console.log("No documents found in the database.");
						return { query: generatedQuery, docs: [] };
					}
					dbResults = dbResults.map((result) => ({
						...result,
						metadata: {
							...(result.metadata as any),
							document_id: result.id,
							source_id: result.source_id,
						},
					}));
					const documents: Document[] = [];
					dbResults.map((result) => {
						const document = new Document({
							pageContent: result.content as string,
							metadata: result.metadata as any, // Pass through the original metadata
						});
						documents.push(document);
					});
					// --- END: DOCUMENT RETRIEVAL ---

					// --- START: PER-DOCUMENT SUMMARIZATION (The logic you wanted me to keep) ---
					process.env.NODE_ENV === "development" &&
						console.log(
							`Found ${dbResults.length} documents from DB. Summarizing each...`
						);

					return { query: generatedQuery, docs: documents };
					// --- END: PER-DOCUMENT SUMMARIZATION ---
				} catch (error: any) {
					console.trace();
					console.error(
						"Something Wrong Happened in search retriever chain:",
						error.message
					);
					return { query: "", docs: [] };
				}
			}),
		]);
	}
	private async createAnsweringChain(
		llm: BaseChatModel,
		embeddings: Embeddings | undefined
	) {
		process.env.NODE_ENV == "development" &&
			console.log("Creating answering chain...");
		const searchRetrieverChain = await this.createSearchRetrieverChain(
			llm,
			embeddings!
		);

		this.emitter.emit(
			"data",
			JSON.stringify({
				type: "action",
				data: "Building answer...",
			})
		);
		const contextRetriever = RunnableLambda.from(
			async (input: BasicChainInput) => {
				const { query, chat_history } = input;
				console.log("Query:");
				let docs: Document[] | null = null;
				if (this.config.searchDocuments) {
					process.env.NODE_ENV == "development" &&
						console.log("Generating search query with: Query");
					const searchRetrieverResult = await searchRetrieverChain.invoke({
						chat_history,
						query,
					});
					docs = searchRetrieverResult.docs;
					return {
						query,
						docs: docs ?? [],
						chat_history,
					};
				}
				return {
					query,
					docs: [],
					chat_history,
				};
			}
		).withConfig({ runName: "FinalSourceRetriever" });
		return RunnableSequence.from([
			contextRetriever,
			RunnableMap.from({
				query: (input) => input.query,
				chat_history: (input) => input.chat_history,
				context: (input) => this.processDocs(input.docs),
				date: () => new Date().toISOString(),
			}),
			ChatPromptTemplate.fromMessages([
				["system", this.config.responsePrompt],
				new MessagesPlaceholder("chat_history"),
				new MessagesPlaceholder("query"),
			]),
			llm,
			this.strParser,
			RunnableLambda.from(async (input: string) => {
				if (this.config.activeEngines.includes("title")) {
					const titleParser = new LineOutputParser({
						key: "title",
					});
					const title = await titleParser.parse(input);
					if (title === "not_needed") {
						process.env.NODE_ENV == "development" &&
							console.log("Title not needed, returning empty result.");
						return "not_needed";
					}

					process.env.NODE_ENV == "development" &&
						console.log(
							"🚀 ~ MetaAgent ~ createAnsweringChain ~ title:",
							title
						);
					return title;
				}

				return input;
			}),
		]).withConfig({ runName: "FinalResponseGenerator" });
	}
	private processDocs(docs: Document[]) {
		if (!docs) {
			return "";
		}
		return docs
			.map(
				(_, index) =>
					`${index + 1}. ${docs[index].metadata.title} ${
						docs[index].pageContent
					}`
			)
			.join("\n");
	}
	private async handleStream(
		stream: IterableReadableStream<StreamEvent>,
		emitter: EventEmitter
	) {
		process.env.NODE_ENV == "development" && console.log("Handling stream...");
		try {
			for await (const event of stream) {
				if (
					event.event === "on_chain_end" &&
					event.name === "FinalSourceRetriever"
				) {
					emitter.emit(
						"data",
						JSON.stringify({
							type: "sources",
							data: event.data.output?.docs || [],
						})
					);
				}
				if (event.event == "on_llm_stream" && event.name == "ChatDeepSeek") {
					if (event.data.chunk?.message?.additional_kwargs?.reasoning_content) {
						emitter.emit(
							"data",
							JSON.stringify({
								type: "reasoning",
								data: event.data.chunk?.message.additional_kwargs
									.reasoning_content,
							})
						);
					}
				}
				if (
					event.event === "on_chain_stream" &&
					event.name === "FinalResponseGenerator"
				) {
					emitter.emit(
						"data",
						JSON.stringify({ type: "response", data: event.data.chunk })
					);
				}
				if (
					event.event === "on_chain_end" &&
					event.name === "FinalResponseGenerator"
				) {
					break;
				}
			}
			process.env.NODE_ENV == "development" && console.log("Stream ended.");
			setTimeout(() => {
				emitter.emit("data", JSON.stringify({ type: "end" }));
				process.env.NODE_ENV == "development" &&
					console.log("End stream event emitted.");
			}, 100);
		} catch (error: any) {
			console.trace();
			console.error("Streaming error:", error);
			emitter.emit(
				"data",
				JSON.stringify({ type: "error", data: error.message })
			);
			emitter.emit("data", JSON.stringify({ type: "end" }));
		}
	}

	async searchAndAnswer(
		message: MessageContentText[],
		history: BaseMessage[],
		llm: BaseChatModel,
		embeddings: Embeddings | undefined,

		attachments: RemoteFileAttachment[]
	) {
		process.env.NODE_ENV == "development" &&
			console.log(
				"searchAndAnswer called with: message, history, attachments,"
			);
		const imageAttachmentPromises = attachments.map(async (attachment) => {
			// Each `async` function in the map returns a promise
			const base64Image = await imageUrlToBase64(attachment.url); // Await the conversion

			return {
				type: "image_url" as const, // Use 'as const' for better type inference
				image_url: {
					url: base64Image,
				},
			};
		});
		const resolvedImageAttachments = await Promise.all(imageAttachmentPromises);

		const answeringChain = await this.createAnsweringChain(llm, embeddings);
		const stream = answeringChain.streamEvents(
			{
				chat_history: history,
				query: new HumanMessage({
					content: [...message, ...resolvedImageAttachments],
				}),
			},
			{ version: "v1" }
		);
		this.handleStream(stream, this.emitter);
		return this.emitter;
	}
}
export default MetaAgent;

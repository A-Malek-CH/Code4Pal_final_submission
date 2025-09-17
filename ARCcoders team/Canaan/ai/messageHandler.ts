import MetaAgent from "./search/metaAgent";
import prompts from "./prompts";

export const Handlers = {
	academicSearch: new MetaAgent({
		activeEngines: [],
		queryGeneratorPrompt: prompts.databaseSearchRetrieverPrompt,
		responsePrompt: prompts.databaseSearchResponsePrompt,

		searchDocuments: true,
		summarizer: false,
	}),
	titleGenerator: new MetaAgent({
		activeEngines: ["title"],
		queryGeneratorPrompt: "",
		responsePrompt: prompts.titleGeneratorResponsePrompt,

		searchDocuments: false,
		summarizer: false,
	}),
};

export type THandlersKeys = keyof typeof Handlers;

"use client";
import type React from "react";
import { v4 as uuid } from "uuid";
import { ClientAttachment } from "@/types/attachment";
import {
	createContext,
	useState,
	useRef,
	useContext,
	type FC,
	type ReactNode,
	useCallback,
	useMemo,
} from "react";
import { voiceOptions } from "@/voice-options";
interface AttachmentsContextValue {
	attachments: ClientAttachment[];
	handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	addAttachment: (attachment: ClientAttachment) => void;
	removeAttachment: (attachmentId: string) => void;
	clearAttachments: () => void;
	fileInputRef: React.RefObject<HTMLInputElement>;
}
interface InputContextValue {
	input: string;
	setInput: React.Dispatch<React.SetStateAction<string>>;
	emptyInput: () => void;
}

interface VoiceContextValue {
	speechRate: number;
	setSpeechRate: React.Dispatch<React.SetStateAction<number>>;
	voiceId: string;
	setVoiceId: React.Dispatch<React.SetStateAction<string>>;
}
interface SearchModeContextValue {
	searchMode: string;
	setSearchMode: React.Dispatch<React.SetStateAction<string>>;
}

const VoiceContext = createContext<VoiceContextValue | undefined>(undefined);
const SearchModeContext = createContext<SearchModeContextValue | undefined>(
	undefined
);
const InputContext = createContext<InputContextValue | undefined>(undefined);

const AttachmentsContext = createContext<AttachmentsContextValue | undefined>(
	undefined
);

export const InputProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [input, setInput] = useState("");
	const [searchMode, setSearchMode] = useState("webSearch");
	const [attachments, setAttachments] = useState<ClientAttachment[]>([]);
	const [speechRate, setSpeechRate] = useState(1.0);

	const fileInputRef = useRef<HTMLInputElement>(null);

	const [voiceId, setVoiceId] = useState(voiceOptions.en[0].id);
	const emptyInput = useMemo(() => {
		return () => {
			setInput("");
			setAttachments([]);
			setSearchMode("webSearch");
		};
	}, []);
	const handlePlayMessage = (content: string) => {
		// ... (This section is unchanged) ...
		if ("speechSynthesis" in window) {
			speechSynthesis.cancel();

			const utterance = new SpeechSynthesisUtterance(content);
			utterance.lang = "en-US";
			utterance.rate = speechRate;

			const voices = speechSynthesis.getVoices();
			const selectedVoiceOption = voiceOptions["en"].find(
				(v) => v.id === voiceId
			);

			if (selectedVoiceOption) {
				const matchingVoice = voices.find(
					(voice) =>
						voice.name.includes(
							selectedVoiceOption.voice
								.split(" - ")[0]
								.replace("Microsoft ", "")
						) || voice.lang.startsWith("en")
				);

				if (matchingVoice) {
					utterance.voice = matchingVoice;
				}
			}

			speechSynthesis.speak(utterance);
		}
	};

	const addAttachment = useCallback(
		(attachment: ClientAttachment) => {
			if (!attachment) return;

			setAttachments((prev) => {
				const newItem: ClientAttachment = attachment;

				let newItems = [];
				console.log("prev:", prev);
				if (prev)
					newItems = [
						newItem,
						...prev.filter((item) => item.id !== attachment.id),
					];
				else {
					newItems = [newItem];
				}
				return newItems;
			});
		},
		[attachments]
	);
	const removeAttachment = useCallback((attachmentId: string) => {
		setAttachments((prev) => {
			const newItems = [...prev];
			newItems.splice(
				newItems.findIndex((item) => item.id === attachmentId),
				1
			);
			return newItems;
		});
	}, []);
	const clearAttachments = useCallback(() => {
		setAttachments([]);
	}, []);
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			const newFiles = Array.from(event.target.files);
			newFiles.map((file) => {
				if (file.type.startsWith("image/")) {
					const item: ClientAttachment = {
						id: uuid(),
						file: file,
						previewUrl: URL.createObjectURL(file),
					};
					addAttachment(item);
				}
			});
			event.target.value = "";
		}
	};

	const attachmentsContextValue = useMemo<AttachmentsContextValue>(() => {
		return {
			attachments,
			fileInputRef,
			addAttachment,
			removeAttachment,
			clearAttachments,
			handleFileChange,
		};
	}, [
		attachments,
		addAttachment,
		removeAttachment,
		clearAttachments,
		handleFileChange,
	]);
	const inputContextValue = useMemo<InputContextValue>(() => {
		return {
			input,
			setInput,
			emptyInput,
		};
	}, [input, setInput, emptyInput]);
	const searchModeContextValue = useMemo<SearchModeContextValue>(() => {
		return {
			searchMode,
			setSearchMode,
		};
	}, [searchMode, setSearchMode]);
	const voiceContextValue = useMemo<VoiceContextValue>(() => {
		return {
			voiceId,
			setVoiceId,
			speechRate,
			setSpeechRate,
		};
	}, [voiceId, speechRate, setSpeechRate, setVoiceId]);
	return (
		<InputContext.Provider value={inputContextValue}>
			<AttachmentsContext.Provider value={attachmentsContextValue}>
				<SearchModeContext.Provider value={searchModeContextValue}>
					<VoiceContext.Provider value={voiceContextValue}>
						{children}
					</VoiceContext.Provider>
				</SearchModeContext.Provider>
			</AttachmentsContext.Provider>
		</InputContext.Provider>
	);
};
export const useInput = (): InputContextValue => {
	const context = useContext(InputContext);
	if (context === undefined) {
		throw new Error("useInput must be used within a ChatProvider");
	}
	return context;
};

export const useAttachments = (): AttachmentsContextValue => {
	const context = useContext(AttachmentsContext);
	if (context === undefined) {
		throw new Error("useAttachments must be used within a ChatProvider");
	}
	return context;
};
export const useVoice = (): VoiceContextValue => {
	const context = useContext(VoiceContext);
	if (context === undefined) {
		throw new Error("useVoice must be used within a ChatProvider");
	}
	return context;
};

export const useSearchMode = (): SearchModeContextValue => {
	const context = useContext(SearchModeContext);
	if (context === undefined) {
		throw new Error("useSearchMode must be used within a ChatProvider");
	}
	return context;
};

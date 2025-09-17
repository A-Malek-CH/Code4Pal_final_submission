"use client";

import { cn } from "@/lib/utils";
import type { MessageExtra } from "@/types/Message";
import {
	AlertCircle,
	BookCopy,
	FileIcon,
	Layers3,
	Plus,
	Share,
	UserIcon,
} from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";

// import MessageSources from "./message-sources";
import { Copy } from "@/components/button-tools/copy";
import Rewrite from "@/components/button-tools/rewrite";
import MessageSources from "./message-sources";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { RemoteFileAttachment } from "@/types/attachment";
import { Document } from "langchain/document";
import { MessageContentText } from "@langchain/core/messages";
import { MarkdownMessage } from "../ui/react-markdown";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuth } from "../firebase-auth/AuthContext";
import BotIcon from "../icons/bot-icon";
import { Loader } from "../ui/loader";
import { useSource } from "@/providers/source-provider";
const MessageBox = memo(function MessageBox({
	message,
	messageIndex,
	rewrite,
	type,
}: // sendMessage,
{
	message: MessageExtra;
	messageIndex: number;
	rewrite: (
		messageId: string,
		searchMode: string,
		emptyInput: () => void
	) => void;
	type: "list" | "single";
}) {
	// if (message.role == "user") user message:", message);
	const { user } = useAuth();
	if (!user) return null;
	const MessageContent = message.content as MessageContentText[];
	if (!MessageContent) return null;
	const isLoading = message.isLoading;
	const { handleSourceClick } = useSource();
	const [parsedMessage, setParsedMessage] = useState(MessageContent);
	const contentRef = useRef<HTMLDivElement>(null);

	const messageAttachments = message.attachments as Array<RemoteFileAttachment>;
	const MessageSourcesArray = message.sources as unknown as Array<Document>;

	useEffect(() => {
		const regex = /\[(\d+)\]/g;
		if (
			message.role === "ASSISTANT" &&
			MessageSourcesArray &&
			MessageSourcesArray.length > 0
		) {
			setParsedMessage(
				MessageContent.map((item) => {
					return {
						text: item.text.replace(regex, (_, number) => {
							const source = MessageSourcesArray[number - 1];
							const documentId = source?.metadata?.document_id;

							if (!documentId) return `[${number}]`; // Safety fallback

							// Added "source-link" class for easier targeting
							return `<a 
                                data-document-id="${documentId}" 
                                class="source-link bg-light-secondary dark:bg-dark-secondary px-1 rounded ml-1 no-underline text-xs text-black/70 dark:text-white/70 cursor-pointer"
                            >${number}</a>`;
						}),
						type: item.type,
					};
				})
			);
		} else {
			setParsedMessage(MessageContent);
		}
	}, [JSON.stringify(MessageContent), JSON.stringify(message.sources), message.role]);
	// EFFECT FOR EVENT DELEGATION
	useEffect(() => {
		const handleClick = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			// Find the closest ancestor that is a source link
			const link = target.closest("a.source-link");

			if (link) {
				event.preventDefault(); // Stop any potential default <a> behavior
				const docId = link.getAttribute("data-document-id");
				if (docId) {
					handleSourceClick(docId); // Call the function from the parent
				}
			}
		};

		const container = contentRef.current;
		container?.addEventListener("click", handleClick);

		return () => {
			container?.removeEventListener("click", handleClick);
		};
	}, [handleSourceClick]); // Re-attach if the handler function changes

	return (
		<div
			className={cn("w-full max-w-full break-words overflow-x-hidden ")}
			ref={contentRef}
		>
			{message.role === "USER" && (
				<div className="flex flex-col space-y-2">
					<div className="flex flex-row items-center space-x-2 mx-1">
						<div className="flex flex-col items-center">
							<Avatar>
								<AvatarImage src={user.photo_url || ""} />
								<AvatarFallback>{user.display_name.charAt(0)}</AvatarFallback>
							</Avatar>
							{/* <span className="text-black/60 dark:text-white/60 text-[10px] mt-0.5">
                {message.id}
              </span> */}
						</div>

						<h3 className="text-black dark:text-white font-medium text-xl">
							You:
						</h3>
						<span className="text-black/60 dark:text-white/60 text-[10px] mt-0.5">
							{message.index}
						</span>
					</div>
					<div className=" flex ">
						{(messageAttachments as Array<any>) &&
							messageAttachments.length > 0 && (
								<ScrollArea
									className={cn(
										"px-3",
										messageAttachments.length > 0 && "py-2"
									)}
								>
									<ScrollBar orientation="horizontal" />
									<div
										className={cn(
											"flex space-x-3",
											messageAttachments.length > 0 && "py-2"
										)}
									>
										{messageAttachments.length > 0 &&
											messageAttachments.map((item) => (
												<div
													key={item.id}
													className={cn(
														"relative group w-20 h-fit flex-shrink-0 p-2 rounded-lg border",
														"flex flex-col items-center justify-between",
														"bg-card border-border text-card-foreground"
													)}
												>
													<div className="w-10 h-10 flex items-center justify-center mb-1 overflow-hidden rounded-md ">
														{item.url ? (
															<img
																src={item.url}
																alt={item.filename}
																className="w-full h-full object-cover cursor-pointer transition-transform duration-200 group-hover:scale-105"
															/>
														) : (
															<FileIcon className="w-10 h-10 text-muted-foreground" />
														)}
													</div>
												</div>
											))}
									</div>
								</ScrollArea>
							)}
					</div>
					{(parsedMessage as Array<MessageContentText>) &&
						parsedMessage.map((msgPart: MessageContentText, idx) => (
							<div
								key={idx}
								className={cn("w-full", messageIndex === 0 ? "pt-0" : "py-2")}
							>
								<p className="break-words text-wrap">{msgPart.text}</p>
							</div>
						))}
				</div>
			)}

			{message.role === "ASSISTANT" && (
				<div className="flex flex-col space-y-9 lg:space-y-0 lg:flex-row lg:justify-between w-full lg:space-x-9 overflow-y-hidden ">
					<div className="flex flex-col space-y-6 w-full">
						{message.action && (
							<div className="flex flex-col space-y-2">
								<div className="flex flex-row items-center space-x-2">
									<AlertCircle
										className="text-black dark:text-white"
										size={20}
									/>
									<p className="text-black dark:text-white font-medium text-md">
										{message.action}
									</p>
								</div>
							</div>
						)}
						{MessageSourcesArray && MessageSourcesArray.length > 0 && (
							<div className="flex flex-col space-y-2">
								<div className="flex flex-row items-center space-x-2">
									<BookCopy className="text-black dark:text-white" size={20} />
									<h3 className="text-black dark:text-white font-medium text-xl">
										Sources
									</h3>
								</div>
								<MessageSources sources={MessageSourcesArray} />
							</div>
						)}

						<div className="flex flex-col space-y-2 w-full ">
							<div className="flex flex-row items-center space-x-2 px-2 ">
								{isLoading ? (
									<div className="flex flex-col items-center">
										<div className="w-10 h-10 aspect-square flex items-center justify-center">
											<Loader size="md"></Loader>
										</div>
										{/* <span className="text-black/60 dark:text-white/60 text-[10px] mt-0.5">
                      {message.id}
                    </span> */}
									</div>
								) : (
									<div className="flex flex-col items-center">
										<div className="w-10 h-10 aspect-square flex items-center justify-center">
											<BotIcon />
										</div>
									</div>
								)}
								<h3 className="text-black dark:text-white font-medium text-xl">
									Answer:
								</h3>
								<span className="text-black/60 dark:text-white/60 text-[10px] mt-0.5">
									{message.index}
								</span>
							</div>

							<MarkdownMessage
								content={parsedMessage[0].text}
							></MarkdownMessage>

							{
								<div className="flex flex-row items-center justify-between w-full text-black dark:text-white py-4 -mx-2">
									<div className="flex flex-row items-center space-x-1">
										<button
											className="p-2 text-black/70 dark:text-white/70 rounded-xl hover:bg-light-secondary dark:hover:bg-dark-secondary transition duration-200 hover:text-black text-black dark:hover:text-white"
											disabled={isLoading}
										>
											<Share size={18} />
										</button>
										<Rewrite disabled={isLoading} messageId={message.id} />
									</div>
									<div className="flex flex-row items-center space-x-1">
										<Copy
											initialMessage={MessageContent.map((part) => {
												return part.text;
											}).join("\n")}
											message={message}
											disabled={isLoading}
										/>
									</div>
								</div>
							}
							{/* {message.suggestions &&
								message.suggestions.length > 0 &&
								message.role === "ASSISTANT" &&
								!isLoading && (
									<>
										<div
											
											className="h-px w-full bg-light-secondary dark:bg-dark-secondary"
										/>
										<div
											
											className="flex flex-col space-y-3 text-black dark:text-white"
										>
											<div
												
												className="flex flex-row items-center space-x-2 mt-4"
											>
												<Layers3 />
												<h3 className="text-xl font-medium">Related</h3>
											</div>
											<div
												
												className="flex flex-col space-y-3"
											></div>
										</div>
									</>
								)} */}
						</div>
					</div>
				</div>
			)}
		</div>
	);
});

export default MessageBox;

// file: components/history-assistant.tsx
"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";

// --- CHANGE [1]: IMPORT the tools we need for API calls ---
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
	Send,
	Mic,
	Search,
	Plus,
	BookOpen,
	Settings,
	Moon,
	Sun,
	Languages,
	Menu,
	X,
	Copy,
	Edit3,
	Trash2,
	Share,
	ThumbsUp,
	ThumbsDown,
	MoreHorizontal,
	Check,
	Volume2,
	Upload,
	MicOff,
	ChevronDown,
	ChevronRight,
	MessageSquare,
	Clock,
	Gauge,
	Sparkles,
	History,
	FileText,
} from "lucide-react";
// import type { SpeechRecognition } from "web-speech-api";
import { useChat } from "@/providers/chat-provider";
import { useAuth } from "./firebase-auth/AuthContext";
import { ChatInput } from "./agent/input";
import MessageList from "./agent/message-list";

interface ChatSession {
	id: string;
	title: string;
	lastMessage: string;
	timestamp: Date;
}

// --- CHANGE [2]: DEFINE the shape of our API response and the function to call it ---
type ApiResponse = {
	reply: string;
};

const sendMessageToApi = async (messageText: string): Promise<ApiResponse> => {
	const response = await fetch("/api/agent", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ message: messageText }),
	});

	if (!response.ok) {
		throw new Error("Network response was not ok");
	}

	return response.json();
};

export function HistoryAssistant() {
	const { user } = useAuth();
	if (!user) {
		return <div>Please log in to use the History Assistant.</div>;
	}

	const { messages, setConversation, setMessages } = useChat();

	// const [inputValue, setInputValue] = useState("")
	const [isRecording, setIsRecording] = useState(false);
	const [isListening, setIsListening] = useState(false);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	// const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
	// const [editingContent, setEditingContent] = useState("");
	const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
	// const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
	const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
		null
	);

	// const [recognition, setRecognition] = useState<SpeechRecognition | null>(
	// 	null
	// );
	const [recentChatsExpanded, setRecentChatsExpanded] = useState(true);
	const [libraryExpanded, setLibraryExpanded] = useState(false);
	const [settingsExpanded, setSettingsExpanded] = useState(false);
	const [chatSessions] = useState<ChatSession[]>([
		{
			id: "1",
			title: "الحضارة المصرية القديمة",
			lastMessage: "أخبرني عن الأهرامات",
			timestamp: new Date(Date.now() - 86400000),
		},
		{
			id: "2",
			title: "الحرب العالمية الثانية",
			lastMessage: "متى انتهت الحرب؟",
			timestamp: new Date(Date.now() - 172800000),
		},
		{
			id: "3",
			title: "الخلافة العباسية",
			lastMessage: "من هو هارون الرشيد؟",
			timestamp: new Date(Date.now() - 259200000),
		},
	]);

	const messagesEndRef = useRef<HTMLDivElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const audioChunksRef = useRef<Blob[]>([]);

	const isFirstTime = messages.length === 0;
	console.log("🚀 ~ HistoryAssistant ~ isFirstTime:", isFirstTime);

	// Initialize speech recognition
	// useEffect(() => {
	// 	// ... (This section is unchanged) ...
	// 	if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
	// 		const SpeechRecognition =
	// 			window.webkitSpeechRecognition || window.SpeechRecognition;
	// 		const recognitionInstance = new SpeechRecognition();
	// 		recognitionInstance.continuous = false;
	// 		recognitionInstance.interimResults = false;
	// 		recognitionInstance.lang = language === "ar" ? "ar-SA" : "en-US";

	// 		recognitionInstance.onresult = (event) => {
	// 			const transcript = event.results[0][0].transcript;
	// 			// setInputValue(transcript);
	// 			setIsListening(false);
	// 		};

	// 		recognitionInstance.onerror = () => {
	// 			setIsListening(false);
	// 		};

	// 		recognitionInstance.onend = () => {
	// 			setIsListening(false);
	// 		};

	// 		setRecognition(recognitionInstance);
	// 	}
	// }, [language]);

	useEffect(() => {
		// ... (This section is unchanged) ...
		const savedTheme = localStorage.getItem("history-assistant-theme") as
			| "light"
			| "dark"
			| "system"
			| null;
		if (savedTheme) {
			setTheme(savedTheme);
			applyTheme(savedTheme);
		} else {
			applyTheme("system");
		}
	}, []);

	const applyTheme = (newTheme: "light" | "dark" | "system") => {
		// ... (This section is unchanged) ...
		const root = document.documentElement;

		if (newTheme === "system") {
			const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
				.matches
				? "dark"
				: "light";
			root.classList.toggle("dark", systemTheme === "dark");
		} else {
			root.classList.toggle("dark", newTheme === "dark");
		}
	};

	// useEffect(() => {
	// 	// ... (This section is unchanged) ...
	// 	const savedLanguage = localStorage.getItem("history-assistant-language");
	// 	if (savedLanguage && ["ar", "en"].includes(savedLanguage)) {
	// 		setLanguage(savedLanguage as "ar" | "en");
	// 	}
	// }, []);

	// useEffect(() => {
	// 	// ... (This section is unchanged) ...
	// 	setSelectedVoice(voiceOptions[language][0].id);
	// }, [language]);

	// const handleStartChat = () => {
	// 	// ... (This section is unchanged) ...
	// 	const welcomeMessage: MessageExtra = {
	// 		id: Date.now().toString(),
	// 		content:
	// 			language === "ar"
	// 				? "مرحباً! أنا مساعد التاريخ الذكي. يمكنني مساعدتك في استكشاف التاريخ والحضارات القديمة والأحداث التاريخية المهمة. ما الذي تود معرفته؟"
	// 				: "Hello! I'm your intelligent History Assistant. I can help you explore history, ancient civilizations, and important historical events. What would you like to know?",
	// 		isUser: false,
	// 		timestamp: new Date(),
	// 	};
	// 	setMessages([welcomeMessage]);
	// };

	// const handleNewChat = () => {
	// 	// ... (This section is unchanged) ...
	// 	setMessages([]);
	// 	setInputValue("");
	// 	setSidebarOpen(false);
	// };

	// --- CHANGE [4]: MODIFY the handleSendMessage function to use our new API logic ---
	// const handleSendMessage = () => {
	// 	if (!inputValue.trim()) return;

	// 	// 1. Create the user's message and add it to the UI immediately
	// 	const newMessage: MessageExtra = {
	// 		id: Date.now().toString(),
	// 		content: inputValue,
	// 		isUser: true,
	// 		timestamp: new Date(),
	// 	};
	// 	setMessages((prev) => [...prev, newMessage]);

	// 	// 2. Call the API using the mutation hook
	// 	mutation.mutate(inputValue);

	// 	// 3. Clear the input field
	// 	setInputValue("");
	// };

	// const handleVoiceRecord = async () => {
	// 	// ... (This section is unchanged for now) ...
	// 	if (!isRecording) {
	// 		try {
	// 			const stream = await navigator.mediaDevices.getUserMedia({
	// 				audio: true,
	// 			});
	// 			const recorder = new MediaRecorder(stream);

	// 			audioChunksRef.current = [];

	// 			recorder.ondataavailable = (event) => {
	// 				if (event.data.size > 0) {
	// 					audioChunksRef.current.push(event.data);
	// 				}
	// 			};

	// 			recorder.onstop = () => {
	// 				const audioBlob = new Blob(audioChunksRef.current, {
	// 					type: "audio/wav",
	// 				});

	// 				const audioMessage: MessageExtra = {
	// 					id: Date.now().toString(),
	// 					content: language === "ar" ? "رسالة صوتية" : "Voice message",
	// 					isUser: true,
	// 					timestamp: new Date(),
	// 					type: "audio",
	// 					audioBlob: audioBlob,
	// 				};

	// 				setMessages((prev) => [...prev, audioMessage]);
	// 				stream.getTracks().forEach((track) => track.stop());

	// 				setTimeout(() => {
	// 					const aiResponse: MessageExtra = {
	// 						id: (Date.now() + 1).toString(),
	// 						content:
	// 							language === "ar"
	// 								? "شكراً لرسالتك الصوتية! سأقوم بالرد عليها..."
	// 								: "Thank you for your voice message! I'll respond to it...",
	// 						isUser: false,
	// 						timestamp: new Date(),
	// 					};
	// 					setMessages((prev) => [...prev, aiResponse]);
	// 				}, 1500);
	// 			};

	// 			recorder.start();
	// 			setMediaRecorder(recorder);
	// 			setIsRecording(true);
	// 		} catch (error) {
	// 			console.error("Error accessing microphone:", error);
	// 		}
	// 	} else {
	// 		if (mediaRecorder) {
	// 			mediaRecorder.stop();
	// 			setMediaRecorder(null);
	// 		}
	// 		setIsRecording(false);
	// 	}
	// };

	// const handleSpeechToText = () => {
	// 	// ... (This section is unchanged for now) ...
	// 	if (recognition && !isListening) {
	// 		recognition.lang = language === "ar" ? "ar-SA" : "en-US";
	// 		recognition.start();
	// 		setIsListening(true);
	// 	} else if (recognition && isListening) {
	// 		recognition.stop();
	// 		setIsListening(false);
	// 	}
	// };

	// const handleFileUpload = () => {
	// 	// ... (This section is unchanged for now) ...
	// 	fileInputRef.current?.click();
	// };

	// const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
	// 	// ... (This section is unchanged for now) ...
	// 	const file = event.target.files?.[0];
	// 	if (file) {
	// 		const fileMessage: MessageExtra = {
	// 			id: Date.now().toString(),
	// 			content: `${language === "ar" ? "تم رفع ملف:" : "File uploaded:"} ${
	// 				file.name
	// 			}`,
	// 			isUser: true,
	// 			timestamp: new Date(),
	// 			type: file.type.startsWith("image/") ? "image" : "text",
	// 		};

	// 		setMessages((prev) => [...prev, fileMessage]);
	// 		event.target.value = "";
	// 	}
	// };

	// const handleEditMessage = (messageId: string, content: string) => {
	// 	// ... (This section is unchanged) ...
	// 	setEditingMessageId(messageId);
	// 	setEditingContent(content);
	// };

	// const handleSaveEdit = () => {
	// 	// ... (This section is unchanged) ...
	// 	if (editingMessageId && editingContent.trim()) {
	// 		setMessages((prev) =>
	// 			prev.map((msg) =>
	// 				msg.id === editingMessageId
	// 					? { ...msg, content: editingContent }
	// 					: msg
	// 			)
	// 		);
	// 		setEditingMessageId(null);
	// 		setEditingContent("");
	// 	}
	// };

	// const handleCancelEdit = () => {
	// 	// ... (This section is unchanged) ...
	// 	setEditingMessageId(null);
	// 	setEditingContent("");
	// };

	// const handleDeleteMessage = (messageId: string) => {
	// 	// ... (This section is unchanged) ...
	// 	setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
	// };

	// const handleShareMessage = (content: string) => {
	// 	// ... (This section is unchanged) ...
	// 	if (navigator.share) {
	// 		navigator.share({
	// 			title:
	// 				language === "ar"
	// 					? "رسالة من مساعد التاريخ"
	// 					: "MessageExtra from History Assistant",
	// 			text: content,
	// 		});
	// 	} else {
	// 		handleCopyMessage(content);
	// 	}
	// };

	// const handleLikeMessage = (messageId: string) => {
	// 	// ... (This section is unchanged) ...
	// 	setMessages((prev) =>
	// 		prev.map((msg) =>
	// 			msg.id === messageId
	// 				? { ...msg, liked: !msg.liked, disliked: false }
	// 				: msg
	// 		)
	// 	);
	// };

	// const handleDislikeMessage = (messageId: string) => {
	// 	// ... (This section is unchanged) ...
	// 	setMessages((prev) =>
	// 		prev.map((msg) =>
	// 			msg.id === messageId
	// 				? { ...msg, disliked: !msg.disliked, liked: false }
	// 				: msg
	// 		)
	// 	);
	// };

	// The rest of the file (all the JSX) is completely unchanged.
	// We just need to add the 'disabled' prop to the input and send button.
	const sidebarContent = (
		// ... (This section is unchanged) ...
		<div className="h-full flex flex-col bg-background/95 backdrop-blur-sm">
			{/* Search Bar */}
			<div className="p-4">
				<div className="relative">
					<Search
						className={`absolute top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4`}
					/>
					<Input
						placeholder="Search conversations..."
						className="bg-background/50 border-border/50 backdrop-blur-sm"
					/>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="px-4 space-y-2">
				<Button
					variant="outline"
					className="w-full justify-start gap-2 shadow-lg"
					onClick={() => {}}
				>
					<Plus className="h-4 w-4" />
					New Chat
				</Button>
			</div>

			<Separator className="my-4 bg-border/50" />

			{/* Expandable Menu Items */}
			<div className="flex-1 px-4 space-y-2 custom-scrollbar overflow-y-auto">
				{/* Recent Chats */}
				<div>
					<Button
						variant="ghost"
						className="w-full justify-between hover:bg-accent/50 transition-all duration-200"
						onClick={() => setRecentChatsExpanded(!recentChatsExpanded)}
					>
						<div className="flex items-center gap-2">
							<MessageSquare className="h-4 w-4 " />
							Recent Chats
						</div>
						{recentChatsExpanded ? (
							<ChevronDown className="h-4 w-4 transition-transform duration-200" />
						) : (
							<ChevronRight className="h-4 w-4 transition-transform duration-200" />
						)}
					</Button>

					{recentChatsExpanded && (
						<div className="mt-2 space-y-2 pl-6 animate-in slide-in-from-top-2 duration-200">
							{chatSessions.map((session) => (
								<Card
									key={session.id}
									className="p-3 cursor-pointer hover:bg-accent/30 transition-all duration-200 bg-background/30 border-border/30 backdrop-blur-sm hover:shadow-md"
								>
									<div className="space-y-1">
										<p className="text-sm font-medium line-clamp-1 text-foreground">
											{session.title}
										</p>
										<p className="text-xs text-muted-foreground line-clamp-1">
											{session.lastMessage}
										</p>
										<div className="flex items-center gap-1 text-xs text-muted-foreground">
											<Clock className="h-3 w-3" />
											{session.timestamp.toLocaleDateString("en-US")}
										</div>
									</div>
								</Card>
							))}
						</div>
					)}
				</div>

				{/* Library */}
				<div>
					<Button
						variant="ghost"
						className="w-full justify-between hover:bg-accent/50 transition-all duration-200"
						onClick={() => setLibraryExpanded(!libraryExpanded)}
					>
						<div className="flex items-center gap-2">
							<BookOpen className="h-4 w-4 " />
							Library
						</div>
						{libraryExpanded ? (
							<ChevronDown className="h-4 w-4 transition-transform duration-200" />
						) : (
							<ChevronRight className="h-4 w-4 transition-transform duration-200" />
						)}
					</Button>

					{libraryExpanded && (
						<div className="mt-2 space-y-1 pl-6 animate-in slide-in-from-top-2 duration-200">
							{/* <Button
								variant="ghost"
								size="sm"
								className="w-full justify-start text-xs hover:bg-accent/30"
							>
								<FileText className="h-3 w-3 mr-2" />
								{language === "ar" ? "الكتب المحفوظة" : "Saved Books"}
							</Button> */}
							{/* <Button
								variant="ghost"
								size="sm"
								className="w-full justify-start text-xs hover:bg-accent/30"
							>
								<History className="h-3 w-3 mr-2" />
								{language === "ar" ? "المقالات المفضلة" : "Favorite Articles"}
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className="w-full justify-start text-xs hover:bg-accent/30"
							>
								<Sparkles className="h-3 w-3 mr-2" />
								{language === "ar" ? "الملاحظات" : "Notes"}
							</Button> */}
						</div>
					)}
				</div>

				{/* Settings */}
				<div>
					<Button
						variant="ghost"
						className="w-full justify-between hover:bg-accent/50 transition-all duration-200"
						onClick={() => setSettingsExpanded(!settingsExpanded)}
					>
						<div className="flex items-center gap-2">
							<Settings className="h-4 w-4 " />
							Settings
						</div>
						{settingsExpanded ? (
							<ChevronDown className="h-4 w-4 transition-transform duration-200" />
						) : (
							<ChevronRight className="h-4 w-4 transition-transform duration-200" />
						)}
					</Button>

					{settingsExpanded && (
						<div className="mt-2 space-y-1 pl-6 animate-in slide-in-from-top-2 duration-200">
							<Button
								variant="ghost"
								size="sm"
								className="w-full justify-start text-xs hover:bg-accent/30"
							>
								<Volume2 className="h-3 w-3 mr-2" />
								Voice Preferences
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className="w-full justify-start text-xs hover:bg-accent/30"
							>
								<Settings className="h-3 w-3 mr-2" />
								Privacy Settings
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);

	if (isFirstTime) {
		return (
			// ... (This section is unchanged) ...
			<div className="h-screen flex">
				{/* Mobile Sidebar Overlay */}
				{sidebarOpen && (
					<div className="fixed inset-0 z-50 lg:hidden">
						<div
							className="absolute inset-0 bg-black/50"
							onClick={() => setSidebarOpen(false)}
						/>
						<div
							className={`absolute top-0 left-0  h-full w-80 bg-background/95 backdrop-blur-md border-l border-border/50`}
						>
							<div className="flex items-center justify-between p-4 border-b border-border/50">
								<h2 className="font-semibold">Conversations</h2>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setSidebarOpen(false)}
								>
									<X className="h-4 w-4" />
								</Button>
							</div>
							{sidebarContent}
						</div>
					</div>
				)}

				{/* Desktop Sidebar */}
				<div className="hidden lg:block w-80 border-r border-border/50 bg-background/80 backdrop-blur-md">
					{sidebarContent}
				</div>

				{/* Main Content */}
				<div className="flex-1 flex flex-col">
					{/* Top Bar */}
					<div className="flex items-center justify-between p-4 border-b border-border/50 bg-background/80 backdrop-blur-md">
						<div className="flex items-center gap-3">
							<Button
								variant="ghost"
								size="sm"
								className="lg:hidden"
								onClick={() => setSidebarOpen(true)}
							>
								<Menu className="h-4 w-4" />
							</Button>
							<div className="flex items-center gap-2">
								<h1 className="text-xl font-serif font-semibold bg-clip-text text-transparent">
									History Assistant
								</h1>
							</div>
						</div>

						{/* Welcome Screen */}
						<div className="flex-1 flex items-center justify-center p-8 ">
							<div className="max-w-2xl mx-auto text-center space-y-8">
								{/* Historical Illustration */}
								<div className="relative">
									<div className="w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-2xl border-4 border-border ">
										<BookOpen className="h-16 w-16 " />
									</div>
									<div className="absolute -top-2 -right-2 w-8 h-8  rounded-full flex items-center justify-center">
										<Sparkles className="h-4 w-4 " />
									</div>
								</div>

								{/* Welcome Title */}
								<div className="space-y-4">
									<h1 className="text-4xl md:text-5xl font-serif font-bold  text-primary">
										Welcome to History Assistant
									</h1>
									<p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
										Discover the wonders of Palastenian history with me! I can
										help you explore important historical events, and the
										personalities who changed the course of this place history.
									</p>
								</div>

								{/* Capabilities */}

								{/* Start Chat Button */}
								<div className="pt-8">
									<ChatInput disableWrapper />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div
			// ... (This section is unchanged) ...
			className="h-screen flex"
		>
			{/* Mobile Sidebar Overlay */}
			{sidebarOpen && (
				<div className="fixed inset-0 z-50 lg:hidden">
					<div
						className="absolute inset-0 bg-background"
						onClick={() => setSidebarOpen(false)}
					/>
					<div
						className={`absolute top-0 left-0 h-full w-80 bg-background/95 backdrop-blur-md border-l border-border/50`}
					>
						<div className="flex items-center justify-between p-4 border-b border-border/50">
							<h2 className="font-semibold">Conversations</h2>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setSidebarOpen(false)}
							>
								<X className="h-4 w-4" />
							</Button>
						</div>
						{sidebarContent}
					</div>
				</div>
			)}

			{/* Desktop Sidebar */}
			<div className="hidden lg:block w-80 border-r border-border/50 bg-background/80 backdrop-blur-md">
				{sidebarContent}
			</div>

			{/* Main Content */}
			<div className="flex-1 flex flex-col">
				{/* Top Bar */}
				<div className="flex items-center justify-between p-4 border-b border-border/50 bg-background/80 backdrop-blur-md">
					{/* ... (This section is unchanged) ... */}
					<div className="flex items-center gap-3">
						<Button
							variant="ghost"
							size="sm"
							className="lg:hidden"
							onClick={() => setSidebarOpen(true)}
						>
							<Menu className="h-4 w-4" />
						</Button>
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg backdrop-blur-lg border border-border">
								<BookOpen className="h-4 w-4 " />
							</div>
							<h1 className="text-xl font-serif font-semibold bg-clip-text text-transparent">
								History Assistant
							</h1>
						</div>
					</div>
				</div>{" "}
				{/* Ensures this container takes up remaining space and is a positioning context */}
				{/* <MessageList /> */}
			</div>
		</div>
	);
}

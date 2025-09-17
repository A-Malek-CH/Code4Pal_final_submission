"use client";

import type React from "react";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import { Highlight } from "@tiptap/extension-highlight";
import { Link } from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Bold,
	Italic,
	Strikethrough,
	List,
	ListOrdered,
	Quote,
	Undo,
	Redo,
	ImageIcon,
	LinkIcon,
	Palette,
	TableIcon,
	Sparkles,
	ChevronDown,
	Trash2,
	Plus,
	Minus,
	Clipboard,
} from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";

interface RichTextEditorProps {
	content: string;
	onChange: (content: string) => void;
	onAiEnhance?: () => void;
	isAiLoading?: boolean;
	placeholder?: string;
}

export function RichTextEditor({
	content,
	onChange,
	onAiEnhance,
	isAiLoading = false,
	placeholder = "Start writing your note...",
}: RichTextEditorProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			StarterKit.configure({
				bulletList: {
					keepMarks: true,
					keepAttributes: false,
					HTMLAttributes: {
						class: "tiptap-bullet-list",
					},
				},
				orderedList: {
					keepMarks: true,
					keepAttributes: false,
					HTMLAttributes: {
						class: "tiptap-ordered-list",
					},
				},
				listItem: {
					HTMLAttributes: {
						class: "tiptap-list-item",
					},
				},
			}),
			Image.configure({
				HTMLAttributes: {
					class:
						"max-w-full h-auto rounded-xl my-6 shadow-lg border border-border/20",
				},
			}),
			Placeholder.configure({
				placeholder,
			}),
			TextStyle,
			Highlight.configure({
				multicolor: true,
			}),
			Link.configure({
				openOnClick: false,
				HTMLAttributes: {
					class:
						"text-primary underline decoration-2 underline-offset-2 cursor-pointer hover:text-primary/80 transition-colors",
				},
			}),
			Table.configure({
				resizable: true,
				HTMLAttributes: {
					class: "tiptap-table",
				},
			}),
			TableRow.configure({
				HTMLAttributes: {
					class: "tiptap-table-row",
				},
			}),
			TableHeader.configure({
				HTMLAttributes: {
					class: "tiptap-table-header",
				},
			}),
			TableCell.configure({
				HTMLAttributes: {
					class: "tiptap-table-cell",
				},
			}),
		],
		content,
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
		editorProps: {
			attributes: {
				class:
					"prose prose-lg max-w-none focus:outline-none min-h-[500px] p-8 text-foreground leading-relaxed [&>*]:text-foreground [&_p]:text-foreground [&_p]:mb-4 [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-6 [&_h1]:mt-8 [&_h1]:text-foreground [&_h1]:border-b [&_h1]:border-border/30 [&_h1]:pb-2 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mb-4 [&_h2]:mt-6 [&_h2]:text-foreground [&_h3]:text-xl [&_h3]:font-medium [&_h3]:mb-3 [&_h3]:mt-5 [&_h3]:text-foreground [&_blockquote]:text-muted-foreground [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-6 [&_blockquote]:py-2 [&_blockquote]:italic [&_blockquote]:bg-muted/20 [&_blockquote]:rounded-r-lg [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-border [&_pre]:overflow-x-auto [&_code]:bg-muted [&_code]:px-2 [&_code]:py-1 [&_code]:rounded-md [&_code]:text-sm [&_code]:font-mono",
			},
		},
	});
	// --- ADD THIS EFFECT TO SOLVE THE PROBLEM ---
	useEffect(() => {
		// If the editor or content is not ready, do nothing.
		if (!editor) {
			return;
		}

		// Get the current content of the editor.
		const editorContent = editor.getHTML();

		// Compare the prop content with the editor's content.
		// If they are the same, we don't need to do anything.
		// This check is CRUCIAL to prevent an infinite loop.
		const isSame = editorContent === content;

		if (isSame) {
			return;
		}

		// If the content is different, update the editor.
		// The second argument `false` prevents the `onUpdate` callback from firing,
		// which also helps prevent an infinite loop.
		editor.commands.setContent(content);
	}, [content, editor]); // Rerun this effect whenever the content prop or the editor instance changes
	const addImage = useCallback(() => {
		fileInputRef.current?.click();
	}, []);

	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file && editor) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const url = e.target?.result as string;
				editor.chain().focus().setImage({ src: url }).run();
			};
			reader.readAsDataURL(file);
		}
	};

	const addLink = useCallback(() => {
		const previousUrl = editor?.getAttributes("link").href;
		const url = window.prompt("URL", previousUrl);

		if (url === null) {
			return;
		}

		if (url === "") {
			editor?.chain().focus().extendMarkRange("link").unsetLink().run();
			return;
		}

		editor
			?.chain()
			.focus()
			.extendMarkRange("link")
			.setLink({ href: url })
			.run();
	}, [editor]);

	if (!editor) {
		return null;
	}

	const getActiveHeading = () => {
		if (editor.isActive("heading", { level: 1 })) return "Heading 1";
		if (editor.isActive("heading", { level: 2 })) return "Heading 2";
		if (editor.isActive("heading", { level: 3 })) return "Heading 3";
		return "Normal Text";
	};

	const formatButtons = [
		{
			icon: Bold,
			action: () => editor.chain().focus().toggleBold().run(),
			isActive: editor.isActive("bold"),
			label: "Bold",
			shortcut: "⌘B",
		},
		{
			icon: Italic,
			action: () => editor.chain().focus().toggleItalic().run(),
			isActive: editor.isActive("italic"),
			label: "Italic",
			shortcut: "⌘I",
		},
		{
			icon: Strikethrough,
			action: () => editor.chain().focus().toggleStrike().run(),
			isActive: editor.isActive("strike"),
			label: "Strikethrough",
			shortcut: "⌘⇧X",
		},
	];

	const listButtons = [
		{
			icon: List,
			action: () => editor.chain().focus().toggleBulletList().run(),
			isActive: editor.isActive("bulletList"),
			label: "Bullet List",
		},
		{
			icon: ListOrdered,
			action: () => editor.chain().focus().toggleOrderedList().run(),
			isActive: editor.isActive("orderedList"),
			label: "Numbered List",
		},
		{
			icon: Quote,
			action: () => editor.chain().focus().toggleBlockquote().run(),
			isActive: editor.isActive("blockquote"),
			label: "Quote",
		},
	];

	return (
		<div className="flex flex-col h-full bg-background border-border border-2">
			{/* Custom Styles for Lists and Tables */}
			<style>{`
        .tiptap-bullet-list {
          list-style-type: disc !important;
          padding-left: 1.5rem !important;
          margin: 1rem 0 !important;
        }

        .tiptap-ordered-list {
          list-style-type: decimal !important;
          padding-left: 1.5rem !important;
          margin: 1rem 0 !important;
        }

        .tiptap-list-item {
          display: list-item !important;
          margin: 0.25rem 0 !important;
          padding-left: 0.25rem !important;
        }

        .tiptap-bullet-list .tiptap-list-item::marker {
          color: hsl(var(--foreground)) !important;
        }

        .tiptap-ordered-list .tiptap-list-item::marker {
          color: hsl(var(--foreground)) !important;
          font-weight: 600 !important;
        }

        .tiptap-table {
          border-collapse: collapse !important;
          margin: 1.5rem 0 !important;
          width: 100% !important;
          border: 1px solid hsl(var(--border)) !important;
          border-radius: 0.5rem !important;
          overflow: hidden !important;
        }

        .tiptap-table-cell,
        .tiptap-table-header {
          border: 1px solid hsl(var(--border)) !important;
          padding: 0.75rem !important;
          text-align: left !important;
          vertical-align: top !important;
          min-width: 100px !important;
          position: relative !important;
        }

        .tiptap-table-header {
          background-color: hsl(var(--muted)) !important;
          font-weight: 600 !important;
        }

        .tiptap-table-cell:hover,
        .tiptap-table-header:hover {
          background-color: hsl(var(--muted) / 0.5) !important;
        }
      `}</style>

			{/* Toolbar */}
			<div className="border-b border-border bg-card">
				<div className="flex items-center justify-between p-4 flex-wrap">
					{/* Left Side - AI Tools */}
					<div className="flex items-center gap-3">
						<Button
							type="button"
							onClick={async () => {
								try {
									const text = await navigator.clipboard.readText();
									// Use insertContent to paste the text at the current cursor position
									editor.chain().focus().insertContent(text).run();
								} catch (err) {
									console.error("Failed to read clipboard contents: ", err);
									// Optional: Display a user-friendly error message
									alert(
										"Could not paste from clipboard. Please allow clipboard access in your browser settings."
									);
								}
							}}
							disabled={isAiLoading}
							className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
							variant="outline"
						>
							<Clipboard className="h-4 w-4 mr-2 relative z-10" />
							<span className="relative z-10">Paste Tiptap Text</span>
						</Button>
						<Button
							type="button"
							onClick={onAiEnhance}
							disabled={isAiLoading}
							className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
						>
							<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
							<Sparkles className="h-4 w-4 mr-2 relative z-10" />
							<span className="relative z-10">
								{isAiLoading ? "Enhancing..." : "Enhance"}
							</span>
						</Button>
					</div>

					{/* Right Side - History */}
					<div className="flex items-center gap-1">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => editor.chain().focus().undo().run()}
							disabled={!editor.can().chain().focus().undo().run()}
							className="hover:bg-muted/50 transition-colors"
						>
							<Undo className="h-4 w-4" />
						</Button>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => editor.chain().focus().redo().run()}
							disabled={!editor.can().chain().focus().redo().run()}
							className="hover:bg-muted/50 transition-colors"
						>
							<Redo className="h-4 w-4" />
						</Button>
					</div>
				</div>

				{/* Main Toolbar */}
				<div className="flex items-center gap-4 px-4 pb-4 flex-wrap">
					{/* Text Style Dropdown */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								type="button"
								variant="outline"
								className="min-w-[140px] justify-between font-medium bg-transparent"
							>
								{getActiveHeading()}
								<ChevronDown className="h-4 w-4 ml-2" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-48">
							<DropdownMenuItem
								onClick={() => editor.chain().focus().setParagraph().run()}
								className={cn(
									"cursor-pointer",
									editor.isActive("paragraph") && "bg-accent"
								)}
							>
								<span className="text-base">Normal Text</span>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() =>
									editor.chain().focus().toggleHeading({ level: 1 }).run()
								}
								className={cn(
									"cursor-pointer",
									editor.isActive("heading", { level: 1 }) && "bg-accent"
								)}
							>
								<span className="text-2xl font-bold">Heading 1</span>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() =>
									editor.chain().focus().toggleHeading({ level: 2 }).run()
								}
								className={cn(
									"cursor-pointer",
									editor.isActive("heading", { level: 2 }) && "bg-accent"
								)}
							>
								<span className="text-xl font-semibold">Heading 2</span>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() =>
									editor.chain().focus().toggleHeading({ level: 3 }).run()
								}
								className={cn(
									"cursor-pointer",
									editor.isActive("heading", { level: 3 }) && "bg-accent"
								)}
							>
								<span className="text-lg font-medium">Heading 3</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<Separator orientation="vertical" className="h-6" />

					{/* Format Buttons */}
					<div className="flex items-center ">
						{formatButtons.map((button, index) => (
							<Button
								type="button"
								key={index}
								variant="ghost"
								size="sm"
								onClick={button.action}
								className={cn(
									"relative h-9 w-9 p-0 hover:bg-accent transition-all duration-200",
									button.isActive &&
										"bg-primary text-primary-foreground hover:bg-primary/90"
								)}
								title={`${button.label} (${button.shortcut})`}
							>
								<button.icon className="h-4 w-4" />
							</Button>
						))}
					</div>

					<Separator orientation="vertical" className="h-6" />

					{/* List Buttons */}
					<div className="flex items-center ">
						{listButtons.map((button, index) => (
							<Button
								type="button"
								key={index}
								variant="ghost"
								size="sm"
								onClick={button.action}
								className={cn(
									"relative h-9 w-9 p-0 hover:bg-accent transition-all duration-200",
									button.isActive &&
										"bg-primary text-primary-foreground hover:bg-primary/90"
								)}
								title={button.label}
							>
								<button.icon className="h-4 w-4" />
							</Button>
						))}
					</div>

					<Separator orientation="vertical" className="h-6" />

					{/* Media & Tools */}
					<div className="flex items-center gap-1 ">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							disabled
							onClick={addImage}
							className="h-9 w-9 p-0 hover:bg-accent transition-colors"
							title="Add Image"
						>
							<ImageIcon className="h-4 w-4" />
						</Button>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={addLink}
							className={cn(
								"h-9 w-9 p-0 hover:bg-accent transition-colors",
								editor.isActive("link") && "bg-primary text-primary-foreground"
							)}
							title="Add Link"
						>
							<LinkIcon className="h-4 w-4" />
						</Button>

						{/* Table Dropdown */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="h-9 w-9 p-0 hover:bg-accent transition-colors"
									title="Table Options"
								>
									<TableIcon className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start">
								<DropdownMenuItem
									onClick={() =>
										editor
											.chain()
											.focus()
											.insertTable({ rows: 3, cols: 3, withHeaderRow: true })
											.run()
									}
									className="cursor-pointer"
								>
									<TableIcon className="h-4 w-4 mr-2" />
									Insert Table
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={() => editor.chain().focus().addRowBefore().run()}
									disabled={!editor.can().addRowBefore()}
									className="cursor-pointer"
								>
									<Plus className="h-4 w-4 mr-2" />
									Add Row Above
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => editor.chain().focus().addRowAfter().run()}
									disabled={!editor.can().addRowAfter()}
									className="cursor-pointer"
								>
									<Plus className="h-4 w-4 mr-2" />
									Add Row Below
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => editor.chain().focus().addColumnBefore().run()}
									disabled={!editor.can().addColumnBefore()}
									className="cursor-pointer"
								>
									<Plus className="h-4 w-4 mr-2" />
									Add Column Left
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => editor.chain().focus().addColumnAfter().run()}
									disabled={!editor.can().addColumnAfter()}
									className="cursor-pointer"
								>
									<Plus className="h-4 w-4 mr-2" />
									Add Column Right
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={() => editor.chain().focus().deleteRow().run()}
									disabled={!editor.can().deleteRow()}
									className="cursor-pointer text-destructive"
								>
									<Minus className="h-4 w-4 mr-2" />
									Delete Row
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => editor.chain().focus().deleteColumn().run()}
									disabled={!editor.can().deleteColumn()}
									className="cursor-pointer text-destructive"
								>
									<Minus className="h-4 w-4 mr-2" />
									Delete Column
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => editor.chain().focus().deleteTable().run()}
									disabled={!editor.can().deleteTable()}
									className="cursor-pointer text-destructive"
								>
									<Trash2 className="h-4 w-4 mr-2" />
									Delete Table
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					<Separator orientation="vertical" className="h-6" />
				</div>
			</div>

			{/* Editor */}
			<ScrollArea className="h-full">
				<div className="flex-1 overflow-y-auto">
					<EditorContent editor={editor} className="h-full" />
				</div>
			</ScrollArea>

			{/* Hidden file input */}
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				onChange={handleImageUpload}
				className="hidden"
			/>
		</div>
	);
}

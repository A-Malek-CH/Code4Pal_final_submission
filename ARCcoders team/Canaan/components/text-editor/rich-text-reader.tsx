"use client";

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
import { ScrollArea } from "@/components/ui/scroll-area"; // Assuming you want scrolling for long content

interface RichTextReaderProps {
	content: string;
}

/**
 * A read-only component that uses Tiptap's EditorContent to render HTML.
 * It has NO toolbar and is NOT editable. It ensures a 1:1 visual match with the editor.
 */
export function RichTextReader({ content }: RichTextReaderProps) {
	const editor = useEditor({
		//
		// ===== KEY CHANGE 1: MAKE IT READ-ONLY =====
		//
		editable: false,
		//
		// ============================================
		//
		content: content,
		immediatelyRender: false,
		//
		// We MUST include the same extensions and styling props as the original
		// editor to ensure the content is parsed and rendered correctly.
		//
		extensions: [
			StarterKit.configure({
				bulletList: {
					HTMLAttributes: { class: "tiptap-bullet-list" },
				},
				orderedList: {
					HTMLAttributes: { class: "tiptap-ordered-list" },
				},
				listItem: {
					HTMLAttributes: { class: "tiptap-list-item" },
				},
			}),
			Image.configure({
				HTMLAttributes: {
					class:
						"max-w-full h-auto rounded-xl my-6 shadow-lg border border-border/20",
				},
			}),
			Placeholder.configure({ placeholder: "" }), // Placeholder is irrelevant in read-only mode
			TextStyle,
			Highlight.configure({ multicolor: true }),
			Link.configure({
				openOnClick: true, // Should probably open on click in a reader
				HTMLAttributes: {
					class:
						"text-primary underline decoration-2 underline-offset-2 cursor-pointer hover:text-primary/80 transition-colors",
				},
			}),
			Table.configure({
				resizable: false, // Resizing is an editing feature
				HTMLAttributes: { class: "tiptap-table" },
			}),
			TableRow.configure({ HTMLAttributes: { class: "tiptap-table-row" } }),
			TableHeader.configure({
				HTMLAttributes: { class: "tiptap-table-header" },
			}),
			TableCell.configure({ HTMLAttributes: { class: "tiptap-table-cell" } }),
		],
		// This applies the same Tailwind Prose classes for identical typography
		editorProps: {
			attributes: {
				class:
					"prose prose-lg max-w-none focus:outline-none p-8 text-foreground leading-relaxed [&>*]:text-foreground [&_p]:text-foreground [&_p]:mb-4 [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-6 [&_h1]:mt-8 [&_h1]:text-foreground [&_h1]:border-b [&_h1]:border-border/30 [&_h1]:pb-2 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mb-4 [&_h2]:mt-6 [&_h2]:text-foreground [&_h3]:text-xl [&_h3]:font-medium [&_h3]:mb-3 [&_h3]:mt-5 [&_h3]:text-foreground [&_blockquote]:text-muted-foreground [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-6 [&_blockquote]:py-2 [&_blockquote]:italic [&_blockquote]:bg-muted/20 [&_blockquote]:rounded-r-lg [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-border [&_pre]:overflow-x-auto [&_code]:bg-muted [&_code]:px-2 [&_code]:py-1 [&_code]:rounded-md [&_code]:text-sm [&_code]:font-mono",
			},
		},
	});

	if (!editor) {
		return null;
	}

	return (
		// The component's structure is extremely simple now
		<div className="bg-background">
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

			{/*
			  // ===== KEY CHANGE 2: RENDER ONLY THE EDITOR CONTENT =====
			  //
			  // There is NO toolbar, NO buttons, NO extra divs.
			  // Just the content itself, rendered by Tiptap.
			  //
			*/}
			<ScrollArea className="h-96">
				<EditorContent editor={editor} />
			</ScrollArea>
		</div>
	);
}

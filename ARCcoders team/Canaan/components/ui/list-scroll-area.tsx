"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "@/lib/utils";
import JSXStyle from "styled-jsx/style";
import { Button } from "./button";
import { ArrowBigDownIcon } from "lucide-react";

function useMergeRefs<T>(
	...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
	return React.useCallback((value: T | null) => {
		refs.forEach((ref) => {
			if (typeof ref === "function") {
				ref(value);
			} else if (ref != null) {
				(ref as React.MutableRefObject<T | null>).current = value;
			}
		});
	}, refs);
}

const ListScrollArea = React.forwardRef<
	React.ElementRef<typeof ScrollAreaPrimitive.Viewport>,
	React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => {
	// --- State and Refs for Scroll Logic ---

	// Ref for the viewport element, which is the scrollable container.
	const internalViewportRef = React.useRef<HTMLDivElement>(null);
	// Ref for the content wrapper. We'll observe this for size changes.
	const contentRef = React.useRef<HTMLDivElement>(null);

	// State to determine if the "scroll to bottom" button should be visible.
	const [showScrollButton, setShowScrollButton] = React.useState(false);

	// A ref to track if the user is near the bottom. We use a ref here
	// to get the latest value inside the ResizeObserver without causing re-renders.
	const isAtBottomRef = React.useRef(true);

	// Merge the forwarded ref with our internal ref.
	const mergedViewportRef = useMergeRefs(ref, internalViewportRef);

	// --- Scroll Functions ---

	/**
	 * Scrolls the viewport to the absolute bottom.
	 * @param behavior - 'smooth' for user-initiated scroll, 'auto' for instant scroll.
	 */
	const scrollToBottom = React.useCallback(
		(behavior: ScrollBehavior = "smooth") => {
			const viewport = internalViewportRef.current;
			if (viewport) {
				viewport.scrollTo({ top: viewport.scrollHeight, behavior });
			}
		},
		[]
	);

	// --- Event Handlers and Effects ---

	// Effect to handle user scrolling. This updates our tracking state.
	React.useEffect(() => {
		const viewport = internalViewportRef.current;
		if (!viewport) return;

		const handleScroll = () => {
			const { scrollTop, scrollHeight, clientHeight } = viewport;
			// Check if user is within a small threshold (e.g., 20px) of the bottom.
			const atBottom = scrollHeight - scrollTop - clientHeight < 20;

			isAtBottomRef.current = atBottom;
			// Show the button only if the user has scrolled up significantly.
			setShowScrollButton(!atBottom);
		};

		viewport.addEventListener("scroll", handleScroll, { passive: true });
		return () => viewport.removeEventListener("scroll", handleScroll);
	}, []);

	// Effect to auto-scroll when new content is added.
	React.useEffect(() => {
		const viewport = internalViewportRef.current;
		const content = contentRef.current;
		if (!viewport || !content) return;

		// A ResizeObserver is the most reliable way to detect content changes
		// that affect the scroll height (e.g., new messages, images loading).
		const observer = new ResizeObserver(() => {
			// If the user was at the bottom before the content changed,
			// we automatically scroll them to the new bottom.
			if (isAtBottomRef.current) {
				scrollToBottom("auto"); // 'auto' for an instant snap, no smooth animation
			}
		});

		observer.observe(content);
		return () => observer.disconnect();
	}, [scrollToBottom]); // Dependency on scrollToBottom to ensure it's available

	return (
		<ScrollAreaPrimitive.Root
			className={cn("relative overflow-hidden", className)}
			{...props}
		>
			<JSXStyle>
				{`
        [data-radix-scroll-area-viewport] > div {
            display:block !important;
        }
        `}
			</JSXStyle>
			<ScrollAreaPrimitive.Viewport
				ref={mergedViewportRef}
				className="h-full w-full rounded-[inherit] overflow-x-hidden"
				data-tauri-drag-region
			>
				{/* We need this inner div to observe its size changes */}
				<div ref={contentRef} className="h-full">
					{children}
				</div>
			</ScrollAreaPrimitive.Viewport>
			<ListScrollBar />
			<ScrollAreaPrimitive.Corner />

			{/* Conditionally render the button based on our state */}
			{showScrollButton && (
				<Button
					onClick={() => scrollToBottom("smooth")}
					size="icon"
					className="absolute right-4 bottom-4 rounded-full flex-shrink-0 shadow-lg z-10 animate-in fade-in"
					aria-label="Scroll to bottom"
				>
					<ArrowBigDownIcon className="h-6 w-6" />
				</Button>
			)}
		</ScrollAreaPrimitive.Root>
	);
});

ListScrollArea.displayName = "ListScrollArea";

const ListScrollBar = React.forwardRef<
	React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
	React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
	<ScrollAreaPrimitive.ScrollAreaScrollbar
		ref={ref}
		orientation={orientation}
		className={cn(
			"flex touch-none select-none transition-colors",
			orientation === "vertical" &&
				"h-full w-2.5 border-l border-l-transparent p-[1px]",
			orientation === "horizontal" &&
				"h-2.5 flex-col border-t border-t-transparent p-[1px]",
			className
		)}
		{...props}
	>
		<ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
	</ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ListScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ListScrollArea, ListScrollBar };

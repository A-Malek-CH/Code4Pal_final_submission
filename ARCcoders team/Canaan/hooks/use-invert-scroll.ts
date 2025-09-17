import { useEffect, useRef } from "react";
// Configuration for the scroll "feel"
const LERP_FACTOR = 0.3; // Easing factor. Lower is smoother/slower, higher is faster/snappier. (0.05 to 0.2 is a good range)
const KEYBOARD_SCROLL_AMOUNT = 60; // How many pixels to scroll with arrow keys
export function useSmoothInvertedScroll(
	scrollableRef: React.RefObject<HTMLElement>,
	// The callback function that will receive the updated scroll position
	onScroll: (scrollTop: number) => void,
	scrollToBottom: boolean,
	updateIndex: number
) {
	const targetScroll = useRef(0);
	const currentScroll = useRef(0);
	const animationFrameId = useRef<number | null>(null);

	// This is a flag to help us distinguish between our smooth scroll
	// and a native scroll from the user.
	const isScrollingSmoothly = useRef(false);

	useEffect(() => {
		if (scrollToBottom && scrollableRef.current && updateIndex !== null) {
			// When scrolling to bottom, we want to immediately set the scroll position
			const maxScrollTop =
				scrollableRef.current.scrollHeight - scrollableRef.current.clientHeight;
			targetScroll.current = maxScrollTop;
			currentScroll.current = maxScrollTop;
			scrollableRef.current.scrollTop = maxScrollTop;
		}
	}, [scrollToBottom, scrollableRef, updateIndex]);

	// We wrap the onScroll callback in a ref to ensure we always have the latest
	// version inside our event handlers without needing to re-attach them.
	const onScrollRef = useRef(onScroll);
	useEffect(() => {
		onScrollRef.current = onScroll;
	}, [onScroll]);

	useEffect(() => {
		const el = scrollableRef.current;
		if (!el) return;

		// Initialize our scroll refs to the element's current state on mount
		targetScroll.current = el.scrollTop;
		currentScroll.current = el.scrollTop;

		const smoothScroll = () => {
			isScrollingSmoothly.current = true;
			const delta = targetScroll.current - currentScroll.current;

			if (Math.abs(delta) < 0.5) {
				// Animation finished. Set the final position.
				// The native 'scroll' event will fire because of this change,
				// and THAT is what will correctly update React's state.
				el.scrollTop = targetScroll.current;

				animationFrameId.current = null;
				isScrollingSmoothly.current = false;
				return;
			}

			currentScroll.current += delta * LERP_FACTOR;

			// ✅ THE CRITICAL CHANGE: We ONLY update the element's scroll position.
			// We DO NOT call onScrollRef.current() here anymore.
			el.scrollTop = currentScroll.current;

			animationFrameId.current = requestAnimationFrame(smoothScroll);
		};
		const startAnimation = () => {
			if (animationFrameId.current === null) {
				animationFrameId.current = requestAnimationFrame(smoothScroll);
			}
		};

		const handleWheel = (event: WheelEvent) => {
			event.preventDefault();

			// ✅ THE JUMP FIX: Sync the target to our internal, up-to-date
			// animated position, not the element's stale scrollTop.
			targetScroll.current = currentScroll.current;

			targetScroll.current -= event.deltaY; // Invert scroll

			const maxScrollTop = el.scrollHeight - el.clientHeight;
			targetScroll.current = Math.max(
				0,
				Math.min(targetScroll.current, maxScrollTop)
			);
			startAnimation();
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			const targetNode = event.target as HTMLElement;
			if (["INPUT", "TEXTAREA", "SELECT"].includes(targetNode.tagName)) {
				return;
			}

			let scrollAmount = 0;
			if (event.key === "ArrowUp") {
				scrollAmount = KEYBOARD_SCROLL_AMOUNT;
			} else if (event.key === "ArrowDown") {
				scrollAmount = -KEYBOARD_SCROLL_AMOUNT;
			}
			if (event.key === "PageUp") {
				scrollAmount = KEYBOARD_SCROLL_AMOUNT * 10;
			} else if (event.key === "PageDown") {
				scrollAmount = -KEYBOARD_SCROLL_AMOUNT * 10;
			}

			if (scrollAmount !== 0) {
				event.preventDefault();

				// ✅ APPLY THE SAME JUMP FIX HERE
				targetScroll.current = currentScroll.current;

				targetScroll.current += scrollAmount;
				const maxScrollTop = el.scrollHeight - el.clientHeight;
				targetScroll.current = Math.max(
					0,
					Math.min(targetScroll.current, maxScrollTop)
				);
				startAnimation();
			}
		};

		// --- START: NEW FEATURE ---
		// This handler will be triggered by the native 'scroll' event.
		const handleNativeScroll = () => {
			// If our `smoothScroll` animation is running, it means we are in control.
			// We should ignore this native scroll event because it was caused by us.
			if (isScrollingSmoothly.current) {
				return;
			}

			// If the `smoothScroll` is NOT running, it means the user has dragged the
			// scrollbar or clicked the track. The user is now in control.

			// We must stop any pending animation.
			if (animationFrameId.current) {
				cancelAnimationFrame(animationFrameId.current);
				animationFrameId.current = null;
			}

			// We must sync our internal `target` and `current` scroll positions
			// to match what the browser has set. This is crucial for consistency.
			targetScroll.current = el.scrollTop;
			currentScroll.current = el.scrollTop;

			// Report this new position to the parent component.
			onScrollRef.current(el.scrollTop);
		};
		// --- END: NEW FEATURE ---

		// --- Adding Event Listeners ---
		el.addEventListener("wheel", handleWheel, { passive: false });
		window.addEventListener("keydown", handleKeyDown, false);

		// --- START: NEW FEATURE ---
		// Add the native scroll event listener.
		el.addEventListener("scroll", handleNativeScroll, { passive: true });
		// --- END: NEW FEATURE ---

		// --- Cleanup ---
		return () => {
			el.removeEventListener("wheel", handleWheel);
			window.removeEventListener("keydown", handleKeyDown);

			// --- START: NEW FEATURE ---
			// Remove the native scroll event listener on cleanup.
			el.removeEventListener("scroll", handleNativeScroll);
			// --- END: NEW FEATURE ---

			if (animationFrameId.current) {
				cancelAnimationFrame(animationFrameId.current);
			}
		};
	}, [scrollableRef]); // The main effect only runs when the ref changes.
}

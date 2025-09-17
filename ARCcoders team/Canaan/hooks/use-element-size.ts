import {
	useState,
	useRef,
	useLayoutEffect,
	RefObject,
	useCallback,
} from "react";

// The initial state can be null, so we type it as such
type RectResult = DOMRectReadOnly | null;

/**
 * A robust hook that observes the size of a specific DOM element using ResizeObserver.
 *
 * @returns A tuple containing a React ref and the element's DOMRectReadOnly object.
 */
export function useResizeObserver<T extends HTMLElement>(): [
	RefObject<T>,
	RectResult
] {
	const ref = useRef<T>(null);
	const [rect, setRect] = useState<RectResult>(null);

	const handleResize = useCallback((entries: ResizeObserverEntry[]) => {
		// We only observe one element
		if (entries[0]) {
			setRect(entries[0].contentRect);
		}
	}, []);

	useLayoutEffect(() => {
		const element = ref.current;
		if (!element) {
			return;
		}

		const observer = new ResizeObserver(handleResize);
		observer.observe(element);

		return () => {
			// The element might be gone by the time the cleanup function runs
			// but disconnect works fine without an element.
			observer.disconnect();
		};
	}, [handleResize]); // The dependency is correct due to useCallback

	return [ref, rect];
}

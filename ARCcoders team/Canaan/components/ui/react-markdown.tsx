import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {
	useDeferredValue,
	useEffect,
	useMemo,
	useState,
	useTransition,
} from "react";
interface MarkdownMessageProps {
	content: string;
	reasoning?: string;
}
export function MarkdownMessage({ content, reasoning }: MarkdownMessageProps) {
	const remarkPlugins = useMemo(() => [remarkGfm], []);
	const rehypePlugins = useMemo(() => [rehypeRaw], []);
	// const materialDarkStyle = useMemo(() => materialDark, []);
	// const MemoizedSyntaxHighlighter = useMemo(() => SyntaxHighlighter, []);
	const components = useMemo(() => {
		return {
			p: ({ children }: any) => <p className="mb-2 text-wrap">{children}</p>,
			code: ({ children }: any) => (
				<code className="mb-2 text-wrap">{children}</code>
			),
		};
	}, [remarkPlugins, rehypePlugins]);
	return (
		<div className="w-full px-2 break-words hyphens-auto">
			{reasoning && (
				<div className="border-l-2 px-2 border-primary/60 w-full">
					<p className="text-foreground/55 mb-2 text-wrap">{reasoning}</p>
				</div>
			)}
			<ReactMarkdown
				remarkPlugins={remarkPlugins}
				rehypePlugins={rehypePlugins}
				components={components}
			>
				{content}
			</ReactMarkdown>
		</div>
	);
}
// The component signature now accepts the content prop
export function MarkdownMessageLazyLoader({ content }: { content: string }) {
	const [isPending, startTransition] = useTransition();
	const [internalContent, setInternalContent] = useState(content);

	useEffect(() => {
		// When the prop changes, start a non-urgent transition
		// to update our internal state.
		startTransition(() => {
			setInternalContent(content);
		});
	}, [content]); // Dependency on the prop

	return (
		<div style={{ opacity: isPending ? 0.4 : 1 }}>
			<MarkdownMessage content={internalContent} />
		</div>
	);
}

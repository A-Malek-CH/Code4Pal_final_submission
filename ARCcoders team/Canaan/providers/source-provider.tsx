import {
	createContext,
	FC,
	ReactNode,
	useContext,
	useMemo,
	useState,
} from "react";

interface SourceContextValue {
	activeDocumentId: string | null;
	handleSourceClick: (documentId: string) => void;
	handleSidebarClose: () => void;
}
const SourceContext = createContext<SourceContextValue | undefined>(undefined);
export const SourceProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);

	const handleSourceClick = (documentId: string) => {
		setActiveDocumentId(documentId);
	};

	const handleSidebarClose = () => {
		setActiveDocumentId(null);
	};
	const sourceContextValue = useMemo<SourceContextValue>(() => {
		return {
			activeDocumentId,
			handleSidebarClose,
			handleSourceClick,
		};
	}, [activeDocumentId, handleSidebarClose, handleSourceClick]);
	return (
		<SourceContext.Provider value={sourceContextValue}>
			{children}
		</SourceContext.Provider>
	);
};
export const useSource = (): SourceContextValue => {
	const context = useContext(SourceContext);
	if (context === undefined) {
		throw new Error("useSource must be used within a SourceProvider");
	}
	return context;
};

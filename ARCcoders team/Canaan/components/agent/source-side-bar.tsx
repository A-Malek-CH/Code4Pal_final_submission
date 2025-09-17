import { useQuery } from "@tanstack/react-query";
import { Loader } from "../ui/loader";
import {
	Sidebar,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarTrigger,
	useSidebar,
} from "../ui/sidebar";
import { getDocumentById } from "@/lib/supabase";
import { Badge } from "../ui/badge";
import {
	AlertTriangle,
	BookMarkedIcon,
	BookOpen,
	LinkIcon,
	X,
} from "lucide-react";
import { MarkdownMessageLazyLoader } from "../ui/react-markdown";
import { useSource } from "@/providers/source-provider";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Fragment, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

// A helper component to render the dynamic content
const DocumentViewer = ({ documentId }: { documentId: string }) => {
	const {
		data: document,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["document", documentId],
		queryFn: () => getDocumentById(documentId),
		enabled: !!documentId,
	});

	// --- ANIMATION LOGIC END ---

	if (isLoading) {
		return <Loader size="lg" />;
	}

	if (isError || !document) {
		return (
			<div className="flex flex-col items-center justify-center h-full text-destructive p-4 text-center">
				<AlertTriangle className="h-8 w-8 mb-2" />
				<p className="font-semibold">Failed to load document</p>
				<p className="text-xs">{error?.message}</p>
			</div>
		);
	}
	const doucmentMetaData = document.metadata as Record<string, any>;

	return (
		// 3. The OUTER wrapper. It gets the ref and takes up natural space. It is never collapsed.
		<div className="flex flex-col h-full">
			<div className="w-full h-full overflow-hidden px-2 ">
				<ScrollArea className="h-full">
					{/* All of your original content goes inside this inner wrapper */}
					<header className="p-4 border-b whitespace-nowrap">
						<h2 className="text-xl font-bold truncate">
							{doucmentMetaData?.title || "Source Document"}
						</h2>
						<div className="flex items-center gap-4 pt-2 text-sm text-muted-foreground">
							<Badge variant="secondary">
								{doucmentMetaData?.type || "Document"}
							</Badge>
							{doucmentMetaData?.url && (
								<a
									href={doucmentMetaData.url}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-1.5 hover:text-primary"
								>
									<LinkIcon size={14} /> View Original
								</a>
							)}
						</div>
					</header>
					<MarkdownMessageLazyLoader
						content={document.content}
					></MarkdownMessageLazyLoader>
				</ScrollArea>
			</div>
		</div>
	);
};

const SourceSideBar = () => {
	const { id } = useParams();
	if (!id) return null;
	function SourceSideBarContent() {
		const { open: isCollapsed } = useSidebar();
		const { setOpenMobile, isMobile, setOpen } = useSidebar();

		const { activeDocumentId, handleSidebarClose } = useSource();
		useEffect(() => {
			if (activeDocumentId) {
				if (isMobile) setOpenMobile(true);
				else setOpen(true);
			}
		}, [activeDocumentId, isMobile]);
		return (
			<Fragment>
				<SidebarHeader>
					<SidebarMenu>
						{/* This trigger can still be used to manually collapse/expand */}
						<SidebarMenuItem>
							<SidebarMenuButton asChild className="size-8 md:p-0 ">
								<SidebarTrigger
									sidebarId="source"
									size="icon"
									variant={isCollapsed ? "default" : "ghost"}
									className=""
									icon={() => <BookMarkedIcon />}
								/>
							</SidebarMenuButton>
						</SidebarMenuItem>

						{/* We add an explicit close button that is only visible when a document is active */}
						{activeDocumentId && (
							<SidebarMenuItem>
								<Button
									variant="ghost"
									size="icon"
									onClick={handleSidebarClose}
									className="ml-auto"
								>
									<X className="h-4 w-4" />
									<span className="sr-only">Close document viewer</span>
								</Button>
							</SidebarMenuItem>
						)}
					</SidebarMenu>
				</SidebarHeader>

				{/* This is the main content area */}
				<div
					className={cn(
						"transition-all duration-300 ease-in-out flex-1 overflow-y-auto",
						!isCollapsed ? "w-0 opacity-0" : "w-full opacity-100"
					)}
				>
					{activeDocumentId ? (
						<DocumentViewer documentId={activeDocumentId} />
					) : (
						<div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
							<BookOpen className="h-10 w-10 mb-2" />
							<p className="font-semibold">View Source Document</p>
							<p className="text-sm">
								Click a source number 1, 2, 3... in a message to display its
								content here.
							</p>
						</div>
					)}
				</div>
			</Fragment>
		);
	}

	return (
		<Sidebar
			id="source"
			collapsible="icon"
			side="right"
			className="border-l md:w-[42rem] sm:w-[36rem] md:max-w-2xl flex flex-col"
			defaultOpen={false}
			// We can add a data attribute to control the expanded state from the parent if needed
		>
			<SourceSideBarContent />
		</Sidebar>
	);
};
export default SourceSideBar;

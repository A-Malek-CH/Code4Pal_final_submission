import React from "react";
import { Source } from "@prisma/client";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { RichTextReader } from "../text-editor/rich-text-reader";

interface SourceCardProps {
	source: Source;
}

const LinkIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		{...props}
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" />
		<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" />
	</svg>
);

const SourceCard: React.FC<SourceCardProps> = ({ source }) => {
	return (
		<Card className="hover:shadow-md transition-shadow duration-300">
			<CardHeader>
				<div className="flex justify-between items-start">
					<div>
						<CardTitle className="text-lg">{source.title}</CardTitle>
						<CardDescription>by {source.author}</CardDescription>
					</div>
					<a
						href={source.url}
						target="_blank"
						rel="noopener noreferrer"
						className="text-muted-foreground hover:text-primary transition-colors p-2 -mr-2 -mt-2"
					>
						<LinkIcon className="h-5 w-5" />
					</a>
				</div>
			</CardHeader>
			<CardContent>
				<RichTextReader content={source.content} />
			</CardContent>
		</Card>
	);
};

export default SourceCard;

import React from "react";
import SourceCard from "./SourceCard";
import { Source } from "@prisma/client";

interface SourceListProps {
	sources: Source[];
}

const SourceList: React.FC<SourceListProps> = ({ sources }) => {
	if (!sources || sources.length === 0) {
		return (
			<p className="text-center text-muted-foreground py-10">
				No sources available for this event.
			</p>
		);
	}

	return (
		<div className="grid gap-4 md:grid-cols-2">
			{sources.map((source) => (
				<SourceCard key={source.id} source={source} />
			))}
		</div>
	);
};

export default SourceList;

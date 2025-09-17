"use client";

import React from "react";
import { EyeIcon } from "lucide-react";
import type { MediaCreation } from "@/types/media";
import { Button } from "@/components/ui/button";

export const ImageProgressComponent = ({
	onView,
	image,
}: {
	onView: (image: MediaCreation) => void;
	image: MediaCreation;
}) => {
	return (
		<React.Fragment>
			<div className="absolute inset-0 flex justify-center items-center opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
				<Button
					variant="ghost"
					size="icon"
					className="h-10 w-10 text-primary hover:text-primary/70 hover:bg-background/20 border border-border hover:border-border/70 transition-all duration-300 backdrop-blur-sm"
					onClick={() => onView(image)}
					type="button"
				>
					<EyeIcon className="w-5 h-5" />
				</Button>
			</div>
		</React.Fragment>
	);
};

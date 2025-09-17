import React from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardDescription,
} from "@/components/ui/card";
import { EventWLinks } from "@/types/events";
import { Location } from "@prisma/client";
interface MapComponentProps {
	location: Location;
	event: EventWLinks;
}

const MapPinIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
		<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
		<circle cx="12" cy="10" r="3" />
	</svg>
);

const MapComponent: React.FC<MapComponentProps> = ({ location, event }) => {
	return (
		<div className="relative w-full h-[500px] rounded-2xl overflow-hidden bg-muted border">
			{/* This is a mock map background */}
			<img
				src={`https://picsum.photos/seed/mapbg/1200/500`}
				alt="Map background"
				className="w-full h-full object-cover opacity-30"
			/>
			<div className="absolute inset-0 flex items-center justify-center">
				<MapPinIcon className="h-12 w-12 text-red-500 animate-bounce" />
			</div>

			<Card className="absolute top-4 left-4 w-full max-w-sm bg-background/80 backdrop-blur-sm">
				<CardHeader>
					<CardTitle className="text-lg">{location.name}</CardTitle>
					<CardDescription>Location for: {event.name}</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						{location.description}
					</p>
					<p className="text-xs font-mono mt-2">
						Lat: {location.coordinates?.split(",")[0]}, Lng:{" "}
						{location.coordinates?.split(",")[1]}
					</p>
				</CardContent>
			</Card>
		</div>
	);
};

export default MapComponent;

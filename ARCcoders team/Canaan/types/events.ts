import {
	Event,
	Source,
	Actor,
	Location,
	LocationLink,
	SourceLink,
	ActorLink,
} from "@prisma/client";

export type EventWLinks = Omit<Event, "start_date" | "end_date"> & {
	start_date: string;
	end_date: string;
} & {
	locationLinks: (LocationLink & { location: Location })[];
	sourceLinks: (SourceLink & { source: Actor })[];
	actorLinks: (ActorLink & { actor: Actor })[];
};

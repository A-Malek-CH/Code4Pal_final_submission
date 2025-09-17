// These are the types you provided
type StoryElement = {
	text: string;
	category: string;
	position: { x: number; y: number };
	options: string[];
	correctAnswer: string;
};

type StoryConnection = {
	from: number;
	to: number;
	relationship: string;
};

export type HistoricalEvent = {
	title: string;
	date: string;
	location: string;
	outcome: string;
	storyElements: StoryElement[];
	storyConnections: StoryConnection[];
	tags: string[];
	actors: string[];
	locations: string[];
	related_places: { type: string; name: string }[];
	dateOptions: string[];
	locationOptions: string[];
	outcomeOptions: string[];
};

// This is the type for a single row fetched from your 'game' table
export type GameRecord = {
	id: string;
	event_id: string;
	type: string;
	created_at: string;
	updated_at: string;
	game: HistoricalEvent; // The JSON column is strongly typed here
};

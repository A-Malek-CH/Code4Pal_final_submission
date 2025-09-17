import { supabase } from "./supabase";

// === Event Functions ===
// These were correct
export const getEvents = async () => {
	const { data, error } = await supabase.from("event").select("*");
	if (error) throw new Error(error.message);
	return data;
};

export const getEvent = async (eventId: string) => {
	const { data, error } = await supabase
		.from("event")
		.select("*")
		.eq("id", eventId)
		.single();
	if (error) throw new Error(error.message);
	return data;
};

// === Actor Functions ===
// These were correct
export const getActors = async () => {
	const { data, error } = await supabase.from("actor").select("*");
	if (error) throw new Error(error.message);
	return data;
};

export const getActor = async (actorId: string) => {
	const { data, error } = await supabase
		.from("actor")
		.select("*")
		.eq("id", actorId)
		.single();
	if (error) throw new Error(error.message);
	return data;
};

// === Location Functions ===
// These were correct
export const getLocations = async () => {
	const { data, error } = await supabase.from("location").select("*");
	if (error) throw new Error(error.message);
	return data;
};

export const getLocation = async (locationId: string) => {
	const { data, error } = await supabase
		.from("location")
		.select("*")
		.eq("id", locationId)
		.single();
	if (error) throw new Error(error.message);
	return data;
};

// === Functions for a Specific Event ===

/**
 * FIXED:
 * 1. Changed table from `media` to `media_asset` to match the schema's `@@map`.
 * 2. Changed column from `eventId` to `event_id` to match the database column name.
 */
export const getMediaForEvent = async (eventId: string) => {
	const { data, error } = await supabase
		.from("media_asset")
		.select("*")
		.eq("event_id", eventId); // Use the snake_case database column name

	if (error) throw new Error(error.message);
	return data;
};

/**
 * FIXED:
 * 1. The `source` table doesn't have an `event_id`. The relationship is through `source_link`.
 * 2. Query the `source_link` table and use Supabase's foreign table syntax `source(*)` to get all data from the related source.
 * 3. Map the results to return an array of `Source` objects.
 */
export const getSourcesForEvent = async (eventId: string) => {
	const { data, error } = await supabase
		.from("source_link") // Query the join table
		.select("source(*)") // Select all columns from the related `source` table
		.eq("event_id", eventId);

	if (error) throw new Error(error.message);
	// The result is [{ source: {...} }, { source: {...} }], so we map it.
	// We also filter out any potential nulls if a link existed without a source.
	return data?.map((item) => item.source).filter(Boolean) || [];
};

/**
 * FIXED:
 * 1. Changed table from `event_actors` to `actor_link` to match the schema's `@@map`.
 * 2. Use `actor(*)` to select data from the related `actor` table (singular, matching the table name).
 * 3. Map the results to return an array of `Actor` objects.
 */
export const getActorsForEvent = async (eventId: string) => {
	const { data, error } = await supabase
		.from("actor_link") // Query the join table
		.select("actor(*)") // Select all columns from the related `actor` table
		.eq("event_id", eventId);

	if (error) throw new Error(error.message);
	// The result is [{ actor: {...} }, { actor: {...} }], so we map it.
	return data?.map((item) => item.actor).filter(Boolean) || [];
};

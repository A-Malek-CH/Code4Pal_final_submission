import { Event } from "@prisma/client";
import { supabase } from "./supabase";
import { EventWLinks } from "@/types/events";
type EventInput = Omit<Event, "id" | "created_at" | "updated_at">;
// Database query functions
export async function getEvents() {
	const { data, error } = await supabase
		.from("event")
		.select(
			`
        *,
        sourceLinks:source_link (
          source:source (*)
        ),
		locationLinks:location_link (
          location:location (*)
        ),
        actorLinks:actor_link (
          role,
          actor:actor (*)
        ),
        mediaAssets:media_asset (*),
        sourceRelationships:event_relationship!source_event_id (*),
        targetRelationships:event_relationship!target_event_id (*)
      `
		)
		.order("created_at", { ascending: false });

	if (error) throw error;
	return data;
}

export async function getEventById(id: string) {
	const { data, error } = await supabase
		.from("event")
		.select(
			`
        *,
        sourceLinks:source_link (
          source:source (*)
        ),
        mediaAssets:media_asset (*),
        actorLinks:actor_link (
          actor:actor (*)
        ),
        locationLinks:location_link (
          location:location (*)
        )
      `
		)
		.eq("id", id)
		.single();

	if (error) throw error;
	return data;
}

export async function getEventRelationships() {
	const { data, error } = await supabase.from("event_relationship").select(`
        *,
        sourceEvent:event!source_event_id (*),
        targetEvent:event!target_event_id (*)
      `);

	if (error) throw error;
	return data;
}

// Create functions
export async function createEvent(
	eventData: EventInput,
	sourceIds: string[] = [],
	actorLinks: { actorId: string; role: string }[] = [],
	locationsIds: string[] = []
) {
	const { data: event, error: eventError } = await supabase
		.from("event")
		.insert({
			name: eventData.name,
			description: eventData.description,
			start_date: eventData.start_date || null,
			end_date: eventData.end_date || null,
			tags: eventData.tags || [],
		})
		.select()
		.single();

	if (eventError) throw eventError;

	// Link source to event
	if (sourceIds.length > 0) {
		const sourceLinks = sourceIds.map((source_id) => ({
			event_id: event.id,
			source_id: source_id,
			relevance: "primary",
		}));

		const { error: linkError } = await supabase
			.from("source_link")
			.insert(sourceLinks);

		if (linkError) throw linkError;
	}

	if (locationsIds.length > 0) {
		const locationLinks = locationsIds.map((locationId) => ({
			event_id: event.id,
			location_id: locationId,
		}));

		const { error: linkError } = await supabase
			.from("location_link")
			.insert(locationLinks);

		if (linkError) throw linkError;
	}
	if (actorLinks.length > 0) {
		const actorLinksData = actorLinks.map((link) => ({
			event_id: event.id,
			actor_id: link.actorId,
			role: link.role,
		}));

		const { error: actorLinkError } = await supabase
			.from("actor_link")
			.insert(actorLinksData);

		if (actorLinkError) throw actorLinkError;
	}

	return event;
}

export async function updateEvent(
	event_id: string,
	eventData: EventInput,
	sourceIds: string[] = [],
	actorLinks: { actorId: string; role: string }[] = [],
	locationsIds: string[] = []
) {
	const { data: event, error: eventError } = await supabase
		.from("event")
		.update({
			name: eventData.name,
			description: eventData.description,
			start_date: eventData.start_date || null,
			end_date: eventData.end_date || null,
			tags: eventData.tags || [],
		})
		.eq("id", event_id)
		.select()
		.single();

	if (eventError) throw eventError;

	// Remove existing source links
	await supabase.from("source_link").delete().eq("event_id", event_id);
	await supabase.from("actor_link").delete().eq("event_id", event_id);
	await supabase.from("location_link").delete().eq("event_id", event_id);

	// Add new source links
	if (sourceIds.length > 0) {
		const sourceLinks = sourceIds.map((source_id) => ({
			event_id: event_id,
			source_id: source_id,
			relevance: "primary",
		}));

		const { error: linkError } = await supabase
			.from("source_link")
			.insert(sourceLinks);

		if (linkError) throw linkError;
	}
	if (locationsIds.length > 0) {
		const locationLinks = locationsIds.map((locationId) => ({
			event_id: event.id,
			location_id: locationId,
		}));

		const { error: linkError } = await supabase
			.from("location_link")
			.insert(locationLinks);

		if (linkError) throw linkError;
	}
	if (actorLinks.length > 0) {
		const actorLinksData = actorLinks.map((link) => ({
			event_id: event_id,
			actor_id: link.actorId,
			role: link.role,
		}));

		const { error: actorLinkError } = await supabase
			.from("actor_link")
			.insert(actorLinksData);

		if (actorLinkError) throw actorLinkError;
	}

	return event;
}

export async function getEventsByLocation(locationName: string, year?: number) {
	let query = supabase
		.from("event")
		.select(
			`
        *,
        locationLinks:location_link (
          location:location (*)
        ),
        actorLinks:actor_link (
          role,
          actor:actor (*)
        ),
		sourceLinks:source_link (
          source:source (*)
        ),
      `
		)
		.or(
			`location.ilike.%${locationName}%,locationLinks.location.name.ilike.%${locationName}%`
		);

	if (year) {
		query = query
			.gte("start_date", `${year}-01-01`)
			.lte("start_date", `${year}-12-31`);
	}

	const { data, error } = await query.order("start_date", { ascending: true });

	if (error) throw error;
	return data;
}

export async function deleteEvent(event_id: string) {
	await supabase.from("source_link").delete().eq("event_id", event_id);
	await supabase.from("actor_link").delete().eq("event_id", event_id);
	await supabase.from("location_link").delete().eq("event_id", event_id);

	const { error } = await supabase.from("event").delete().eq("id", event_id);
	if (error) throw error;
}

export async function getEventsByDateRange(startYear: number, endYear: number) {
	// The start date is correct: greater than or equal to the first moment of the start year.
	const startDate = `${startYear}-01-01`;

	// The end date should be less than the first moment of the *next* year.
	const endDate = `${endYear + 1}-01-01`;

	const { data, error } = await supabase
		.from("event")
		.select(
			`
            id, name, description, start_date, end_date, tags,
            locationLinks:location_link (
                location:location (*)
            ),
            actorLinks:actor_link (
                role,
                actor:actor (*)
            ),
            sourceLinks:source_link (
                source:source (*)
            )
            `
		)
		// Correctly filters from the beginning of the start year...
		.gte("start_date", startDate)
		// ...to everything BEFORE the beginning of the next year.
		.lt("start_date", endDate)
		.order("start_date", { ascending: true });

	console.log("🚀 ~ getEventsByDateRange ~ data:", data);
	if (error) {
		console.error("Error fetching events by date range:", error);
		throw error;
	}

	// The 'data' will be correctly typed if you've set up Supabase types.
	return data as any as EventWLinks[];
}

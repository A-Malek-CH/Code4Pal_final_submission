import { supabase } from "./supabase";

export async function getDashboardStats() {
	const [eventsCount, sourcesCount, mediaCount, actorsCount, locationsCount] =
		await Promise.all([
			supabase.from("event").select("id", { count: "exact", head: true }),
			supabase.from("source").select("id", { count: "exact", head: true }),
			supabase
				.from("media_assets")
				.select("id", { count: "exact", head: true }),
			supabase.from("actor").select("id", { count: "exact", head: true }),
			supabase.from("location").select("id", { count: "exact", head: true }),
		]);

	return {
		event: eventsCount.count || 0,
		source: sourcesCount.count || 0,
		media: mediaCount.count || 0,
		actor: actorsCount.count || 0,
		location: locationsCount.count || 0,
	};
}

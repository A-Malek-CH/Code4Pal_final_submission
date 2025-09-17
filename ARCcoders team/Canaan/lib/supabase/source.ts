import { supabase } from "./supabase";

export async function getSources() {
	const { data, error } = await supabase
		.from("source")
		.select()
		.order("created_at", { ascending: false });

	if (error) throw error;
	return data;
}

export async function createSource(source: any) {
	const { data, error } = await supabase
		.from("source")
		.insert(source)
		.select()
		.single();

	if (error) throw error;
	return data;
}

export async function updateSource(sourceId: string, sourceData: any) {
	const { data, error } = await supabase
		.from("source")
		.update(sourceData)
		.eq("id", sourceId)
		.select()
		.single();

	if (error) throw error;
	return data;
}

export async function deleteSource(sourceId: string) {
	await supabase.from("source_links").delete().eq("source_id", sourceId);
	await supabase.from("document").delete().eq("source_id", sourceId);
	const { error } = await supabase.from("source").delete().eq("id", sourceId);
	if (error) throw error;
}

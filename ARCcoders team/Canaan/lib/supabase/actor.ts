import { Actor } from "@prisma/client";
import { supabase } from "./supabase";

export async function getActors() {
	const { data, error } = await supabase.from("actor").select().order("name");

	if (error) throw error;
	return data;
}

export async function createActor(
	actorData: Omit<Actor, "created_at" | "updated_at" | "id">
) {
	const { data, error } = await supabase
		.from("actor")
		.insert<Omit<Actor, "created_at" | "updated_at" | "id">>(actorData)
		.select()
		.single();

	if (error) throw error;
	return data;
}

export async function updateActor(
	actorId: string,
	actorData: Omit<Actor, "created_at" | "updated_at" | "id">
) {
	const { data, error } = await supabase
		.from("actor")
		.update<Omit<Actor, "created_at" | "updated_at" | "id">>(actorData)
		.eq("id", actorId)
		.select()
		.single();

	if (error) throw error;
	return data;
}

export async function deleteActor(actorId: string) {
	await supabase.from("actor_links").delete().eq("actorId", actorId);

	const { error } = await supabase.from("actor").delete().eq("id", actorId);
	if (error) throw error;
}

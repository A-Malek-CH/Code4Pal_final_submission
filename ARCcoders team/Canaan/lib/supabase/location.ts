import { supabase } from "./supabase";
import { Location } from "@prisma/client";
export async function getLocations() {
	const { data, error } = await supabase
		.from("location")
		.select()
		.order("name");

	if (error) throw error;
	return data;
}
export async function createLocation(
	locationData: Omit<Location, "id" | "created_at" | "updated_at">
) {
	const { data, error } = await supabase
		.from("location")
		.insert({
			...locationData,
		})
		.select()
		.single();

	if (error) throw error;
	return data;
}

export async function updateLocation(
	locationId: string,
	locationData: Omit<Location, "id" | "created_at" | "updated_at">
) {
	const { data, error } = await supabase
		.from("location")
		.update({ ...locationData })
		.eq("id", locationId)
		.select()
		.single();

	if (error) throw error;
	return data;
}

export async function deleteLocation(locationId: string) {
	await supabase.from("location_links").delete().eq("locationId", locationId);

	const { error } = await supabase
		.from("location")
		.delete()
		.eq("id", locationId);
	if (error) throw error;
}

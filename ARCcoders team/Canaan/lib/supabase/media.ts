import { MediaAsset } from "@prisma/client";
import { supabase } from "./supabase";
import { MediaAssetInput } from "@/types/media-asset";

export async function createMediaAsset(mediaData: MediaAssetInput) {
	const { data, error } = await supabase
		.from("media_asset")
		.insert({
			title: mediaData.title,
			asset_type: mediaData.asset_type,
			storage_url: mediaData.storage_url,
			source_text: mediaData.source_text,
			embedding: mediaData.embedding || null,
			event_id: mediaData.event_id || null,
		})
		.select()
		.single();

	if (error) throw error;
	return data;
}

export async function updateMediaAsset(
	mediaId: string,
	mediaData: MediaAssetInput
) {
	const { data, error } = await supabase
		.from("media_asset")
		.update({
			title: mediaData.title,
			asset_type: mediaData.asset_type,
			storage_url: mediaData.storage_url,
			source_text: mediaData.source_text,
			embedding: mediaData.embedding || null,
			event_id: mediaData.event_id || null,
		})
		.eq("id", mediaId)
		.select()
		.single();

	if (error) throw error;
	return data;
}

export async function deleteMediaAsset(mediaId: string) {
	const { error } = await supabase
		.from("media_asset")
		.delete()
		.eq("id", mediaId);
	if (error) throw error;
}

export async function getMediaAssets(): Promise<MediaAsset[]> {
	const { data, error } = await supabase
		.from("media_asset")
		.select()
		.order("created_at", { ascending: false });

	if (error) throw error;
	return data;
}

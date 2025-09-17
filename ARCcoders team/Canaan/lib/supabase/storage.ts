import { supabase } from "@/lib/supabase/supabase"; // Your supabase client

/**
 * Counts the number of items in a Supabase Storage bucket, optionally filtered by a folder and search query.
 * This function calls a secure PostgreSQL RPC.
 *
 * @param bucket - The name of the storage bucket (e.g., "canaan").
 * @param folder - The folder/path prefix to search within (e.g., "user_avatars/user_123").
 * @param searchQuery - An additional search string to append to the folder path.
 * @returns The total count of matching items.
 */
export async function countStorageItems(
	bucket: string,
	folder?: string,
	searchQuery?: string
) {
	// The RPC function name must match what you created in the SQL Editor
	const { data, error } = await supabase.rpc("count_storage_items", {
		bucket_name: bucket,
		folder_prefix: folder || "",
		search_query: searchQuery || "",
	});

	if (error) {
		console.error("Error counting storage items:", error);
		throw error;
	}

	// For RPCs that return a single value, the result is in the `data` property.
	return data as number;
}

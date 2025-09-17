import { IAuthIdentity } from "@/types/user";
import { supabase } from "./supabase";
import { User } from "@prisma/client";

/**
 * Finds a user in Supabase by their Firebase UID.
 * If the user doesn't exist, it creates a new one.
 * @param authIdentity - The parsed data from the Firebase token.
 * @returns The full user profile from the database.
 */
export async function getOrCreateUserFromAuth(
	authIdentity: Omit<IAuthIdentity, "id_token" | "custom_token" | "provider_id">
): Promise<User> {
	const { id, email, display_name, photo_url } = authIdentity;

	// 1. Try to fetch the user by their ID
	const { data: existingUser, error: selectError } = await supabase
		.from("user") // Note: using snake_case table name "users"
		.select("*")
		.eq("id", id)
		.single(); // .single() returns one record or null, perfect for this

	if (selectError && selectError.code !== "PGRST116") {
		// PGRST116 is the error code for "No rows found", which is expected.
		// We throw any other unexpected errors.
		console.error("Error fetching user:", selectError);
		throw selectError;
	}

	// 2. If the user exists, return them
	if (existingUser) {
		// Optional: You could add an `update` call here if you want to
		// refresh their display_name or photo_url on every login.
		return existingUser;
	}

	// 3. If the user does NOT exist, create them
	const { data: newUser, error: insertError } = await supabase
		.from("user")
		.insert({
			id: id, // Use the Firebase UID as our primary key
			email: email,
			display_name: display_name,
			photo_url: photo_url,
			// `xp` and other fields will get their default values from the DB
		})
		.select() // Use .select() to return the newly created row
		.single(); // We expect a single new user back

	if (insertError) {
		console.error("Error creating user:", insertError);
		throw insertError;
	}

	if (!newUser) {
		throw new Error("Failed to create user and retrieve the new record.");
	}

	return newUser;
}

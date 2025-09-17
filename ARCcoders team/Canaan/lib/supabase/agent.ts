"use server";

import { StoreMessageResponse } from "@/types/Message";
import { supabase } from "./supabase";
import { Message, Conversation } from "@prisma/client";
export type InputUserMessage = Omit<
	Message,
	"id" | "created_at" | "updated_at"
>;
export async function createConversationDB(params: {
	userId: string;
	title: string;
}): Promise<Conversation> {
	const { userId, title } = params;
	const { data, error } = await supabase
		.from("conversation")
		.insert({ user_id: userId, title: title, is_public: false })
		.select("*")
		.single();
	if (error) throw new Error(`Could not create conversation: ${error.message}`);
	return data;
}

/**
 * Stores a message in the database.
 * If conversationId is not provided, it creates a new conversation.
 *
 * @param userId - The ID of the user creating the message.
 * @param messageData - The message object to store.
 * @param conversationId - Optional ID of an existing conversation.
 * @returns The newly created message object from the database.
 */
export async function storeMessage(
	userId: string,
	messageData: Omit<Message, "id" | "created_at" | "updated_at">
): Promise<StoreMessageResponse> {
	const conversationId = messageData.conversation_id;
	const { error: checkError } = await supabase
		.from("conversation")
		.select("id", { count: "exact" }) // More efficient check
		.eq("id", conversationId)
		.eq("user_id", userId);
	if (checkError) throw new Error("Conversation not found or access denied.");

	const messageToInsert = { ...messageData, conversation_id: conversationId };
	const { data: newMessage, error: messageError } = await supabase
		.from("message")
		.insert(messageToInsert)
		.select("*")
		.single();
	if (messageError)
		throw new Error(`Could not save your message: ${messageError.message}`);
	return { message_id: newMessage.id, conversation_id: conversationId };
}
async function checkWhoAmI() {
	console.log("Asking the database for my user ID...");

	// Call the RPC function by its name.
	// The second argument is for parameters, but ours has none.
	const { data, error } = await supabase.rpc("get_current_user_id");

	if (error) {
		console.error("Error calling RPC function:", error.message);
		return;
	}

	// The 'data' variable holds the exact value returned by the function.
	console.log("✅ SUCCESS! The database sees my ID as:", data);
}

/**
 * Fetches all conversations for a specific user, with pagination.
 *
 * @param userId - The ID of the user whose conversations to fetch.
 * @param page - The page number to retrieve (0-indexed).
 * @param pageSize - The number of conversations per page.
 * @returns A list of the user's conversations.
 */
export async function getConversations(
	userId: string,
	page = 0,
	pageSize = 15
): Promise<Conversation[]> {
	// await checkWhoAmI();
	const { data, error } = await supabase
		.from("conversation")
		.select("*") // Select all fields to match the Prisma 'Conversation' type
		.eq("user_id", userId)
		.order("updated_at", { ascending: false })
		.range(page * pageSize, (page + 1) * pageSize - 1);

	if (error) throw new Error(`Could not load conversations: ${error.message}`);
	return data;
}

/**
 * Fetches a single conversation by its unique ID.
 *
 * @param conversationId - The unique ID of the conversation to fetch.
 * @returns The conversation object, or null if not found.
 */
export async function getConversation(
	conversationId: string
): Promise<Conversation | null> {
	const { data, error } = await supabase
		.from("conversation")
		.select("*")
		.eq("id", conversationId) // Filter by the primary key 'id'
		.single(); // Expect exactly one row. Errors if 0 or >1 rows are found.

	// Handle the specific "not found" error gracefully
	// PostgREST error code 'PGRST116' means 'JSON object requested, but 0 rows returned'
	if (error && error.code === "PGRST116") {
		return null; // The conversation was not found, which is a valid case.
	}

	// For any other database or network error, throw an exception
	if (error) {
		throw new Error(`Could not load conversation: ${error.message}`);
	}

	return data;
}
/**
 * Fetches all messages for a specific conversation belonging to a user.
 *
 * @param conversationId - The ID of the conversation to fetch.
 * @returns A list of messages in the conversation.
 */
export async function getMessages(conversationId: string): Promise<Message[]> {
	console.log("🚀 ~ getMessages ~ conversationId:", conversationId);

	const { data, error } = await supabase
		.from("message")
		.select("*")
		.eq("conversation_id", conversationId)
		.order("created_at", { ascending: true });
	if (error) throw new Error(`Could not load messages: ${error.message}`);
	return data;
}

/**
 * Updates an existing message's content.
 *
 * @param userId - The ID of the user making the edit.
 * @param messageId - The ID of the message to edit.
 * @param messageData - The message object to store.
 * @returns The updated message object.
 */
export async function editMessage(
	userId: string,
	messageId: string,
	messageData: Omit<Message, "id" | "created_at" | "updated_at" | "index">
): Promise<Message> {
	// 1. Fetch the message and its conversation's owner.
	const { data: message, error: fetchError } = await supabase
		.from("message")
		.select("id, conversation:conversation_id(user_id)")
		.eq("id", messageId)
		.single();

	// Handle query errors first
	if (fetchError) {
		console.error("Error fetching message to edit:", fetchError);
		throw new Error(`Database error: ${fetchError.message}`);
	}

	// Handle message not found
	if (!message) {
		console.warn(`Message with ID ${messageId} not found.`);
		throw new Error("Message not found."); // A more accurate error
	}

	console.log("🚀 ~ editMessage ~ message found:", message);

	// 2. Now, specifically check for permissions.
	// The `(as any)` is okay here, but be aware of what it implies.
	const ownerId = (message.conversation as any)?.user_id;
	if (ownerId !== userId) {
		console.warn(
			`Permission denied. User ${userId} tried to edit message ${messageId} owned by ${ownerId}.`
		);
		throw new Error("You do not have permission to edit this message.");
	}

	// 2. If verification passes, update the message content.
	const { data: updatedMessage, error: updateError } = await supabase
		.from("message")
		.update({ ...messageData })
		.eq("id", messageId)
		.select("*") // Return the full message object
		.single();
	if (updateError)
		throw new Error(`Could not update the message: ${updateError.message}`);
	return updatedMessage;
}

/**
 * Deletes a conversation and all its associated messages.
 *
 * @param userId - The ID of the user deleting the conversation.
 * @param conversationId - The ID of the conversation to delete.
 */
export async function deleteConversation(
	userId: string,
	conversationId: string
): Promise<void> {
	const { error } = await supabase
		.from("conversation")
		.delete()
		.eq("user_id", userId)
		.eq("id", conversationId);
	if (error)
		throw new Error(`Could not delete the conversation: ${error.message}`);
}

import { supabase } from "./supabase";
import { Document } from "@prisma/client";

export async function searchDocuments(
	queryEmbedding: number[],
	matchCount: number = 10
): Promise<Document[]> {
	const { data, error } = await supabase.rpc("match_documents", {
		query_embedding: queryEmbedding,
		match_count: matchCount,
	});

	if (error) throw error;
	return data;
}
export async function getDocumentById(id: string): Promise<Document> {
	const { data, error } = await supabase
		.from("document") // Assuming your table is named 'documents'
		.select("*")
		.eq("id", id)
		.single(); // .single() is crucial for getting one record and throwing an error if not found

	if (error) {
		console.error("Error fetching document:", error);
		throw new Error(error.message);
	}

	return data;
}

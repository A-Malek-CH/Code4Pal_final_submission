import { NextResponse } from "next/server";
import { createEmbeddingsWithLangChain } from "@/lib/tools/embed-document";
import { createClient } from "@/lib/supabase-server-client";
import { cookies } from "next/headers";

// Define the expected shape of the request body
interface EmbedRequest {
	sourceId: string;
	content: string;
	metadata: Record<string, any>;
}

// Helper to convert our async generator to a ReadableStream
function iteratorToStream(iterator: AsyncGenerator<Uint8Array, void, unknown>) {
	return new ReadableStream({
		async pull(controller) {
			const { value, done } = await iterator.next();
			if (done) {
				controller.close();
			} else {
				controller.enqueue(value);
			}
		},
	});
}

// API Route to handle the streaming embedding process
export async function POST(request: Request) {
	try {
		const supabase = createClient(cookies());
		const body: EmbedRequest = await request.json();
		const { sourceId, content, metadata } = body;

		// Basic validation
		if (!sourceId || !content || !metadata) {
			return NextResponse.json(
				{ error: "Missing required fields: sourceId, content, or metadata." },
				{ status: 400 }
			);
		}

		// This new generator wraps the core logic and yields typed chunks
		const streamGenerator = async function* () {
			const encoder = new TextEncoder();
			try {
				// 1. Get the original embedding generator
				const embeddingGenerator = createEmbeddingsWithLangChain(
					supabase,
					sourceId,
					content,
					metadata
				);

				// 2. Stream progress updates
				// The result of the generator (the final count) is not directly accessible here,
				// but we can iterate through its progress yields.
				for await (const progressUpdate of embeddingGenerator) {
					// We expect `progressUpdate` to be { progress: number, total: number }
					const chunk = { type: "progress", data: progressUpdate };
					yield encoder.encode(JSON.stringify(chunk) + "\n"); // Add newline as a delimiter
				}

				// 3. After the loop, the embedding and insertion are complete.
				// Now, update the source table.
				const { error: updateError } = await supabase
					.from("source")
					.update({ is_embedded: true })
					.eq("id", sourceId);

				if (updateError) {
					throw new Error(`Failed to update source: ${updateError.message}`);
				}

				// 4. Stream a final completion message
				const finalChunk = {
					type: "complete",
					data: {
						message: "Embeddings created and source updated successfully.",
						sourceId: sourceId,
					},
				};
				yield encoder.encode(JSON.stringify(finalChunk) + "\n");
			} catch (e: any) {
				console.error("Error during embedding stream:", e);
				// 5. Stream an error message if anything fails
				const errorChunk = { type: "error", error: e.message };
				yield encoder.encode(JSON.stringify(errorChunk) + "\n");
			}
		};

		// Convert the generator to a stream and return it
		const stream = iteratorToStream(streamGenerator());
		return new NextResponse(stream, {
			headers: {
				"Content-Type": "application/octet-stream",
				"X-Content-Type-Options": "nosniff",
			},
		});
	} catch (error: any) {
		console.error("API route setup failed:", error);
		return NextResponse.json(
			{
				error: "An internal server error occurred.",
			},
			{ status: 500 }
		);
	}
}

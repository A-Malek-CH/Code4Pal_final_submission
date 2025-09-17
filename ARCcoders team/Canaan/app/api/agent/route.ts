// File: app/api/agent/route.js

import { NextRequest, NextResponse } from "next/server";
import { BackEndRequestBody, handleChatRequest } from "@/ai";
export async function POST(request: NextRequest) {
	try {
		const body: BackEndRequestBody = await request.json();

		const stream = iteratorToStream(
			makeIterator(handleChatRequest({ ...body }))
		);

		// Return the stream as a Next.js response
		return new NextResponse(stream, {
			headers: {
				"Content-Type": "text/plain", // Set the content type for the stream
			},
		});
	} catch (error) {
		console.error("API Error:", error);
		return NextResponse.json(
			{ error: "An internal server error occurred." },
			{ status: 500 }
		);
	}
}
// Generator function to produce chunks of data
async function* makeIterator(
	chatResponse: AsyncGenerator<
		| {
				type: string;
				data: any;
				message?: undefined;
				sources?: undefined;
				error?: undefined;
		  }
		| {
				type: string;
				error: string;
				message?: undefined;
				sources?: undefined;
				data?: undefined;
		  },
		void,
		unknown
	>
) {
	const encoder = new TextEncoder(); // Encoder to convert strings to Uint8Array

	// Iterate over the streaming response
	for await (const chunk of chatResponse) {
		yield encoder.encode(JSON.stringify(chunk)); // Yield each chunk as a Uint8Array
	}
}

// Convert a generator into a ReadableStream
function iteratorToStream(iterator: AsyncGenerator<Uint8Array>) {
	return new ReadableStream({
		async pull(controller) {
			// Get the next value from the generator
			const { value, done } = await iterator.next();

			if (done) {
				// Close the stream if the generator is done
				controller.close();
			} else {
				// Enqueue the value (chunk) into the stream
				controller.enqueue(value);
			}
		},
	});
}

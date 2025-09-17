import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	return new NextResponse(
		JSON.stringify({
			success: true,
		}),
		{
			status: 200,
			headers: { "content-type": "application/json" },
		}
	);
}

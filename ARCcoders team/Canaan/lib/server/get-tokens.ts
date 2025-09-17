"use server";

import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import { authConfig } from "@/config/server-config";

export async function getToken() {
	return await getTokens(cookies(), {
		...authConfig,
	});
}

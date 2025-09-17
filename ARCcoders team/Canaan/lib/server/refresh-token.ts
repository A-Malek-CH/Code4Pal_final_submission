"use server";

import { authConfig } from "@/config/server-config";
import {
	refreshCookiesWithIdToken,
	refreshServerCookies,
} from "next-firebase-auth-edge/next/cookies";
import { cookies, headers } from "next/headers";

export async function refreshToken(token: string) {
	"use server";
	await refreshCookiesWithIdToken(token, headers(), cookies(), authConfig);
	refreshServerCookies(cookies(), headers(), authConfig);
}

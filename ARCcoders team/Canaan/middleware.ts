import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
	authMiddleware,
	redirectToHome,
	redirectToLogin,
} from "next-firebase-auth-edge";
import { authConfig } from "./config/server-config";
import { getFirebaseAuth } from "next-firebase-auth-edge/lib/auth";
import { refreshCookiesWithIdToken } from "next-firebase-auth-edge/next/cookies";

const PUBLIC_PATHS = ["/login", "/", "/register", "/join-us", "/about"];

const { setCustomUserClaims, getUser } = getFirebaseAuth(
	authConfig.serviceAccount,
	authConfig.apiKey
);
// "/games", // For the /posts index page
// /^\/posts\/[^/]+$/, // Matches /posts/any-slug
// /^\/profile\/[^/]+$/, // Matches /profile/any-slug
export async function middleware(request: NextRequest) {
	return authMiddleware(request, {
		loginPath: "/api/login",
		logoutPath: "/api/logout",
		refreshTokenPath: "/api/refresh-token",
		debug: authConfig.debug,
		enableMultipleCookies: authConfig.enableMultipleCookies,
		enableCustomToken: authConfig.enableCustomToken,
		apiKey: authConfig.apiKey,
		cookieName: authConfig.cookieName,
		cookieSerializeOptions: authConfig.cookieSerializeOptions,
		cookieSignatureKeys: authConfig.cookieSignatureKeys,
		serviceAccount: authConfig.serviceAccount,
		tenantId: authConfig.tenantId,
		dynamicCustomClaimsKeys: ["someCustomClaim"],
		handleValidToken: async ({ token, decodedToken, customToken }, headers) => {
			// Authenticated user should not be able to access /login, /register and /reset-password routes
			// console.log("token:", token);
			// console.log("decodedToken:", decodedToken);
			// console.log("customToken:", customToken);
			// check token expiration

			const user = await getUser(decodedToken.uid);
			if (user && (!user.customClaims?.app_role || !user.customClaims?.role)) {
				// 2. Preserve existing claims and only add what's missing.
				// This prevents accidentally demoting an admin or other roles.
				const existingClaims = user.customClaims || {};
				const claimsToSet = {
					...existingClaims,
					app_role: existingClaims.app_role || "user",
					role: existingClaims.role || "authenticated",
				};

				try {
					// Use user.uid for consistency, assuming `user` is the decoded token object.
					await setCustomUserClaims(user.uid, claimsToSet);
				} catch (error: any) {
					return new NextResponse(
						JSON.stringify({
							error: `Failed to set custom claims: ${error.message}`,
							success: false, // Corrected typo
						}),
						{ status: 500 } // Use a 500 status for server errors
					);
				}
			}
			if (request.nextUrl.pathname == "/login") return redirectToHome(request);

			// how to parse slug
			if (
				PUBLIC_PATHS.some((path) => {
					if ((path as any) instanceof RegExp) {
						return (path as any).test(request.nextUrl.pathname);
					}
					return path === request.nextUrl.pathname;
				})
			) {
				return redirectToLogin(request, {
					path: "/login",
					publicPaths: PUBLIC_PATHS,
				});
			}

			return NextResponse.next({
				request: {
					headers,
				},
			});
		},
		handleInvalidToken: async (_reason) => {
			return redirectToLogin(request, {
				path: "/login",
				publicPaths: PUBLIC_PATHS,
			});
		},
		handleError: async (error) => {
			console.error("Unhandled authentication error", { error });

			return redirectToLogin(request, {
				path: "/login",
				publicPaths: PUBLIC_PATHS,
			});
		},
	});
}

export const config = {
	matcher: [
		"/",
		"/((?!_next|favicon.ico|__/auth|__/firebase|api|.*\\.).*)",
		"/api/login",
		"/api/logout",
		"/api/refresh-token",
	],
};

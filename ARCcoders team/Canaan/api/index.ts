import { UserCredential } from "firebase/auth";

export async function login(token: string) {
	const headers: Record<string, string> = {
		Authorization: `Bearer ${token}`,
	};

	const response = await fetch("/api/login", {
		method: "GET",
		headers,
	});

	if (!response.ok) {
		throw new Error("Failed to log in");
	}

	return response.json();
}

export async function loginWithCredential(credential: UserCredential) {
	try {
		const idToken = await credential.user.getIdToken();

		return await login(idToken);
	} catch (error) {
		console.error("Error logging in:", error);
		return null;
	}
}

export async function logout() {
	const headers: Record<string, string> = {};

	await fetch("/api/logout", {
		method: "GET",
		headers,
	});
}

export async function checkEmailVerification() {
	const headers: Record<string, string> = {};

	await fetch("/api/check-email-verification", {
		method: "GET",
		headers,
	});
}

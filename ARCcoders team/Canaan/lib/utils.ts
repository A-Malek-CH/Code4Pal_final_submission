import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
export function formUrlQuery({
	params,
	key,
	value,
}: {
	params: string;
	key: string;
	value: string | null;
}) {
	const currentUrl = qs.parse(params);

	currentUrl[key] = value;

	return qs.stringifyUrl(
		{
			url: window.location.pathname,
			query: currentUrl,
		},
		{ skipNull: true }
	);
}
export function createUrl(pathname: string, params: URLSearchParams | string) {
	const paramsString = params?.toString();
	const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;

	return `${pathname}${queryString}`;
}

export const getLabelPosition = (
	index: number
): "top-left" | "top-right" | "bottom-left" | "bottom-right" => {
	const positions = [
		"top-left",
		"bottom-right",
		"top-right",
		"bottom-left",
	] as const;
	return positions[index % positions.length];
};
export const formatSize = (size: number) => {
	if (size < 1024 * 1024) {
		return `${(size / 1024).toFixed(2)} KB`;
	} else {
		return `${(size / (1024 * 1024)).toFixed(2)} MB`;
	}
};
export function formatId(id: string) {
	return `..${id.substring(id.length - 6)}`;
}
export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
export function formatContent(content: string, limit = 5000) {
	if (content.length < limit) return content;
	else return `${content.slice(0, limit)}....`;
}
/**
 * Fetches an image from a URL and converts it to a Base64 encoded string.
 *
 * @param {string} url The URL of the image to encode.
 * @returns {Promise<string>} A promise that resolves with the Base64 encoded data URL.
 * @throws {Error} If the fetch request fails or the response is not ok.
 */
export async function imageUrlToBase64(url: string): Promise<string> {
	try {
		const startTime = new Date();

		// Dynamically import axios to avoid including it in browser bundles
		const axios = (await import("axios")).default;

		const response = await axios.get(url, {
			responseType: "arraybuffer", // Important to get data as a buffer
		});

		// Get MIME type from the response headers
		const mimeType = response.headers["content-type"];

		// Convert the buffer to a Base64 string
		const base64 = Buffer.from(response.data, "binary").toString("base64");
		const endTime = new Date();

		const timeElapsedMs = endTime.getTime() - startTime.getTime();
		console.log(`Time elapsed: ${timeElapsedMs} milliseconds`);
		// Construct the Data URL
		return `data:${mimeType};base64,${base64}`;
	} catch (error: any) {
		console.error("Node.js - Error converting URL to Base64:", error.message);
		throw error;
	}
}

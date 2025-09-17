import { createBrowserClient } from "@supabase/ssr";
import { getToken } from "../server/get-tokens";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function createClient() {
	return createBrowserClient(supabaseUrl, supabaseAnonKey, {
		accessToken: async () => {
			const token = await getToken();
			return token?.token ?? null;
		},
	});
}

export const supabase = createClient();

import { createBrowserClient } from "@supabase/ssr";
const NEXT_PUBLIC_SUPABASE_URL = "https://txmradbmczmjvsdqapif.supabase.co";
const NEXT_PUBLIC_SUPABASE_ANON_KEY =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4bXJhZGJtY3ptanZzZHFhcGlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNjc3MzgsImV4cCI6MjA3MDc0MzczOH0.1Bt72McSaofJatygtJdvEaQC5wIXXD2TbL_rXJd8HN8";
const supabaseUrl = NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function createClient() {
	return createBrowserClient(supabaseUrl, supabaseAnonKey, {});
}

export const supabase = createClient();

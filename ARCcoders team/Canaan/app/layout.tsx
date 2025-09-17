import type { Metadata } from "next";
import { Work_Sans, Open_Sans } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/query-client";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/components/firebase-auth/AuthProvider";
import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import { authConfig } from "@/config/server-config";
import { toUser } from "@/shared/user";
import { ThemeProvider } from "@/components/theme-provider";
const workSans = Work_Sans({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-work-sans",
	weight: ["400", "600", "700"],
});

const openSans = Open_Sans({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-open-sans",
	weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
	title: "Historical Insights Dashboard",
	description: "Manage complex historical data relationships and research",
	generator: "v0.app",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const tokens = await getTokens(cookies(), {
		...authConfig,
	});
	const user = tokens ? await toUser(tokens) : null;

	return (
		<html lang="en">
			<body
				suppressHydrationWarning
				className={cn(
					workSans.variable,
					openSans.variable,
					"antialiased min-h-screen"
				)}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<main data-vaul-drawer-wrapper="true">
						<QueryProvider>
							<AuthProvider user={user}>
								{/* <Header collections={collections} /> */}
								{children}
								<Toaster />
							</AuthProvider>
						</QueryProvider>
					</main>
				</ThemeProvider>
			</body>
		</html>
	);
}
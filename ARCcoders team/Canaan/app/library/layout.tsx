import Navbar from "@/components/library/Navbar";

export default function LibraryLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// 3. I apply the current theme as a class to the root div.
	// This is the most important part. When the theme is 'dark', this div
	// will have the class "dark", which your CSS can use to change colors.
	return (
		<div>
			{/* 4. We now pass the REAL state and function to the Navbar. */}
			<Navbar />

			{/* This main element will now respond to the theme change. */}
			<main className="pt-16 bg-background text-foreground min-h-screen">
				{/* The page content (children) is rendered inside */}
				{children}
			</main>
		</div>
	);
}

import { Header } from "@/components/layout/header";
import { PageLayout } from "@/components/layout/page-layout";
import { cn } from "@/lib/utils";

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const collections: any[] = [
		{ handle: "/games", title: "Games" },
		{ handle: "/library", title: "Library" },
		{ handle: "/agent", title: "Agent" },
		{ handle: "/about-us", title: "AboutUs" },
		{ handle: "/faq", title: "FAQ" },
	];

	return (
		<section className="relative photography-banner">
			<Header collections={collections} />
			<PageLayout collections={collections}>{children}</PageLayout>
			{/* </div> */}
		</section>
	);
}

import { Header } from "@/components/layout/header";
import { PageLayout } from "@/components/layout/page-layout";
import { GridPattern } from "@/components/shapes/grid";
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
			{/* <div className="relative flex size-full  border bg-background"> */}
			<GridPattern
				x={-1}
				y={-1}
				className={cn(
					"[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] "
				)}
			/>
			<Header collections={collections} />
			<PageLayout collections={collections}>{children}</PageLayout>
			{/* </div> */}
		</section>
	);
}

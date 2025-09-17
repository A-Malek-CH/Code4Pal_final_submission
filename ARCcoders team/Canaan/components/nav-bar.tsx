"use client";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { MenuIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import { AuthStatus } from "@/components/auth.status";

gsap.registerPlugin(ScrollTrigger);

function NavBar() {
	const main = useRef<HTMLDivElement | null>(null);

	useLayoutEffect(() => {
		if (!main.current) return;

		const ctx = gsap.context(() => {
			const triggerElement = main.current;

			gsap
				.timeline({
					scrollTrigger: {
						trigger: triggerElement,
						start: "100px top", // Starts when top of element hits top of viewport (page Y=0)
						end: "bottom bottom", // Ends when middle of page reaches top of viewport
						scrub: 1,
					},
				})
				.to(triggerElement, {
					backgroundColor: "rgba(10, 10, 15, 0.8)",
					backdropFilter: "blur(10px)",
					boxShadow:
						"0 5px 20px -5px rgba(255, 0, 255, 0.3), 0 5px 20px -5px rgba(0, 247, 255, 0.2)",
					borderBottom: "1px solid rgba(255, 0, 255, 0.3)",
					duration: 1,
				});
		}, main);

		return () => ctx.revert();
	}, [main.current]);

	return (
		<header
			className="flex fixed top-0  left-0 right-0 z-50 h-20 w-full shrink-0 items-center px-4 md:px-6 transition-all duration-300"
			ref={main}
			style={{
				background: "rgba(10, 10, 15, 0.4)",
				backdropFilter: "blur(5px)",
			}}
		>
			<Sheet>
				<SheetTrigger asChild>
					<Button
						variant="outline"
						size="icon"
						className="lg:hidden  bg-transparent border-none text-primary h-12 w-12 hover:bg-background/70 group"
						style={{
							boxShadow:
								"0 0 10px rgba(255, 0, 255, 0.2), 0 0 15px rgba(0, 247, 255, 0.1)",
						}}
					>
						<MenuIcon className="h-10 w-10 group-hover:text-primary/70 transition-colors" />
						<span className="sr-only">Toggle navigation menu</span>
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className=" backdrop-blur-md border-r ">
					<Link
						href="/"
						className="flex items-center gap-2 font-mono text-xl"
						prefetch={false}
					>
						<History size={40} />
					</Link>
					<div className="grid gap-4 py-8">
						{[
							{ label: "Home", href: "/" },
							{ label: "About", href: "/about" },
							{ label: "Games", href: "/games" },
							{ label: "Join Us", href: "/join-us" },
						].map((item, index) => (
							<Link
								key={item.label}
								href={item.href}
								className="group flex w-full items-center py-2 text-lg font-mono"
								prefetch={false}
								style={{
									animationDelay: `${0.1 * index}s`,
									color: "#f0f0f0",
								}}
							>
								<span className="relative overflow-hidden group-hover:text-cyan-300 transition-colors">
									{item.label}
									<span
										className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
										style={{
											background: "linear-gradient(to right, #ff00ff, #00f7ff)",
										}}
									/>
								</span>
							</Link>
						))}
					</div>
				</SheetContent>
			</Sheet>

			<div className="lg:hidden ml-auto">
				<AuthStatus />
			</div>
			<Link
				href="/"
				className="mr-6 hidden lg:flex items-center gap-2 group"
				prefetch={false}
			>
				<History size={40} />
			</Link>
			<nav className="ml-auto hidden lg:flex gap-6">
				{[
					{ label: "Home", href: "/" },
					{ label: "About", href: "/about" },
					{ label: "Posts", href: "/games" },
					{ label: "Join Us", href: "/join-us" },
				].map((item) => (
					<Link
						key={item.label}
						href={item.href}
						className="relative group flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium font-mono transition-colors"
						prefetch={false}
					>
						<span className="relative z-10 text-primary group-hover:text-primary/70 transition-colors">
							{item.label}
						</span>
						<span className="absolute bottom-0 left-0 right-0 h-[1px] w-0 group-hover:w-full transition-all duration-300" />
					</Link>
				))}
				<AuthStatus />
			</nav>
		</header>
	);
}

export default NavBar;

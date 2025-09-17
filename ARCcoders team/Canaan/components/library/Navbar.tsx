"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Moon, Sun, X } from "lucide-react";

import { cn } from "@/lib/utils"; // Assumes you have a `cn` utility
import { Button } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import ThemeIndicator from "../theme-indicator";

const libraryNavItems: { title: string; href: string; description: string }[] =
	[
		{
			title: "Events",
			href: "/library/events",
			description: "Explore significant historical events and their timelines.",
		},
		{
			title: "Actors",
			href: "/library/actors",
			description: "Learn about the key figures, groups, and organizations.",
		},
		{
			title: "Locations",
			href: "/library/locations",
			description:
				"Discover important places and their stories across the map.",
		},
	];

export default function Navbar() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
	const pathname = usePathname();

	// Close mobile menu on route change
	React.useEffect(() => {
		if (isMobileMenuOpen) {
			setIsMobileMenuOpen(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname]);

	// Lock body scroll when mobile menu is open
	React.useEffect(() => {
		if (isMobileMenuOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
		return () => {
			document.body.style.overflow = "auto";
		};
	}, [isMobileMenuOpen]);

	return (
		<header className="fixed top-5  left-0 right-0 z-50">
			<nav className="container mx-auto px-4 sm:px-6 lg:px-8 ">
				<div className="flex items-center justify-between h-16 border-b border-border/60 bg-background/80 backdrop-blur-md rounded-full px-6 shadow-sm  ">
					{/* Logo */}
					<Link
						href="/library"
						className="text-2xl font-bold text-primary tracking-tight"
					>
						Palestine
						<span className="font-light text-muted-foreground">History</span>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center gap-4">
						<NavigationMenu>
							<NavigationMenuList>
								<NavigationMenuItem>
									<NavigationMenuTrigger>Explore</NavigationMenuTrigger>
									<NavigationMenuContent>
										<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
											{libraryNavItems.map((item) => (
												<ListItem
													key={item.title}
													title={item.title}
													href={item.href}
												>
													{item.description}
												</ListItem>
											))}
										</ul>
									</NavigationMenuContent>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<Link href="/library/map" legacyBehavior passHref>
										<NavigationMenuLink
											className={navigationMenuTriggerStyle()}
										>
											Map
										</NavigationMenuLink>
									</Link>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<Link href="/" legacyBehavior passHref>
										<NavigationMenuLink
											className={navigationMenuTriggerStyle()}
										>
											Home
										</NavigationMenuLink>
									</Link>
								</NavigationMenuItem>
							</NavigationMenuList>
						</NavigationMenu>
						<ThemeIndicator />
					</div>

					{/* Mobile Navigation */}
					<div className="md:hidden flex items-center">
						<ThemeIndicator />
						<Button
							onClick={() => setIsMobileMenuOpen(true)}
							variant="ghost"
							size="icon"
							className="ml-2"
							aria-label="Open mobile menu"
						>
							<Menu className="h-6 w-6" />
						</Button>
					</div>
				</div>
			</nav>

			{/* Mobile Menu Panel */}
			<AnimatePresence>
				{isMobileMenuOpen && (
					<>
						{/* Backdrop */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3, ease: "easeInOut" }}
							className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
							onClick={() => setIsMobileMenuOpen(false)}
						/>
						{/* Menu */}
						<motion.div
							initial={{ x: "100%" }}
							animate={{ x: 0 }}
							exit={{ x: "100%" }}
							transition={{ duration: 0.3, ease: "easeInOut" }}
							className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-background shadow-lg"
						>
							<div className="flex flex-col h-full p-6">
								<div className="flex items-center justify-between mb-8">
									<Link
										href="/library"
										className="text-xl font-bold text-primary tracking-tight"
									>
										Pales
										<span className="font-light text-muted-foreground">
											History
										</span>
									</Link>
									<Button
										onClick={() => setIsMobileMenuOpen(false)}
										variant="ghost"
										size="icon"
										aria-label="Close mobile menu"
									>
										<X className="h-6 w-6" />
									</Button>
								</div>
								<nav className="flex flex-col space-y-4">
									{[
										...libraryNavItems,
										{ title: "Map", href: "/library/map" },
									].map((item) => (
										<Link
											key={item.href}
											href={item.href}
											className="text-lg font-medium text-foreground transition-colors hover:text-primary"
										>
											{item.title}
										</Link>
									))}
								</nav>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</header>
	);
}

// Reusable ListItem component for dropdowns
const ListItem = React.forwardRef<
	React.ElementRef<"a">,
	React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<a
					ref={ref}
					className={cn(
						"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
						className
					)}
					{...props}
				>
					<div className="text-sm font-medium leading-none">{title}</div>
					<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
						{children}
					</p>
				</a>
			</NavigationMenuLink>
		</li>
	);
});
ListItem.displayName = "ListItem";

"use client";

import * as React from "react";
import Link from "next/link";
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react";

import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { LogoSvg } from "@/components/icons/logo-svg";
import ThemeIndicator from "@/components/theme-indicator";
import { AuthStatus, navItems } from "@/components/auth.status";

const components: { title: string; href: string; description: string }[] = [
	{
		title: "Historical Quizzes",
		href: "/games/quiz",
		description:
			"Test what you know, challenge what you think, and learn something new about Palestine",
	},
	{
		title: "Map Discovery",
		href: "/games/map",
		description:
			"Explore Palestine through maps that reveal its places and stories",
	},
];

export function NavigationMenuLarge() {
	return (
		<NavigationMenu className="justify-end items-center ">
			<NavigationMenuList className="bg-background/50 drop-shadow-lg backdrop-blur-lg p-2 rounded-full">
				<NavigationMenuItem>
					<NavigationMenuTrigger>Home</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
							<li className="row-span-3">
								<NavigationMenuLink
									className="[&_svg:not([class*='size-'])]:size-32"
									asChild
								>
									<a
										className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
										href="/"
									>
										<LogoSvg />

										<p className="text-muted-foreground text-sm leading-tight">
											Refined. Minimal. Never boring.
										</p>
									</a>
								</NavigationMenuLink>
							</li>
							<ListItem href="/library" title="Library">
								Explore a living archive of voices, images, and documents that
								preserve the truth
							</ListItem>
							<ListItem href="/faq" title="FAQ">
								See The Common Asked Questions
							</ListItem>
							<ListItem href="/about" title="About-us">
								Who we Are, And What's our Goal
							</ListItem>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Games</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
							{components.map((component) => (
								<ListItem
									key={component.title}
									title={component.title}
									href={component.href}
								>
									{component.description}
								</ListItem>
							))}
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
						<Link href="/agent">Agent</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>

				<NavigationMenuItem asChild>
					<ThemeIndicator />
				</NavigationMenuItem>
				<AuthStatus
					ItemsRender={() => (
						<React.Fragment>
							{navItems.map((item) => (
								<NavigationMenuItem key={item.href}>
									<NavigationMenuLink
										asChild
										className={navigationMenuTriggerStyle()}
									>
										<Link href={item.href}>{item.label}</Link>
									</NavigationMenuLink>
								</NavigationMenuItem>
							))}
						</React.Fragment>
					)}
				/>
			</NavigationMenuList>
		</NavigationMenu>
	);
}

function ListItem({
	title,
	children,
	href,
	...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
	return (
		<li {...props}>
			<NavigationMenuLink asChild>
				<Link href={href}>
					<div className="text-sm leading-none font-medium">{title}</div>
					<p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
						{children}
					</p>
				</Link>
			</NavigationMenuLink>
		</li>
	);
}

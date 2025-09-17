"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Added AvatarImage
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { getFirebaseAuth } from "@/components/firebase-auth/firebase";
import { useLoadingCallback } from "react-loading-hook";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useAuth } from "@/components/firebase-auth/AuthContext";
import { logout } from "@/api";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export const navItems = [
	{
		label: "Login",
		href: "/login",
	},
	{
		label: "Register",
		href: "/register",
	},
];

export function AuthStatus({
	ItemsRender,
}: {
	ItemsRender?: () => JSX.Element;
}) {
	const router = useRouter();
	const { user } = useAuth();
	const isMobile = useIsMobile();

	const [handleLogout, isLogoutLoading] = useLoadingCallback(async () => {
		const auth = getFirebaseAuth();
		await signOut(auth);
		await logout();
		router.push("/login?redirect=/");
	});

	if (!user) {
		if (!ItemsRender) return null;

		return ItemsRender();
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="relative h-10 w-10 rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
				>
					<Avatar className="h-10 w-10 border-2 border-border transition-colors hover:border-ring">
						{user?.photo_url ? (
							<AvatarImage
								className="object-cover"
								src={user.photo_url}
								alt={user.display_name || "User"}
							/>
						) : null}
						<AvatarFallback className="font-semibold bg-muted text-muted-foreground">
							{user?.display_name?.charAt(0).toUpperCase()}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className="w-64 backdrop-blur-md shadow-lg border-border"
			>
				<DropdownMenuLabel className="px-3 py-2">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium text-foreground">
							{user?.display_name}
						</p>
						<p className="text-xs text-muted-foreground">{user?.email}</p>
						<p className="text-xs font-semibold capitalize text-primary">
							{user &&
								(user?.custom_claims?.app_role as any) &&
								(user.custom_claims.app_role as string).toUpperCase()}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator className="bg-border" />
				<DropdownMenuItem
					asChild
					className="focus:bg-accent focus:text-accent-foreground cursor-pointer"
				>
					<Link href="/profile" className="flex items-center px-3 py-2 text-sm">
						<User className="mr-2 h-4 w-4" />
						Profile
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator className="bg-border" />
				<DropdownMenuItem
					className="focus:bg-destructive/10 focus:text-destructive text-destructive cursor-pointer"
					disabled={isLogoutLoading}
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						handleLogout();
					}}
				>
					<div className="flex items-center px-3 py-2 text-sm">
						<LogOut className="mr-2 h-4 w-4" />
						Log out
					</div>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

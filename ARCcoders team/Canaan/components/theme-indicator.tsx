"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import useMounted from "@/hooks/use-mounted";

function ThemeIndicator() {
	const { theme, setTheme } = useTheme();
	const [isRotating, setIsRotating] = useState(false);
	const { mounted } = useMounted();

	const handleClick = () => {
		setIsRotating(true);
		setTheme(
			theme === "system" ? "dark" : theme === "dark" ? "light" : "system"
		);
	};

	useEffect(() => {
		if (isRotating) {
			const timer = setTimeout(() => setIsRotating(false), 300);
			return () => clearTimeout(timer);
		}
	}, [isRotating]);

	// On the server and during the initial client render, this will be false.
	// We return null to avoid a hydration mismatch.
	if (!mounted) {
		// You can also return a placeholder skeleton here if you prefer
		return <div className="h-10 w-10" />; // Example placeholder
	}
	const getIcon = () => {
		switch (theme) {
			case "dark":
				return <Moon className="h-[1.2rem] w-[1.2rem]" />;
			case "light":
				return <Sun className="h-[1.2rem] w-[1.2rem]" />;
			case "system":
				return <Monitor className="h-[1.2rem] w-[1.2rem]" />;
			default:
				return <Sun className="h-[1.2rem] w-[1.2rem]" />;
		}
	};

	return (
		<Button
			variant="outline"
			size="icon"
			onClick={handleClick}
			className={`rounded-full transition-transform duration-300 ease-in-out ${
				isRotating ? "rotate-180" : ""
			}`}
		>
			<div
				className={`transition-opacity duration-300 ease-in-out ${
					isRotating ? "opacity-0" : "opacity-100"
				}`}
			>
				{getIcon()}
			</div>
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}

export default ThemeIndicator;

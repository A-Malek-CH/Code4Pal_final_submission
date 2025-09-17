"use client";
import { Copy } from "lucide-react";

// Helper component for a single color swatch
const ColorSwatch = ({ name, value }: { name: string; value: string }) => {
	// A utility to determine if the background is dark, to adjust text color
	const isDark = () => {
		const hslParts = value.split(" ").map(parseFloat);
		// A simple lightness check (L part of HSL)
		return hslParts.length === 3 && hslParts[2] < 50;
	};

	return (
		<div className="flex items-center justify-between rounded-md border border-border p-3 text-sm">
			<div className="flex items-center gap-3">
				<div
					className="h-8 w-8 rounded-md border border-border/50"
					style={{ backgroundColor: `hsl(${value})` }}
				/>
				<code className="font-semibold text-foreground">{name}</code>
			</div>
			<div className="flex items-center gap-2">
				<code className="text-muted-foreground">{value}</code>
				<button
					onClick={() => navigator.clipboard.writeText(name)}
					className="text-muted-foreground hover:text-foreground transition-colors"
					title={`Copy ${name}`}
				>
					<Copy className="h-4 w-4" />
				</button>
			</div>
		</div>
	);
};

// Helper component for non-color variables like fonts, shadows, and sizes
const NonColorVariableCard = ({
	name,
	value,
	type,
}: {
	name: string;
	value: string;
	type: "font" | "size" | "shadow";
}) => {
	const renderPreview = () => {
		switch (type) {
			case "font":
				return (
					<p className="text-lg" style={{ fontFamily: `var(${name})` }}>
						The quick brown fox jumps over the lazy dog.
					</p>
				);
			case "shadow":
				return (
					<div
						className="h-16 w-full rounded-md bg-card"
						style={{ boxShadow: `var(${name})` }}
					/>
				);
			case "size":
				return (
					<div
						className="h-4 bg-primary"
						style={{
							width: `var(${name})`,
							borderRadius: name.includes("radius") ? `var(${name})` : "0",
						}}
					/>
				);
		}
	};

	return (
		<div className="rounded-md border border-border p-4">
			<div className="flex items-center justify-between text-sm mb-3">
				<code className="font-semibold text-foreground">{name}</code>
				<code className="text-muted-foreground">{value}</code>
			</div>
			<div className="rounded-md bg-muted/50 p-4">{renderPreview()}</div>
		</div>
	);
};

// The main page component
export default function ColorsPage() {
	// Manually parsed variables from your CSS for easy mapping
	const variables = {
		core: [
			"background",
			"foreground",
			"card",
			"card-foreground",
			"popover",
			"popover-foreground",
			"primary",
			"primary-foreground",
			"secondary",
			"secondary-foreground",
			"muted",
			"muted-foreground",
			"accent",
			"accent-foreground",
			"destructive",
			"destructive-foreground",
			"border",
			"input",
			"ring",
		],
		chart: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"],
		sidebar: [
			"sidebar",
			"sidebar-foreground",
			"sidebar-primary",
			"sidebar-primary-foreground",
			"sidebar-accent",
			"sidebar-accent-foreground",
			"sidebar-border",
			"sidebar-ring",
			"sidebar-background",
		],
		fonts: ["font-sans", "font-serif", "font-mono"],
		sizing: [
			"radius",
			"spacing",
			"sides",
			"modal-sides",
			"top-spacing",
			"tracking-normal",
		],
		shadows: [
			"shadow-2xs",
			"shadow-xs",
			"shadow-sm",
			"shadow",
			"shadow-md",
			"shadow-lg",
			"shadow-xl",
			"shadow-2xl",
		],
	};

	// Manually parsed values for demonstration. In a real app, these are read from CSS.
	const lightValues: { [key: string]: string } = {
		"--background": "208 100% 97.0588%",
		"--foreground": "216.9231 19.1176% 26.6667%",
		"--card": "0 0% 100%",
		"--card-foreground": "216.9231 19.1176% 26.6667%",
		"--popover": "0 0% 100%",
		"--popover-foreground": "216.9231 19.1176% 26.6667%",
		"--primary": "142.0859 70.5628% 45.2941%",
		"--primary-foreground": "0 0% 100%",
		"--secondary": "204 93.75% 93.7255%",
		"--secondary-foreground": "215 13.7931% 34.1176%",
		"--muted": "220 14.2857% 95.8824%",
		"--muted-foreground": "220 8.9362% 46.0784%",
		"--accent": "149.2683 80.3922% 90%",
		"--accent-foreground": "216.9231 19.1176% 26.6667%",
		"--destructive": "0 84.2365% 60.1961%",
		"--destructive-foreground": "0 0% 100%",
		"--border": "220 13.0435% 90.9804%",
		"--input": "220 13.0435% 90.9804%",
		"--ring": "142.0859 70.5628% 45.2941%",
		"--chart-1": "142.0859 70.5628% 45.2941%",
		"--chart-2": "160.1183 84.0796% 39.4118%",
		"--chart-3": "161.3793 93.5484% 30.3922%",
		"--chart-4": "162.931 93.5484% 24.3137%",
		"--chart-5": "163.1461 88.1188% 19.8039%",
		"--sidebar": "204 93.75% 93.7255%",
		"--sidebar-foreground": "216.9231 19.1176% 26.6667%",
		"--sidebar-primary": "142.0859 70.5628% 45.2941%",
		"--sidebar-primary-foreground": "0 0% 100%",
		"--sidebar-accent": "149.2683 80.3922% 90%",
		"--sidebar-accent-foreground": "216.9231 19.1176% 26.6667%",
		"--sidebar-border": "220 13.0435% 90.9804%",
		"--sidebar-ring": "142.0859 70.5628% 45.2941%",
		"--sidebar-background": "208 100% 97.0588%",
		"--font-sans": "DM Sans, sans-serif",
		"--font-serif": "Lora, serif",
		"--font-mono": "IBM Plex Mono, monospace",
		"--radius": "0.5rem",
		"--shadow-2xs": "0px 4px 8px -1px hsl(0 0% 0% / 0.05)",
		"--shadow-xs": "0px 4px 8px -1px hsl(0 0% 0% / 0.05)",
		"--shadow-sm":
			"0px 4px 8px -1px hsl(0 0% 0% / 0.1), 0px 1px 2px -2px hsl(0 0% 0% / 0.1)",
		"--shadow":
			"0px 4px 8px -1px hsl(0 0% 0% / 0.1), 0px 1px 2px -2px hsl(0 0% 0% / 0.1)",
		"--shadow-md":
			"0px 4px 8px -1px hsl(0 0% 0% / 0.1), 0px 2px 4px -2px hsl(0 0% 0% / 0.1)",
		"--shadow-lg":
			"0px 4px 8px -1px hsl(0 0% 0% / 0.1), 0px 4px 6px -2px hsl(0 0% 0% / 0.1)",
		"--shadow-xl":
			"0px 4px 8px -1px hsl(0 0% 0% / 0.1), 0px 8px 10px -2px hsl(0 0% 0% / 0.1)",
		"--shadow-2xl": "0px 4px 8px -1px hsl(0 0% 0% / 0.25)",
		"--tracking-normal": "0em",
		"--spacing": "0.25rem",
		"--sides": "1.5rem",
		"--modal-sides": "1rem",
		"--top-spacing": "9rem",
	};
	const darkValues: { [key: string]: string } = {
		"--background": "222.2222 47.3684% 11.1765%",
		"--foreground": "216 12.1951% 83.9216%",
		"--card": "217.2414 32.5843% 17.451%",
		"--card-foreground": "216 12.1951% 83.9216%",
		"--popover": "217.2414 32.5843% 17.451%",
		"--popover-foreground": "216 12.1951% 83.9216%",
		"--primary": "158.1132 64.3725% 51.5686%",
		"--primary-foreground": "222.2222 47.3684% 11.1765%",
		"--secondary": "217.7778 23.0769% 22.9412%",
		"--secondary-foreground": "240 5.0279% 64.902%",
		"--muted": "217.2414 32.5843% 17.451%",
		"--muted-foreground": "220 8.9362% 46.0784%",
		"--accent": "216.9231 19.1176% 26.6667%",
		"--accent-foreground": "240 5.0279% 64.902%",
		"--destructive": "0 84.2365% 60.1961%",
		"--destructive-foreground": "222.2222 47.3684% 11.1765%",
		"--border": "215 13.7931% 34.1176%",
		"--input": "215 13.7931% 34.1176%",
		"--ring": "158.1132 64.3725% 51.5686%",
		"--chart-1": "158.1132 64.3725% 51.5686%",
		"--chart-2": "172.4551 66.0079% 50.3922%",
		"--chart-3": "142.0859 70.5628% 45.2941%",
		"--chart-4": "160.1183 84.0796% 39.4118%",
		"--chart-5": "161.3793 93.5484% 30.3922%",
		"--sidebar": "217.2414 32.5843% 17.451%",
		"--sidebar-foreground": "216 12.1951% 83.9216%",
		"--sidebar-primary": "158.1132 64.3725% 51.5686%",
		"--sidebar-primary-foreground": "222.2222 47.3684% 11.1765%",
		"--sidebar-accent": "216.9231 19.1176% 26.6667%",
		"--sidebar-accent-foreground": "240 5.0279% 64.902%",
		"--sidebar-border": "215 13.7931% 34.1176%",
		"--sidebar-ring": "158.1132 64.3725% 51.5686%",
		"--sidebar-background": "222.2222 47.3684% 11.1765%",
	};

	return (
		<main className="container mx-auto px-4 py-12">
			<div className="text-center mb-12">
				<h1 className="text-4xl font-bold tracking-tight">
					Theme Color Palette
				</h1>
				<p className="mt-2 text-lg text-muted-foreground">
					A visual guide to all CSS variables defined in the theme. This page
					itself is styled using these variables.
				</p>
			</div>

			<div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
				{/* LIGHT THEME COLUMN */}
				<div className="light space-y-10">
					<h2 className="text-3xl font-bold border-b pb-2">Light Theme</h2>
					{Object.entries(variables).map(([groupName, varNames]) => (
						<section key={groupName}>
							<h3 className="text-xl font-semibold mb-4 capitalize">
								{groupName}
							</h3>
							<div className="space-y-3">
								{varNames.map((name) => {
									const fullName = `--${name}`;
									const value =
										lightValues[fullName] ?? darkValues[fullName] ?? ""; // Fallback for shared values
									if (groupName === "fonts")
										return (
											<NonColorVariableCard
												key={name}
												name={fullName}
												value={value}
												type="font"
											/>
										);
									if (groupName === "sizing")
										return (
											<NonColorVariableCard
												key={name}
												name={fullName}
												value={value}
												type="size"
											/>
										);
									if (groupName === "shadows")
										return (
											<NonColorVariableCard
												key={name}
												name={fullName}
												value={value}
												type="shadow"
											/>
										);
									return (
										<ColorSwatch key={name} name={fullName} value={value} />
									);
								})}
							</div>
						</section>
					))}
				</div>

				{/* DARK THEME COLUMN */}
				<div className="dark space-y-10 rounded-xl bg-background p-6 border">
					<h2 className="text-3xl font-bold border-b pb-2 text-foreground">
						Dark Theme
					</h2>
					{Object.entries(variables).map(([groupName, varNames]) => (
						<section key={groupName + "-dark"}>
							<h3 className="text-xl font-semibold mb-4 capitalize text-foreground">
								{groupName}
							</h3>
							<div className="space-y-3">
								{varNames.map((name) => {
									const fullName = `--${name}`;
									const value =
										darkValues[fullName] ?? lightValues[fullName] ?? ""; // Fallback for shared values
									if (groupName === "fonts")
										return (
											<NonColorVariableCard
												key={name}
												name={fullName}
												value={value}
												type="font"
											/>
										);
									if (groupName === "sizing")
										return (
											<NonColorVariableCard
												key={name}
												name={fullName}
												value={value}
												type="size"
											/>
										);
									if (groupName === "shadows")
										return (
											<NonColorVariableCard
												key={name}
												name={fullName}
												value={value}
												type="shadow"
											/>
										);
									return (
										<ColorSwatch key={name} name={fullName} value={value} />
									);
								})}
							</div>
						</section>
					))}
				</div>
			</div>
		</main>
	);
}

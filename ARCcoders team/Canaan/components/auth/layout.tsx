import type React from "react";

interface AuthLayoutProps {
	children: React.ReactNode;
	title: string;
	subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
	return (
		<div className="min-h-screen flex">
			{/* Left side - Form */}
			<div className="flex-1 flex items-center justify-center p-8 bg-background">
				<div className="w-full max-w-md">
					<div className="text-center mb-8">
						<h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
						<p className="text-muted-foreground">{subtitle}</p>
					</div>
					{children}
				</div>
			</div>

			{/* Right side - Palestine illustration */}
			<div className="hidden lg:flex flex-1 bg-gradient-to-br from-green-50 to-red-50 dark:from-green-950 dark:to-red-950 items-center justify-center p-8">
				<div className="max-w-2xl w-full">
					<img
						src="/palestine-illustration.png"
						alt="Palestine illustration with traditional architecture and cultural elements"
						className="w-full h-auto object-contain"
					/>
					<div className="text-center mt-8">
						<h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
							Welcome to Palestine
						</h2>
						<p className="text-green-700 dark:text-green-300">
							Connecting hearts and heritage through technology
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

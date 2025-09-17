import Link from "next/link";
import { ArrowRight, HelpCircle, Map } from "lucide-react";

// We can add an Icon component to our data structure for a richer UI
const games: {
	title: string;
	href: string;
	description: string;
	icon: React.ElementType; // The type for a React component
}[] = [
	{
		title: "Historical Quizzes",
		href: "/games/quiz",
		description:
			"Test what you know, challenge what you think, and learn something new about Palestine's rich history.",
		icon: HelpCircle,
	},
	{
		title: "Map Discovery",
		href: "/games/map",
		description:
			"Explore an interactive map of Palestine, uncovering key locations, stories, and historical significance.",
		icon: Map,
	},
	// You can easily add more games here in the future
	// {
	// 	title: "Timeline Challenge",
	// 	href: "/games/timeline",
	// 	description: "Place historical events in the correct order to build a complete picture of the past.",
	// 	icon: GanttChartSquare,
	// },
];

export default function GamesHubPage() {
	return (
		<main className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
			{/* Page Header */}
			<div className="text-center mb-12">
				<h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
					Games Hub
				</h1>
				<p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
					Engage with history in a new way. Choose a game below to start your
					interactive journey.
				</p>
			</div>

			{/* Games Grid */}
			<div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-4xl mx-auto">
				{games.map((game) => {
					const Icon = game.icon;
					return (
						<Link
							key={game.title}
							href={game.href}
							className="group block rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
						>
							<div className="flex flex-col justify-between h-full p-6">
								<div>
									<div className="mb-4">
										<Icon
											className="h-10 w-10 text-primary"
											strokeWidth={1.5}
										/>
									</div>
									<h2 className="text-xl font-semibold tracking-tight text-foreground">
										{game.title}
									</h2>
									<p className="mt-2 text-muted-foreground">
										{game.description}
									</p>
								</div>
								<div className="mt-6 flex items-center font-medium text-primary transition-transform group-hover:translate-x-1">
									Play Now
									<ArrowRight className="ml-2 h-4 w-4" />
								</div>
							</div>
						</Link>
					);
				})}
			</div>
		</main>
	);
}

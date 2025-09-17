import { GameResultTester } from "@/components/game-result-tester";

export default function HomePage() {
	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto py-8">
				<div className="max-w-4xl mx-auto">
					<div className="text-center mb-8">
						<h1 className="text-4xl font-bold text-foreground mb-2">
							Achievement Testing Dashboard
						</h1>
						<p className="text-muted-foreground">
							Generate game results and test achievement unlocks
						</p>
					</div>
					<GameResultTester />
				</div>
			</div>
		</div>
	);
}

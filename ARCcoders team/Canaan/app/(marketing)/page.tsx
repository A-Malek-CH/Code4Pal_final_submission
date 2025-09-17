import { HomeSidebar } from "@/components/layout/sidebar/home-sidebar";
import LevelDrop from "@/components/gamification/level-drop";
import { HelpCircle, MapPin } from "lucide-react";

const featuredGames = [
	{
		id: "2",
		title: "History Quiz",
		handle: "/games/quiz",
		description: "Journey through time with this comprehensive history quiz.",
		icon: <HelpCircle />,
	},
	{
		id: "3",
		title: "Map Discovery",
		handle: "/games/map",
		description:
			"Learn about historical discoveries and significant places on the map.",
		icon: <MapPin />,
	},
];
export default async function Home() {
	return (
		<div className="flex">
			<div className="w-full">
				<LevelDrop />
				<section className="info-section">
					<HomeSidebar games={featuredGames} />

					<div className="right-part">
						<img
							src="/olive-branch.png"
							alt="Olive Branch"
							className="hero-image"
						/>

						<div className="leaf-container">
							{Array.from({ length: 25 }, (_, i) => {
								const width = Math.random() * 15 + 5; // Leaves are 5px to 20px wide

								return (
									<div
										key={i}
										className="leaf"
										style={{
											// --- Leaf-like Properties ---
											width: `${width}px`,
											height: `${width * 0.4}px`, // Height is proportional to width
											transform: `rotate(${Math.random() * 360}deg)`,

											// --- Animation & Position Properties ---
											left: `${Math.random() * 100}%`,
											animationDuration: `${Math.random() * 15 + 10}s`, // 10s to 25s
											animationDelay: `${Math.random() * 10}s`,
										}}
									/>
								);
							})}
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}

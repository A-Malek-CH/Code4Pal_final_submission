import HeroAreaLinks from "../hero-area-links";
import AnimatedText from "./animated-text";

interface HomeSidebarProps {
	games: any[];
}

export function HomeSidebar({ games }: HomeSidebarProps) {
	return (
		<aside className="col-span-4 h-screen md:sticky top-0 p-sides pt-top-spacing flex flex-col justify-between flex-1">
			<div className="space-y-6">
				<div className="space-y-4">
					<h1 className="text-3xl font-bold  text-foreground">
						Khazal Al-Majidi
					</h1>

					<div className="space-y-3 text-base leading-relaxed">
						<AnimatedText />
					</div>
				</div>
			</div>

			<div className="flex-1 mt-12 mb-8">
				<HeroAreaLinks games={games} />
			</div>
		</aside>
	);
}

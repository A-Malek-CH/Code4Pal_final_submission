import React from "react";
interface HeroAreaLinksInterface {
	games: any[];
}
function HeroAreaLinks({ games }: HeroAreaLinksInterface) {
	// Duplicate games for a seamless marquee loop
	const loopedGames = [...games, ...games];

	return (
		<section className="games-section">
			<div className="games-container">
				<div className="games-marquee">
					{loopedGames.map((game, index) => (
						<a
							key={`${game.id}-${index}`}
							href={game.handle}
							className="game-card"
						>
							<div className="game-icon">{game.icon}</div>
							<div className="game-content">
								<h4 className="game-title">{game.title}</h4>
								<p className="game-description">{game.description}</p>
							</div>
							<div className="game-link">
								<span className="link-text">Play Now</span>
								<span className="arrow">
									<span />
								</span>
							</div>
						</a>
					))}
				</div>
			</div>
		</section>
	);
}

export default HeroAreaLinks;

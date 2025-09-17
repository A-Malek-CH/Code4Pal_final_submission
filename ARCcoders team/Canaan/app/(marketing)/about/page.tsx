import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
	return (
		<main className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
			<div className="space-y-12">
				{/* Hero Section */}
				<section className="text-center space-y-6">
					<h1 className="text-4xl md:text-5xl font-bold text-balance">
						About Canaan
					</h1>
					<p className="text-xl text-muted-foreground text-balance">
						The voice of history, geography, and humanity
					</p>
				</section>

				{/* About Us */}
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl">About Us</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-lg leading-relaxed">
							How can we share the history of Palestine in a way that is easy to
							understand and deeply felt — both emotionally and intellectually?
						</p>
						<p className="leading-relaxed">
							This is where Canaan was born: an interactive platform that
							combines timelines, maps, and visual content to tell the story of
							Palestine from its roots and beginnings.
						</p>
					</CardContent>
				</Card>

				{/* Our Vision */}
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl">Our Vision</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="leading-relaxed">
							Canaan is not just a website. It is the voice of history,
							geography, and humanity. It was born from the urgent need to
							protect Palestinian history from distortion and oblivion, and to
							create a knowledge space that reflects truth in a language the
							world can understand.
						</p>
					</CardContent>
				</Card>

				{/* Our Mission */}
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl">Our Mission</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="space-y-3">
							<li className="flex items-start gap-3">
								<span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
								<span>
									Documenting years of history with accuracy and reliability.
								</span>
							</li>
							<li className="flex items-start gap-3">
								<span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
								<span>
									Transforming history into a living experience through
									interactive timelines, maps, and visual tools.
								</span>
							</li>
							<li className="flex items-start gap-3">
								<span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
								<span>
									Promoting critical thinking by comparing truth with
									propaganda.
								</span>
							</li>
							<li className="flex items-start gap-3">
								<span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
								<span>
									Redefining support: from passive sympathy to responsibility,
									from emotion to evidence-based conviction.
								</span>
							</li>
						</ul>
					</CardContent>
				</Card>

				{/* Quote */}
				<Card className="bg-muted">
					<CardContent className="pt-6">
						<blockquote className="text-center space-y-4">
							<p className="text-lg italic font-medium">
								"Occupying history is more dangerous than occupying land. All
								knowledge is in favor of Palestine and its frank archaeological
								history."
							</p>
							<footer className="text-muted-foreground">
								— Khazal Al-Majidi
							</footer>
						</blockquote>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}

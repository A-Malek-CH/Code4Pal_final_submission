import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const faqData = [
	{
		question: "What makes Canaan unique?",
		answer:
			"We don't just tell history; we let you see it, explore it, and reflect on it through interactive maps, timelines, and educational games.",
	},
	{
		question: "Why focus on Palestine?",
		answer:
			"Because its history has been systematically distorted. Canaan restores facts, voices, and memory, relying on credible evidence.",
	},
	{
		question: "Who can benefit from Canaan?",
		answer:
			"Students, researchers, teachers, activists, and anyone seeking a reliable and human understanding of Palestinian history.",
	},
	{
		question: "How do you ensure accuracy?",
		answer:
			"We rely on academic sources, trusted archives, and documented testimonies that are cross-verified.",
	},
	{
		question: "What is your final message?",
		answer:
			"To transform passive sympathy into active, conscious support, and to tell Palestine's story in the language of truth, justice, and humanity.",
	},
];

export default function FAQPage() {
	return (
		<main className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
			<div className="space-y-12">
				{/* Hero Section */}
				<section className="text-center space-y-6">
					<h1 className="text-4xl md:text-5xl font-bold text-balance">
						Frequently Asked Questions
					</h1>
					<p className="text-xl text-muted-foreground text-balance">
						Everything you need to know about Canaan
					</p>
				</section>

				{/* FAQ Accordion */}
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl">Common Questions</CardTitle>
					</CardHeader>
					<CardContent>
						<Accordion type="single" collapsible className="w-full">
							{faqData.map((faq, index) => (
								<AccordionItem key={index} value={`item-${index}`}>
									<AccordionTrigger className="text-left text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-200">
										{faq.question}
									</AccordionTrigger>
									<AccordionContent className="text-gray-700 dark:text-gray-300 leading-relaxed">
										{faq.answer}
									</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					</CardContent>
				</Card>

				{/* Call to Action */}
				<Card className="bg-primary text-primary-foreground">
					<CardContent className="pt-6">
						<div className="text-center space-y-4">
							<h2 className="text-2xl font-bold">
								Ready to Explore Palestinian History?
							</h2>
							<p className="text-primary-foreground/90">
								Join us in discovering the rich heritage and documented history
								of Palestine through our interactive platform.
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}

import Link from "next/link";
import { cn } from "@/lib/utils";

interface AppLinksProps {
	collections: any[];
	label?: string;
	className?: string;
	footer?: boolean;
}
export function AppLinks({
	collections,
	label = "Categories",
	className,
	footer,
}: AppLinksProps) {
	return (
		<div>
			<h4
				className={cn(
					footer ? "text-secondary" : "text-foreground",
					"text-xl font-bold tracking-tight mb-6 relative border-b border-primary py-3"
				)}
			>
				{label}
			</h4>

			<ul className="space-y-3">
				{collections.map((item, index) => (
					<li key={`${item.handle}-${index}`}>
						<Link
							href={`${item.handle}`}
							prefetch
							className="group block py-2 px-3 -mx-3 rounded-lg transition-all duration-200 hover:bg-accent/50 hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
						>
							<span className="text-base font-medium leading-relaxed group-hover:text-primary transition-colors">
								{item.title}
							</span>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

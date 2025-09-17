// app/library/map/page.tsx

import { InteractiveHistoricalMap } from "@/components/interactive-historical-map";

export default function MapsPage() {
	return (
		<div className="space-y-6 p-16">
			<div>
				<h1 className="text-3xl font-heading font-bold text-foreground">
					Interactive Historical Maps
				</h1>
				<p className="text-muted-foreground mt-2">
					Explore historical events through interactive maps with timeline
					controls
				</p>
			</div>

			<InteractiveHistoricalMap selectedYear={1917} />
		</div>
	);
}
import { SourcesRepository } from "@/components/dashboard/sources-repository";

export default function SourcesPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1
					className="text-3xl font-bold text-foreground"
					style={{ fontFamily: "var(--font-heading)" }}
				>
					Sources
				</h1>
				<p className="text-muted-foreground mt-2">
					Manage historical documents, references for your research.
				</p>
			</div>

			<SourcesRepository />
		</div>
	);
}

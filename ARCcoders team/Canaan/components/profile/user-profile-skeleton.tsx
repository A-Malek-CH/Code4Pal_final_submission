"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function UserProfileSkeleton() {
	return (
		<Card className="w-full max-w-md">
			<CardHeader className="flex flex-row items-center gap-4">
				<Skeleton className="h-12 w-12 rounded-full" />
				<div className="flex flex-col gap-2">
					<Skeleton className="h-5 w-32" />
					<Skeleton className="h-4 w-48" />
				</div>
			</CardHeader>
			<CardContent>
				{/* XP Bar Skeleton */}
				<div className="flex items-center justify-between mb-2">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-4 w-20" />
				</div>
				<Skeleton className="h-2 w-full mb-6" />

				{/* Tabs Skeleton */}
				<div className="flex gap-4 border-b mb-4">
					<Skeleton className="h-8 w-20" />
					<Skeleton className="h-8 w-28" />
					<Skeleton className="h-8 w-24" />
				</div>

				{/* Tab Content Skeleton */}
				<div className="space-y-4">
					<div className="flex items-center gap-4 p-2 border rounded-lg">
						<Skeleton className="h-8 w-8 rounded-md" />
						<div className="flex-1 space-y-2">
							<Skeleton className="h-4 w-1/2" />
							<Skeleton className="h-3 w-3/4" />
						</div>
					</div>
					<div className="flex items-center gap-4 p-2 border rounded-lg">
						<Skeleton className="h-8 w-8 rounded-md" />
						<div className="flex-1 space-y-2">
							<Skeleton className="h-4 w-1/2" />
							<Skeleton className="h-3 w-3/4" />
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

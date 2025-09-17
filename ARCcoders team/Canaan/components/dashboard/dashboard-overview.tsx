"use client";

import { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Calendar,
	Users,
	MapPin,
	FileText,
	ImageIcon,
	Network,
	TrendingUp,
	Clock,
	Eye,
} from "lucide-react";
import { getDashboardStats, getEvents } from "@/lib/supabase";
import { RichTextReader } from "../text-editor/rich-text-reader";

export function DashboardOverview() {
	const [stats, setStats] = useState({
		event: 0,
		source: 0,
		media: 0,
		actor: 0,
		location: 0,
	});
	const [recentEvents, setRecentEvents] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadData() {
			try {
				const [statsData, eventsData] = await Promise.all([
					getDashboardStats(),
					getEvents(),
				]);

				setStats(statsData);
				setRecentEvents(eventsData.slice(0, 3));
			} catch (error) {
				console.error("Error loading dashboard data:", error);
			} finally {
				setLoading(false);
			}
		}

		loadData();
	}, []);

	const statsCards = [
		{
			name: "Total Events",
			value: stats.event.toString(),
			icon: Calendar,
			trend: "up",
		},
		{
			name: "Actors",
			value: stats.actor.toString(),
			icon: Users,
			trend: "up",
		},
		{
			name: "Locations",
			value: stats.location.toString(),
			icon: MapPin,
			trend: "up",
		},
		{
			name: "Sources",
			value: stats.source.toString(),
			icon: FileText,
			trend: "up",
		},
	];

	if (loading) {
		return (
			<div className="space-y-6">
				<div className="animate-pulse">
					<div className="h-8 bg-muted rounded w-64 mb-2"></div>
					<div className="h-4 bg-muted rounded w-96"></div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{[...Array(4)].map((_, i) => (
						<div key={i} className="h-32 bg-muted rounded animate-pulse"></div>
					))}
				</div>

				<div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 " />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1
						className="text-3xl font-bold text-foreground"
						style={{ fontFamily: "var(--font-heading)" }}
					>
						Dashboard Overview
					</h1>
					<p className="text-muted-foreground mt-2">
						Discover the intricate tapestry of history through interconnected
						events and figures.
					</p>
				</div>
				<Button className="gap-2">
					<TrendingUp className="h-4 w-4" />
					View Analytics
				</Button>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{statsCards.map((stat) => (
					<Card
						key={stat.name}
						className="bg-card hover:shadow-md transition-shadow"
					>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium text-card-foreground">
								{stat.name}
							</CardTitle>
							<stat.icon className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-card-foreground">
								{stat.value}
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Recent Events */}
			<Card className="bg-card">
				<CardHeader>
					<CardTitle
						className="text-card-foreground"
						style={{ fontFamily: "var(--font-heading)" }}
					>
						Recent Events
					</CardTitle>
					<CardDescription>
						Manage your research with ease—navigate relationships and media
						seamlessly.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{recentEvents.length === 0 ? (
							<div className="text-center py-8 text-muted-foreground">
								<Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
								<p>
									No events found. Start by creating your first historical
									event.
								</p>
							</div>
						) : (
							recentEvents.map((event) => (
								<div
									key={event.id}
									className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
								>
									<div className="flex-1">
										<div className="flex items-center gap-3 mb-2">
											<h3
												className="font-semibold text-card-foreground"
												style={{ fontFamily: "var(--font-heading)" }}
											>
												{event.name}
											</h3>
											<div className="flex items-center gap-1 text-sm text-muted-foreground">
												<Clock className="h-3 w-3" />
												{event.start_date
													? new Date(event.start_date).getFullYear()
													: "Unknown"}{" "}
												-
												{event.end_date
													? new Date(event.end_date).getFullYear()
													: "Present"}
											</div>
										</div>
										<RichTextReader
											content={event.description}
										></RichTextReader>
										<div className="flex items-center gap-4 mb-3">
											<div className="flex items-center gap-1 text-sm text-muted-foreground">
												<MapPin className="h-3 w-3" />
												{event.location_name || "Unknown Location"}
											</div>
											<div className="flex items-center gap-1 text-sm text-muted-foreground">
												<ImageIcon className="h-3 w-3" />
												{event.media_assets?.length || 0} media
											</div>
											<div className="flex items-center gap-1 text-sm text-muted-foreground">
												<Network className="h-3 w-3" />
												{(event.source_relationships?.length || 0) +
													(event.target_relationships?.length || 0)}{" "}
												connections
											</div>
										</div>
										<div className="flex flex-wrap gap-2">
											{(event.tags || []).slice(0, 3).map((tag: string) => (
												<Badge
													key={tag}
													variant="secondary"
													className="text-xs"
												>
													{tag}
												</Badge>
											))}
										</div>
									</div>
									<div className="flex items-center gap-2 ml-4">
										<Button variant="ghost" size="sm">
											<Eye className="h-4 w-4" />
										</Button>
										<Button variant="outline" size="sm">
											Explore Connections
										</Button>
									</div>
								</div>
							))
						)}
					</div>
				</CardContent>
			</Card>

			{/* Quick Actions */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<Card className="bg-card hover:shadow-md transition-shadow cursor-pointer">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-card-foreground">
							<Calendar className="h-5 w-5 text-primary" />
							Add New Event
						</CardTitle>
						<CardDescription>
							Create a new historical event with detailed information
						</CardDescription>
					</CardHeader>
				</Card>

				<Card className="bg-card hover:shadow-md transition-shadow cursor-pointer">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-card-foreground">
							<Network className="h-5 w-5 text-secondary" />
							Explore Relationships
						</CardTitle>
						<CardDescription>
							Visualize complex data relationships in an engaging manner
						</CardDescription>
					</CardHeader>
				</Card>

				<Card className="bg-card hover:shadow-md transition-shadow cursor-pointer">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-card-foreground">
							<FileText className="h-5 w-5 text-accent" />
							Import Sources
						</CardTitle>
						<CardDescription>
							Upload and manage historical documents and references
						</CardDescription>
					</CardHeader>
				</Card>
			</div>
		</div>
	);
}

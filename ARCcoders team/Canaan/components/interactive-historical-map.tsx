"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

import {
	MapPin,
	Calendar,
	Users,
	Clock,
	Play,
	Pause,
	SkipBack,
	SkipForward,
	RotateCcw,
	Settings,
	Compass,
} from "lucide-react";
import { getEventsByDateRange } from "@/lib/supabase"; // Assumes the corrected function is here
import { useQuery } from "@tanstack/react-query";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "maplibre-gl/dist/maplibre-gl.css";
import "@maplibre/maplibre-gl-leaflet";
// @ts-ignore
import { filterByDate } from "@openhistoricalmap/maplibre-gl-dates";
import { EventWLinks } from "@/types/events";
import { RichTextReader } from "./text-editor/rich-text-reader";

// --- DYNAMIC CONFIGURATION ---
const MIN_YEAR = 1700;
const MAX_YEAR = new Date().getFullYear();
const YEAR_RANGE = MAX_YEAR - MIN_YEAR;
const QUARTER_MARK_1 = MIN_YEAR + Math.floor(YEAR_RANGE / 4);
const QUARTER_MARK_2 = MIN_YEAR + Math.floor(YEAR_RANGE / 2);
const QUARTER_MARK_3 = MIN_YEAR + Math.floor((YEAR_RANGE * 3) / 4);

interface InteractiveHistoricalMapProps {
	selectedYear?: number;
	onYearChange?: (year: number) => void;
	className?: string;
}

export function InteractiveHistoricalMap({
	selectedYear = 1800,
	onYearChange,
	className = "",
}: InteractiveHistoricalMapProps) {
	const [currentYear, setCurrentYear] = useState(selectedYear);
	const [isPlaying, setIsPlaying] = useState(false);
	const [playbackSpeed, setPlaybackSpeed] = useState(1);
	const [showEventMarkers, setShowEventMarkers] = useState(true);
	const [selectedEvent, setSelectedEvent] = useState<EventWLinks | null>(null);
	const [mapReady, setMapReady] = useState(false);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<L.Map | null>(null);
	const maplibreMapRef = useRef<any>(null);
	const eventMarkersRef = useRef<L.Marker[]>([]);

	// This useQuery hook now receives data that perfectly matches your EventWLinks type
	const { data: events = [], isLoading: eventsLoading } = useQuery({
		queryKey: ["events-timeline", currentYear],
		queryFn: () => getEventsByDateRange(currentYear - 10, currentYear + 10),
		staleTime: 5 * 60 * 1000,
	});

	const getCurrentEvents = () => {
		return events.filter((event) => {
			if (!event.start_date) return false;
			const eventYear = new Date(event.start_date).getFullYear();
			return Math.abs(eventYear - currentYear) <= 5;
		});
	};

	useEffect(() => {
		if (isPlaying) {
			intervalRef.current = setInterval(() => {
				setCurrentYear((prev) => {
					const next = prev + 1;
					// FIX: Use dynamic MAX_YEAR instead of hard-coded 1900
					if (next > MAX_YEAR) {
						setIsPlaying(false);
						return MAX_YEAR;
					}
					onYearChange?.(next);
					return next;
				});
			}, 1000 / playbackSpeed);
		} else {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [isPlaying, playbackSpeed, onYearChange]);

	useEffect(() => {
		if (!mapContainerRef.current || mapRef.current) return;

		const map = L.map(mapContainerRef.current).setView([48.8566, 2.3522], 5);
		mapRef.current = map;

		const gl = L.maplibreGL({
			style: "https://www.openhistoricalmap.org/map-styles/main/main.json",
		} as any).addTo(map);

		const maplibreMap = gl.getMaplibreMap();
		maplibreMapRef.current = maplibreMap;

		maplibreMap.once("styledata", () => {
			filterByDate(maplibreMap, `${currentYear}-01-01`);
			setMapReady(true);
		});

		return () => {
			if (mapRef.current) {
				mapRef.current.remove();
				mapRef.current = null;
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (maplibreMapRef.current && mapReady) {
			filterByDate(maplibreMapRef.current, `${currentYear}-01-01`);
		}
	}, [currentYear, mapReady]);

	useEffect(() => {
		if (!mapRef.current || !mapReady) return;

		eventMarkersRef.current.forEach((marker) => marker.remove());
		eventMarkersRef.current = [];

		if (!showEventMarkers) return;

		const currentEvents = getCurrentEvents();

		currentEvents.forEach((event) => {
			// FIX: Safely access coordinates from the first location in the flat array
			const coordinates = event.locationLinks?.[0]?.location.coordinates;
			if (!coordinates) return; // Skip if no coordinates

			try {
				const coords = coordinates.split(",").map((c) => parseFloat(c.trim()));
				if (coords.length !== 2 || isNaN(coords[0]) || isNaN(coords[1])) {
					console.warn("Invalid coordinate format:", coordinates);
					return;
				}

				const position: [number, number] = [coords[0], coords[1]];

				const scrollIcon = L.divIcon({
					className: "custom-event-marker",
					html: `<div class="relative group cursor-pointer"><div class="w-8 h-8 bg-primary border-2 border-primary-foreground rounded-full shadow-lg transform transition-all duration-300 group-hover:scale-125 group-hover:shadow-xl"><div class="absolute inset-1 bg-background rounded-full flex items-center justify-center"><div class="w-2 h-2 bg-primary rounded-full"></div></div></div><div class="absolute -top-1 -right-1 w-3 h-3 bg-destructive border border-destructive-foreground rounded-full opacity-80"></div></div>`,
					iconSize: [32, 32],
					iconAnchor: [16, 16],
					popupAnchor: [0, -16],
				});

				// FIX: Safely access location name from the flat array for the popup
				const locationName = event.locationLinks?.[0]?.location.name || "";
				const locationBadgeHtml = locationName
					? `<span class="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-md">${locationName}</span>`
					: "";

				const marker = L.marker(position, { icon: scrollIcon })
					.bindPopup(
						`<div class="max-w-xs p-4 bg-card border-2 border-border rounded-lg shadow-xl"><div class="flex items-start gap-3"><div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0"><svg class="w-4 h-4 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2L13 8H17L12 12L14 18L10 15L6 18L8 12L3 8H7L10 2Z"/></svg></div><div class="flex-1"><h4 class="font-bold text-card-foreground mb-2 text-lg leading-tight">${
							event.name
						}</h4><div class="flex items-center gap-2">${
							event.start_date
								? `<span class="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-md">${new Date(
										event.start_date
								  ).getFullYear()}</span>`
								: ""
						}${locationBadgeHtml}</div></div></div></div>`,
						{ className: "custom-popup", closeButton: false, offset: [0, -10] }
					)
					.addTo(mapRef.current!);

				eventMarkersRef.current.push(marker);
				marker.on("click", () => setSelectedEvent(event));
			} catch (e) {
				console.error("Error creating marker for event:", event.name, e);
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [events, currentYear, showEventMarkers, mapReady]);

	const handleYearChange = (value: number[]) => {
		const year = value[0];
		setCurrentYear(year);
		onYearChange?.(year);
	};

	const togglePlayback = () => setIsPlaying(!isPlaying);

	const resetTimeline = () => {
		setIsPlaying(false);
		setCurrentYear(MIN_YEAR); // FIX: Use dynamic MIN_YEAR
		onYearChange?.(MIN_YEAR);
	};

	const jumpToPeriod = (year: number) => {
		setIsPlaying(false);
		setCurrentYear(year);
		onYearChange?.(year);
	};

	const currentEvents = getCurrentEvents();

	return (
		<div className={`space-y-8 ${className}`}>
			<Card className="border-2 shadow-xl">
				<CardHeader className="pb-4">
					<CardTitle className="flex items-center justify-between text-2xl">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
								<Compass className="h-5 w-5 text-primary-foreground" />
							</div>
							<div>
								<div className="text-2xl font-black">Historical Atlas</div>
								<div className="text-lg font-normal text-muted-foreground">
									Year {currentYear} • Ancient Territories
								</div>
							</div>
							{eventsLoading && (
								<Badge variant="outline" className="animate-pulse">
									<Clock className="h-3 w-3 mr-1" />
									Loading Events...
								</Badge>
							)}
						</div>
					</CardTitle>
				</CardHeader>
			</Card>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<Card className="lg:col-span-2 border-2 shadow-2xl overflow-hidden">
					<CardContent className="p-0">
						<div className="relative">
							<div className="absolute top-4 right-4 z-10 w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-xl">
								<svg
									className="w-8 h-8 text-primary-foreground"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M12 2L15.5 8.5L22 12L15.5 15.5L12 22L8.5 15.5L2 12L8.5 8.5L12 2Z" />
								</svg>
							</div>
							<div className="relative h-[500px] m-4 rounded-xl overflow-hidden border-4 shadow-inner">
								<div
									ref={mapContainerRef}
									style={{ height: "100%", width: "100%" }}
									className={
										mapReady
											? "relative z-0"
											: "flex items-center justify-center bg-muted"
									}
								>
									{!mapReady && (
										<div className="text-center space-y-4">
											<div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
												<Compass className="h-8 w-8 text-primary-foreground animate-spin" />
											</div>
											<div className="space-y-2">
												<div className="text-xl font-bold">
													Preparing Ancient Maps...
												</div>
												<div className="text-sm text-muted-foreground">
													Loading historical territories and boundaries
												</div>
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-2 shadow-xl">
					<CardHeader className="pb-4">
						<CardTitle className="text-xl flex items-center gap-2">
							<div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
								<Users className="h-4 w-4 text-primary-foreground" />
							</div>
							{selectedEvent ? selectedEvent.name : "Historical Chronicles"}
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{selectedEvent ? (
							<div className="space-y-4">
								<div className="flex items-center gap-2 p-3 bg-muted rounded-lg border">
									<Calendar className="h-4 w-4 text-primary" />
									<span className="text-sm font-semibold">
										{selectedEvent.start_date
											? new Date(selectedEvent.start_date).getFullYear()
											: "Unknown"}
										{selectedEvent.end_date &&
											` - ${new Date(selectedEvent.end_date).getFullYear()}`}
									</span>
								</div>

								{selectedEvent.description && (
									<div className="p-4 bg-muted rounded-lg border-2">
										<RichTextReader content={selectedEvent.description} />
									</div>
								)}

								{/* FIX: Access location name from the flat array. Replaces `selectedEvent.location` */}
								{selectedEvent.locationLinks?.[0].location && (
									<div className="flex items-center gap-2 p-3 bg-muted rounded-lg border">
										<MapPin className="h-4 w-4 text-primary" />
										<span className="text-sm font-semibold">
											{selectedEvent.locationLinks[0].location.name}
										</span>
									</div>
								)}

								{selectedEvent.actorLinks &&
									selectedEvent.actorLinks.length > 0 && (
										<div className="space-y-3">
											<h4 className="font-bold flex items-center gap-2">
												<Users className="h-4 w-4 text-primary" />
												Key Historical Figures
											</h4>
											<div className="space-y-2">
												{/* FIX: The `actor` object is a pure Actor, as per your type. The part trying to display a `role` is removed. */}
												{selectedEvent.actorLinks.map((actorLink, index) => (
													<div
														key={actorLink.actor.id || index}
														className="p-3 bg-muted rounded-lg border"
													>
														<div className="font-semibold">
															{actorLink.actor.name}
														</div>

														<div className="text-xs text-muted-foreground uppercase tracking-wide">
															{actorLink.role}
														</div>
													</div>
												))}
											</div>
										</div>
									)}

								<Button
									variant="outline"
									size="sm"
									onClick={() => setSelectedEvent(null)}
									className="w-full"
								>
									Close Chronicle
								</Button>
							</div>
						) : (
							<div className="space-y-4">
								<div className="flex items-center gap-2 p-3 bg-muted rounded-lg border">
									<Calendar className="h-4 w-4 text-primary" />
									<span className="text-sm font-semibold">
										Year: {currentYear}
									</span>
								</div>
								<div className="space-y-3">
									<h4 className="font-bold flex items-center gap-2">
										<Clock className="h-4 w-4 text-primary" />
										Active Chronicles ({currentEvents.length})
									</h4>
									{currentEvents.length > 0 ? (
										<div className="space-y-3 max-h-64 overflow-y-auto">
											{currentEvents.map((event) => (
												<div
													key={event.id}
													className="p-4 bg-muted rounded-lg border cursor-pointer hover:bg-accent transition-all duration-300 shadow-md hover:shadow-lg"
													onClick={() => setSelectedEvent(event)}
												>
													<h5 className="font-bold mb-2">{event.name}</h5>
													{event.start_date && (
														<Badge className="bg-primary text-primary-foreground">
															{new Date(event.start_date).getFullYear()}
														</Badge>
													)}
												</div>
											))}
										</div>
									) : (
										<div className="p-6 text-center bg-muted rounded-lg border-2">
											<div className="w-12 h-12 bg-muted-foreground rounded-full flex items-center justify-center mx-auto mb-3">
												<Clock className="h-6 w-6 text-background" />
											</div>
											<p className="text-sm text-muted-foreground">
												{eventsLoading
													? "Searching ancient chronicles..."
													: "No events recorded for this era."}
											</p>
										</div>
									)}
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			<Card className="border-2 shadow-xl">
				<CardHeader>
					<CardTitle className="text-xl flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
								<Clock className="h-5 w-5 text-primary-foreground" />
							</div>
							<div>
								<div className="text-xl font-black">Temporal Navigator</div>
								<div className="text-sm font-normal text-muted-foreground">
									Journey Through History
								</div>
							</div>
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setShowEventMarkers(!showEventMarkers)}
							className="bg-primary text-primary-foreground hover:bg-primary/90"
						>
							<Settings className="h-4 w-4 mr-2" />
							{showEventMarkers ? "Hide" : "Show"} Chronicles
						</Button>
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Button variant="outline" size="sm" onClick={resetTimeline}>
								<RotateCcw className="h-3 w-3 mr-1" />
								Reset Era
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleYearChange([currentYear - 10])}
							>
								<SkipBack className="h-3 w-3 mr-1" />
								-10y
							</Button>
							<Button
								variant={isPlaying ? "default" : "outline"}
								size="sm"
								onClick={togglePlayback}
							>
								{isPlaying ? (
									<>
										<Pause className="h-3 w-3 mr-1" />
										Pause Journey
									</>
								) : (
									<>
										<Play className="h-3 w-3 mr-1" />
										Begin Journey
									</>
								)}
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleYearChange([currentYear + 10])}
							>
								<SkipForward className="h-3 w-3 mr-1" />
								+10y
							</Button>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-sm font-semibold">Temporal Speed:</span>
							{[0.5, 1, 2, 4].map((speed) => (
								<Button
									key={speed}
									variant={playbackSpeed === speed ? "default" : "ghost"}
									size="sm"
									onClick={() => setPlaybackSpeed(speed)}
								>
									{speed}x
								</Button>
							))}
						</div>
					</div>

					<div className="space-y-4">
						<div className="flex justify-between items-center">
							<span className="text-lg font-bold">Year: {currentYear}</span>
							<div className="flex gap-2">
								<Button
									variant="ghost"
									size="sm"
									onClick={() => jumpToPeriod(1789)}
									className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
								>
									Revolution Era
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => jumpToPeriod(1815)}
									className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
								>
									Napoleonic Era
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => jumpToPeriod(1848)}
									className="bg-accent text-accent-foreground hover:bg-accent/90"
								>
									Spring of Nations
								</Button>
							</div>
						</div>

						<div className="relative p-4 bg-muted rounded-xl border-2">
							<Slider
								value={[currentYear]}
								onValueChange={handleYearChange}
								min={MIN_YEAR}
								max={MAX_YEAR}
								step={1}
								className="w-full"
							/>
							{showEventMarkers && (
								<div className="absolute top-4 left-4 right-4 h-full pointer-events-none">
									{events
										.filter((e) => e.start_date)
										.map((event) => {
											const eventYear = new Date(
												event.start_date!
											).getFullYear();
											if (eventYear < MIN_YEAR || eventYear > MAX_YEAR)
												return null;
											const position =
												((eventYear - MIN_YEAR) / YEAR_RANGE) * 100;
											return (
												<div
													key={event.id}
													className="absolute top-0 transform -translate-x-1/2"
													style={{ left: `${position}%` }}
												>
													<div className="w-2 h-8 bg-destructive rounded-full shadow-lg" />
													<div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-card border-2 rounded-lg px-2 py-1 text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity shadow-xl">
														<div className="font-bold">{event.name}</div>
														<div className="text-muted-foreground">
															({eventYear})
														</div>
													</div>
												</div>
											);
										})}
								</div>
							)}
						</div>

						<div className="flex justify-between text-sm font-semibold text-muted-foreground relative">
							<span>{MIN_YEAR}</span>
							<span className="absolute left-1/4 transform -translate-x-1/2">
								{QUARTER_MARK_1}
							</span>
							<span className="absolute left-1/2 transform -translate-x-1/2">
								{QUARTER_MARK_2}
							</span>
							<span className="absolute left-3/4 transform -translate-x-1/2">
								{QUARTER_MARK_3}
							</span>
							<span>{MAX_YEAR}</span>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="bg-muted rounded-xl p-4 border-2 shadow-lg">
							<div className="font-bold mb-2">Current Era</div>
							<div className="font-semibold">
								{currentYear < 1750
									? "Age of Enlightenment"
									: currentYear < 1800
									? "Revolutionary Period"
									: currentYear < 1850
									? "Napoleonic Era"
									: "Industrial Revolution"}
							</div>
						</div>
						<div className="bg-muted rounded-xl p-4 border-2 shadow-lg">
							<div className="font-bold mb-2">Active Chronicles</div>
							<div className="font-semibold">
								{currentEvents.length} events recorded
							</div>
						</div>
						<div className="bg-muted rounded-xl p-4 border-2 shadow-lg">
							<div className="font-bold mb-2">Navigator Status</div>
							<div className="font-semibold">
								{isPlaying
									? `Journeying at ${playbackSpeed}x speed`
									: "Exploration paused"}
							</div>
						</div>
					</div>

					<div className="text-center p-4 bg-muted rounded-xl border-2 shadow-inner">
						<p className="text-sm leading-relaxed">
							<span className="font-bold">🗺️ Ancient Atlas Explorer:</span>{" "}
							Navigate through history using authentic period maps.
							<span className="font-semibold text-primary">
								{" "}
								Event markers
							</span>{" "}
							reveal actual events from your chronicles. Use the temporal
							navigator to witness how territories evolved across centuries.
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
	iconUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
	shadowUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

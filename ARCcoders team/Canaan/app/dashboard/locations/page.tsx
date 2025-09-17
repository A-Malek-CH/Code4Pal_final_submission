"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Search,
	Plus,
	Castle,
	Mountain,
	Building,
	MapPin,
	Loader2,
	Edit,
	Trash2,
} from "lucide-react";
import {
	getLocations,
	createLocation,
	updateLocation,
	deleteLocation,
} from "@/lib/supabase";
import {
	locationSchema,
	type LocationFormData,
} from "@/lib/validations/location";
import { toast } from "sonner";
import { RichTextEditor } from "@/components/text-editor/rich-text-editor";
import { Location } from "@prisma/client";
export default function LocationsPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedLocation, setSelectedLocation] = useState<Location | null>(
		null
	);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const queryClient = useQueryClient();

	const {
		data: locations = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ["locations"],
		queryFn: getLocations,
	});

	const form = useForm<LocationFormData>({
		resolver: zodResolver(locationSchema),
		defaultValues: {
			name: "",
			description: "",
			coordinates: "",
			country: "",
			region: "",
		},
	});

	const createMutation = useMutation({
		mutationFn: createLocation,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["locations"] });
			toast.success("Location created successfully");
			setIsDialogOpen(false);
			form.reset();
			setSelectedLocation(null);
		},
		onError: (error) => {
			toast.error("Failed to create location");
			console.error("Error creating location:", error);
		},
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: LocationFormData }) =>
			updateLocation(id, {
				name: data.name,
				description: data.description,
				coordinates: data.coordinates || null,
				country: data.country || null,
				region: data.region || null,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["locations"] });
			toast.success("Location updated successfully");
			setIsDialogOpen(false);
			form.reset();
			setSelectedLocation(null);
		},
		onError: (error) => {
			toast.error("Failed to update location");
			console.error("Error updating location:", error);
		},
	});

	const deleteMutation = useMutation({
		mutationFn: deleteLocation,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["locations"] });
			toast.success("Location deleted successfully");
		},
		onError: (error) => {
			toast.error("Failed to delete location");
			console.error("Error deleting location:", error);
		},
	});

	const onSubmit = (data: LocationFormData) => {
		if (selectedLocation) {
			updateMutation.mutate({ id: selectedLocation.id, data });
		} else {
			createMutation.mutate({
				name: data.name,
				description: data.description,
				coordinates: data.coordinates || null,
				country: data.country || null,
				region: data.region || null,
			});
		}
	};

	const handleEditLocation = (location: Location) => {
		setSelectedLocation(location);
		form.reset({
			name: location.name || "",
			description: location.description || "",
			coordinates: location.coordinates || "",
			country: location.country || "",
			region: location.region || "",
		});
		setIsDialogOpen(true);
	};

	const handleDeleteLocation = (locationId: string) => {
		if (confirm("Are you sure you want to delete this location?")) {
			deleteMutation.mutate(locationId);
		}
	};

	const filteredLocations = locations.filter(
		(location) =>
			location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(location.country &&
				location.country.toLowerCase().includes(searchTerm.toLowerCase())) ||
			(location.region &&
				location.region.toLowerCase().includes(searchTerm.toLowerCase())) ||
			(location.description &&
				location.description.toLowerCase().includes(searchTerm.toLowerCase()))
	);

	const getLocationIcon = (name: string) => {
		const lowerName = name.toLowerCase();
		if (
			lowerName.includes("palace") ||
			lowerName.includes("castle") ||
			lowerName.includes("fort")
		)
			return Castle;
		if (
			lowerName.includes("mountain") ||
			lowerName.includes("hill") ||
			lowerName.includes("battlefield")
		)
			return Mountain;
		if (
			lowerName.includes("city") ||
			lowerName.includes("town") ||
			lowerName.includes("capital")
		)
			return Building;
		return MapPin;
	};

	const getLocationType = (name: string) => {
		const lowerName = name.toLowerCase();
		if (lowerName.includes("palace")) return "Palace";
		if (lowerName.includes("castle")) return "Castle";
		if (lowerName.includes("city")) return "City";
		if (lowerName.includes("town")) return "Town";
		if (lowerName.includes("battlefield")) return "Battlefield";
		if (lowerName.includes("mountain")) return "Mountain";
		return "Location";
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<h1
							className="text-3xl font-bold text-foreground"
							style={{ fontFamily: "var(--font-heading)" }}
						>
							Locations
						</h1>
						<p className="text-muted-foreground mt-2">
							Geographic locations and their historical significance
						</p>
					</div>
					<Button
						onClick={() =>
							queryClient.invalidateQueries({ queryKey: ["locations"] })
						}
					>
						Try Again
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1
						className="text-3xl font-bold text-foreground"
						style={{ fontFamily: "var(--font-heading)" }}
					>
						Locations
					</h1>
					<p className="text-muted-foreground mt-2">
						Geographic locations and their historical significance
					</p>
				</div>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button className="gap-2">
							<Plus className="h-4 w-4" />
							Add Location
						</Button>
					</DialogTrigger>
					<DialogContent className="max-w-2xl">
						<DialogHeader>
							<DialogTitle>
								{selectedLocation ? "Edit Location" : "Create New Location"}
							</DialogTitle>
							<DialogDescription>
								{selectedLocation
									? "Update the location information below."
									: "Add a new historical location to your database."}
							</DialogDescription>
						</DialogHeader>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4 overflow-y-auto max-h-[80vh] p-4"
							>
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Location Name</FormLabel>
											<FormControl>
												<Input placeholder="Enter location name" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Description</FormLabel>
											<FormControl>
												<RichTextEditor
													onChange={field.onChange}
													content={field.value || ""}
													placeholder="Describe the Location"
												></RichTextEditor>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="country"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Country</FormLabel>
												<FormControl>
													<Input placeholder="Enter country" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="region"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Region</FormLabel>
												<FormControl>
													<Input placeholder="Enter region" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<FormField
									control={form.control}
									name="coordinates"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Coordinates</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter coordinates (lat, lng)"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="flex justify-end gap-2">
									<Button
										type="button"
										variant="outline"
										onClick={() => {
											setIsDialogOpen(false);
											form.reset();
											setSelectedLocation(null);
										}}
									>
										Cancel
									</Button>
									<Button
										type="submit"
										disabled={
											createMutation.isPending || updateMutation.isPending
										}
									>
										{(createMutation.isPending || updateMutation.isPending) && (
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										)}
										{selectedLocation ? "Update Location" : "Create Location"}
									</Button>
								</div>
							</form>
						</Form>
					</DialogContent>
				</Dialog>
			</div>

			<div className="flex items-center gap-4">
				<div className="relative flex-1 max-w-md">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search locations..."
						className="pl-10"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
			</div>

			{filteredLocations.length === 0 ? (
				<div className="space-y-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-primary/10 rounded-lg">
								<MapPin className="h-5 w-5 text-primary" />
							</div>
							<div>
								<h3 className="text-lg font-semibold mb-2">
									No locations found
								</h3>
								<p className="text-muted-foreground text-center mb-4">
									{searchTerm
										? "Try adjusting your search terms."
										: "Start by adding historical locations to your database."}
								</p>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredLocations.map((location) => {
						const IconComponent = getLocationIcon(location.name);
						const locationType = getLocationType(location.name);
						return (
							<Card
								key={location.id}
								className="hover:shadow-md transition-shadow"
							>
								<CardHeader className="pb-3">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="p-2 bg-primary/10 rounded-lg">
												<IconComponent className="h-5 w-5 text-primary" />
											</div>
											<div>
												<CardTitle className="text-lg">
													{location.name}
												</CardTitle>
												<Badge variant="secondary" className="text-xs">
													{locationType}
												</Badge>
											</div>
										</div>
										<div className="flex items-center gap-1">
											<Button
												variant="ghost"
												size="sm"
												onClick={() => handleEditLocation(location)}
											>
												<Edit className="h-3 w-3" />
											</Button>
											<Button
												variant="ghost"
												size="sm"
												className="text-destructive hover:text-destructive"
												onClick={() => handleDeleteLocation(location.id)}
												disabled={deleteMutation.isPending}
											>
												{deleteMutation.isPending ? (
													<Loader2 className="h-3 w-3 animate-spin" />
												) : (
													<Trash2 className="h-3 w-3" />
												)}
											</Button>
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground mb-4 line-clamp-3">
										{location.description || "No description available"}
									</p>
									<div className="space-y-2">
										{location.country && (
											<div className="flex items-center justify-between text-sm">
												<span className="text-muted-foreground">Country:</span>
												<span>{location.country}</span>
											</div>
										)}
										{location.region && (
											<div className="flex items-center justify-between text-sm">
												<span className="text-muted-foreground">Region:</span>
												<span>{location.region}</span>
											</div>
										)}
										{location.coordinates && (
											<div className="flex items-center justify-between text-sm">
												<span className="text-muted-foreground">
													Coordinates:
												</span>
												<span className="text-xs">{location.coordinates}</span>
											</div>
										)}
										{/* <div className="flex items-center justify-between">
											<Badge variant="outline">
												{location._count.locationLinks} events
											</Badge>
										</div> */}
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>
			)}
		</div>
	);
}

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { actorSchema, type ActorFormData } from "@/lib/validations/actor";
import { useState, useEffect } from "react"; // Added useEffect
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter, // Added CardFooter
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogDescription, // Added DialogDescription
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
} from "../ui/form";
import {
	Plus,
	Search,
	Users,
	Building,
	Crown,
	Shield,
	Loader2,
	Edit, // Added Edit icon
	Trash2, // Added Trash2 icon
} from "lucide-react";
import {
	getActors,
	createActor,
	updateActor,
	deleteActor,
} from "@/lib/supabase";
import { Actor } from "@prisma/client";
import { RichTextEditor } from "../text-editor/rich-text-editor";
import { format } from "date-fns";
import { toast } from "sonner"; // Using toast for notifications

// --- Constants (Good Practice) ---
const actorTypes = [
	{ value: "person", label: "Person", icon: Users },
	{ value: "government", label: "Government", icon: Crown },
	{ value: "organization", label: "Organization", icon: Building },
	{ value: "institution", label: "Institution", icon: Building },
	{ value: "military", label: "Military", icon: Shield },
	{ value: "political_party", label: "Political Party", icon: Crown },
];

const getActorTypeIcon = (type: string) => {
	const actorType = actorTypes.find((t) => t.value === type);
	return actorType ? actorType.icon : Users;
};

const getActorTypeLabel = (type: string) => {
	const actorType = actorTypes.find((t) => t.value === type);
	return actorType ? actorType.label : type;
};

// --- Main Component ---
export function ActorsManagement() {
	const queryClient = useQueryClient();

	// --- State Management ---
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedType, setSelectedType] = useState<string>("all");
	const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
	const [selectedActor, setSelectedActor] = useState<Actor | null>(null);

	// --- Data Fetching ---
	const {
		data: actors = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ["actors"],
		queryFn: getActors,
	});

	// --- Data Mutations ---
	const deleteMutation = useMutation({
		mutationFn: deleteActor,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["actors"] });
			toast.success("Actor deleted successfully");
		},
		onError: (error) => {
			toast.error("Failed to delete actor");
			console.error("Error deleting actor:", error);
		},
	});

	// --- Event Handlers ---
	const handleAddActor = () => {
		setSelectedActor(null);
		setIsFormDialogOpen(true);
	};

	const handleEditActor = (actor: Actor) => {
		setSelectedActor(actor);
		setIsFormDialogOpen(true);
	};

	const handleDeleteActor = (actorId: string) => {
		if (confirm("Are you sure you want to delete this actor?")) {
			deleteMutation.mutate(actorId);
		}
	};

	const handleFormSuccess = () => {
		setIsFormDialogOpen(false);
		setSelectedActor(null); // Clear selection on success
	};

	// --- Filtering Logic ---
	const filteredActors = actors.filter((actor: Actor) => {
		const matchesSearch =
			actor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			actor.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			false;
		const matchesType =
			selectedType === "all" || actor.actor_type === selectedType;
		return matchesSearch && matchesType;
	});

	// --- Render States ---
	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<Loader2 className="h-8 w-8 animate-spin" />
				<span className="ml-2 text-lg">Loading actors...</span>
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center p-8">
				<p className="text-destructive mb-4">
					Error loading actors: {error.message}
				</p>
				<Button
					onClick={() =>
						queryClient.invalidateQueries({ queryKey: ["actors"] })
					}
				>
					Try Again
				</Button>
			</div>
		);
	}

	// --- Main Render ---
	return (
		<div className="space-y-6">
			{/* Header and Add Button */}
			<div className="flex justify-between items-center">
				<div>
					<h1
						className="text-3xl font-bold"
						style={{ fontFamily: "var(--font-heading)" }}
					>
						Historical Actors
					</h1>
					<p className="text-muted-foreground mt-2">
						Manage people, governments, organizations, and institutions.
					</p>
				</div>
				<Button onClick={handleAddActor}>
					<Plus className="h-4 w-4 mr-2" />
					Add Actor
				</Button>
			</div>

			{/* Filter Controls */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Filter & Search</CardTitle>
				</CardHeader>
				<CardContent className="flex gap-4">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
						<Input
							placeholder="Search actors by name or description..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>
					<Select value={selectedType} onValueChange={setSelectedType}>
						<SelectTrigger className="w-48">
							<SelectValue placeholder="Filter by type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Types</SelectItem>
							{actorTypes.map((type) => (
								<SelectItem key={type.value} value={type.value}>
									{type.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</CardContent>
			</Card>

			{/* Actor Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredActors.map((actor: Actor) => {
					const IconComponent = getActorTypeIcon(actor.actor_type);
					return (
						<Card
							key={actor.id}
							className="flex flex-col hover:shadow-md transition-shadow"
						>
							<CardHeader>
								<div className="flex items-start justify-between gap-4">
									<div className="flex items-center gap-3">
										<IconComponent className="h-5 w-5 text-primary flex-shrink-0" />
										<CardTitle className="text-lg">{actor.name}</CardTitle>
									</div>
									<Badge variant="secondary" className="whitespace-nowrap">
										{getActorTypeLabel(actor.actor_type)}
									</Badge>
								</div>
								{actor.description && (
									<CardDescription
										className="line-clamp-2 pt-2"
										dangerouslySetInnerHTML={{ __html: actor.description }}
									/>
								)}
							</CardHeader>
							<CardContent className="flex-grow space-y-2 text-sm text-muted-foreground">
								{actor.actor_type === "person" && actor.birth_date && (
									<div>
										<span className="font-medium text-foreground">Born:</span>{" "}
										{format(new Date(actor.birth_date), "yyyy")}
										{actor.death_date &&
											` - ${format(new Date(actor.death_date), "yyyy")}`}
									</div>
								)}
								{actor.actor_type !== "person" && actor.founded_date && (
									<div>
										<span className="font-medium text-foreground">
											Founded:
										</span>{" "}
										{format(new Date(actor.founded_date), "yyyy")}
										{actor.dissolved_date &&
											` - ${format(new Date(actor.dissolved_date), "yyyy")}`}
									</div>
								)}
								{actor.nationality && actor.actor_type !== "government" && (
									<div>
										<span className="font-medium text-foreground">
											Nationality:
										</span>{" "}
										{actor.nationality}
									</div>
								)}
							</CardContent>
							<CardFooter className="flex gap-2">
								<Button
									variant="ghost"
									size="sm"
									className="w-full"
									onClick={() => handleEditActor(actor)}
								>
									<Edit className="h-4 w-4 mr-2" />
									Edit
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="text-destructive hover:text-destructive hover:bg-destructive/10"
									onClick={() => handleDeleteActor(actor.id)}
									disabled={
										deleteMutation.isPending &&
										deleteMutation.variables === actor.id
									}
								>
									{deleteMutation.isPending &&
									deleteMutation.variables === actor.id ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										<Trash2 className="h-4 w-4" />
									)}
								</Button>
							</CardFooter>
						</Card>
					);
				})}
			</div>

			{/* No Results Message */}
			{filteredActors.length === 0 && !isLoading && (
				<Card>
					<CardContent className="text-center py-12">
						<Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
						<h3 className="text-lg font-medium mb-2">No actors found</h3>
						<p className="text-muted-foreground mb-4">
							Try adjusting your search or filter criteria.
						</p>
						<Button onClick={handleAddActor}>
							<Plus className="h-4 w-4 mr-2" />
							Add Your First Actor
						</Button>
					</CardContent>
				</Card>
			)}

			{/* Create/Edit Dialog */}
			<Dialog
				open={isFormDialogOpen}
				onOpenChange={(open) => {
					if (!open) {
						setSelectedActor(null); // Clear selection when closing
					}
					setIsFormDialogOpen(open);
				}}
			>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>
							{selectedActor ? "Edit Actor" : "Add New Actor"}
						</DialogTitle>
						<DialogDescription>
							{selectedActor
								? "Update the information for this historical actor."
								: "Fill in the details for a new historical actor."}
						</DialogDescription>
					</DialogHeader>
					<ActorForm
						selectedActor={selectedActor}
						onSuccess={handleFormSuccess}
						onCancel={() => setIsFormDialogOpen(false)}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}

// --- Form Component ---
interface ActorFormProps {
	selectedActor: Actor | null;
	onSuccess: () => void;
	onCancel: () => void;
}

function ActorForm({ selectedActor, onSuccess, onCancel }: ActorFormProps) {
	const queryClient = useQueryClient();
	const form = useForm<ActorFormData>({
		resolver: zodResolver(actorSchema),
		// Default values are now empty, useEffect will populate them for edits.
		defaultValues: {
			name: "",
			actorType: "person",
			description: "",
			birthDate: "",
			deathDate: "",
			foundedDate: "",
			dissolvedDate: "",
			nationality: "",
			photoUrl: "",
		},
	});

	// **CRITICAL FIX**: Use useEffect to reset the form when the selectedActor changes.
	useEffect(() => {
		if (selectedActor) {
			// Edit mode: populate the form
			form.reset({
				name: selectedActor.name || "",
				actorType: (selectedActor.actor_type as any) || "person",
				description: selectedActor.description || "",
				birthDate: selectedActor.birth_date
					? format(new Date(selectedActor.birth_date), "yyyy-MM-dd")
					: "",
				deathDate: selectedActor.death_date
					? format(new Date(selectedActor.death_date), "yyyy-MM-dd")
					: "",
				foundedDate: selectedActor.founded_date
					? format(new Date(selectedActor.founded_date), "yyyy-MM-dd")
					: "",
				dissolvedDate: selectedActor.dissolved_date
					? format(new Date(selectedActor.dissolved_date), "yyyy-MM-dd")
					: "",
				nationality: selectedActor.nationality || "",
				photoUrl: selectedActor.photo_url || "",
			});
		} else {
			// Create mode: ensure form is cleared
			form.reset();
		}
	}, [selectedActor, form.reset]);

	const mutation = useMutation({
		mutationFn: async (data: ActorFormData) => {
			const dbShapeData = {
				name: data.name,
				actor_type: data.actorType,
				description: data.description,
				birth_date: data.birthDate ? new Date(data.birthDate) : null,
				death_date: data.deathDate ? new Date(data.deathDate) : null,
				founded_date: data.foundedDate ? new Date(data.foundedDate) : null,
				dissolved_date: data.dissolvedDate
					? new Date(data.dissolvedDate)
					: null,
				nationality: data.nationality || null,
				photo_url: data.photoUrl || null,
			};

			if (selectedActor) {
				return updateActor(selectedActor.id, dbShapeData);
			} else {
				return createActor(dbShapeData);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["actors"] });
			toast.success(
				`Actor ${selectedActor ? "updated" : "created"} successfully!`
			);
			onSuccess();
		},
		onError: (error: any) => {
			toast.error(`Failed to ${selectedActor ? "update" : "create"} actor.`);
			console.error("Error saving actor:", error);
			form.setError("root", {
				message: error.message || "An unknown error occurred.",
			});
		},
	});

	const onSubmit = (data: ActorFormData) => {
		mutation.mutate(data);
	};

	const actorType = form.watch("actorType");
	const isPerson = actorType === "person";
	const isGovernment = actorType === "government";

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-4 overflow-y-auto max-h-[70vh] p-1 pr-4"
			>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name *</FormLabel>
								<FormControl>
									<Input placeholder="e.g., Julius Caesar" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="actorType"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Type *</FormLabel>
								<Select onValueChange={field.onChange} value={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select actor type" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{actorTypes.map((type) => (
											<SelectItem key={type.value} value={type.value}>
												{type.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<FormField
					control={form.control}
					name="photoUrl"
					render={({ field }) => (
						<FormItem>
							<FormLabel>photoURL (Optional)</FormLabel>
							<FormControl>
								<Input placeholder="https://..." {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<RichTextEditor
										onChange={field.onChange}
										content={field.value || ""}
										placeholder="Describe the actor..."
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{isPerson ? (
						<>
							<FormField
								control={form.control}
								name="birthDate"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Birth Date</FormLabel>
										<FormControl>
											<Input type="date" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="deathDate"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Death Date</FormLabel>
										<FormControl>
											<Input type="date" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</>
					) : (
						<>
							<FormField
								control={form.control}
								name="foundedDate"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Founded Date</FormLabel>
										<FormControl>
											<Input type="date" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="dissolvedDate"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Dissolved Date</FormLabel>
										<FormControl>
											<Input type="date" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</>
					)}
				</div>

				{!isGovernment && (
					<FormField
						control={form.control}
						name="nationality"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Nationality / Origin</FormLabel>
								<FormControl>
									<Input placeholder="e.g., Roman" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}

				{form.formState.errors.root && (
					<p className="text-sm text-destructive mt-2">
						{form.formState.errors.root.message}
					</p>
				)}

				<div className="flex justify-end gap-3 pt-4 border-t">
					<Button type="button" variant="outline" onClick={onCancel}>
						Cancel
					</Button>
					<Button type="submit" disabled={mutation.isPending}>
						{mutation.isPending ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin mr-2" />
								Saving...
							</>
						) : selectedActor ? (
							"Update Actor"
						) : (
							"Create Actor"
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}

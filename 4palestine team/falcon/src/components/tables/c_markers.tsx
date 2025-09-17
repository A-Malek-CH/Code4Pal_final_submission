"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

import type { Marker } from "@/types/d_marker"

type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | null | undefined;

const getBadgeVariant = (markerType: string): BadgeVariant => {
    switch (markerType.toLowerCase()) {
        case "hazard":
            return "destructive";
        case "info":
            return "secondary";
        case "event":
            return "default";
        case "alert":
            return "outline";
        default:
            return "default"; 
    }
};

export const columns: ColumnDef<Marker>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "lat",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Latitude
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="w-16 text-right">{(row.getValue("lat") as number).toFixed(4)}</div>,
    },
    {
        accessorKey: "long",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Longitude
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="w-16 text-right">{(row.getValue("long") as number).toFixed(4)}</div>,
    },
    {
        accessorKey: "type",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const type: string = row.getValue("type");
            const variant = getBadgeVariant(type); 
            return <Badge className="center mx-auto" variant={variant}>{type}</Badge>;
        },
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => <div className="max-w-[200px] truncate">{row.getValue("description")}</div>,
    },
    {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => {
            const imageUrl: string | undefined = row.getValue("image");
            return imageUrl ? (
                <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline text-center">
                    View Image
                </a>
            ) : (
                <span className="text-gray-500 center mr-4">N/A</span>
            );
        },
    },
    {
        accessorKey: "user_id",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    User ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="w-[80px] truncate">{row.getValue("user_id")}</div>,
    },
    {
        accessorKey: "last_updated",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Last Updated
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const date: Date = row.getValue("last_updated");
            const formattedDate = new Intl.DateTimeFormat("en-US", {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
            return <div>{formattedDate}</div>;
        },
    },
    {
        accessorKey: "reports",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Reports
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="text-center">{row.getValue("reports")}</div>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const marker = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                            // Implement logic to open marker details, e.g., navigate to a marker detail page or open a modal
                            console.log("Open marker:", marker.id);
                            // Example: window.location.href = `/markers/${marker.id}`;
                        }}>
                            Open
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                            // Implement logic to view the user profile who created this marker
                            console.log("View user:", marker.user_id);
                            // Example: window.location.href = `/users/${marker.user_id}`;
                        }}>
                            View User
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => {
                            // Implement logic to remove the marker
                            console.log("Remove marker:", marker.id);
                            // Example: confirm("Are you sure you want to remove this marker?") && deleteMarker(marker.id);
                        }}>
                            Remove
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
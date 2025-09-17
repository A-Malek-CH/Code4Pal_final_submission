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

import type { SOSMarker } from "@/types/d_sos"

export const columns: ColumnDef<SOSMarker>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected()
                        ? true
                        : table.getIsSomePageRowsSelected()
                        ? "indeterminate"
                        : false
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
        cell: ({ row }) => {
            const val = row.getValue("lat") as number | string | undefined;
            const num = typeof val === "string" ? parseFloat(val) : (val as number | undefined);
            return <div className="w-16 text-right">{Number.isFinite(num) ? num?.toFixed(4) : "N/A"}</div>;
        },
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
        cell: ({ row }) => {
            const val = row.getValue("long") as number | string | undefined;
            const num = typeof val === "string" ? parseFloat(val) : (val as number | undefined);
            return <div className="w-16 text-right">{Number.isFinite(num) ? num?.toFixed(4) : "N/A"}</div>;
        },
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => <div className="max-w-[200px] truncate">{row.getValue("description")}</div>,
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
        cell: ({ row }) => <div className="w-[80px] truncate">{String(row.getValue("user_id") ?? "")}</div>,
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
            const val = row.getValue("last_updated") as string | Date | undefined;
            const date = typeof val === "string" ? new Date(val) : (val as Date | undefined);
            if (!date || Number.isNaN(date.getTime())) return <div>N/A</div>;
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
        cell: ({ row }) => {
            const val = row.getValue("reports") as number | string | undefined;
            const num = typeof val === "string" ? parseInt(val, 10) : (val as number | undefined);
            return <div className="text-center">{Number.isFinite(num) ? num : 0}</div>
        },
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
                            console.log("Open marker:", marker.id);
                        }}>
                            Open
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                            console.log("View user:", marker.user_id);
                        }}>
                            View User
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => {
                            console.log("Remove marker:", marker.id);
                        }}>
                            Remove
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
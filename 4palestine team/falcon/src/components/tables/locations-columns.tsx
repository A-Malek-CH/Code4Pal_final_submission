"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Location } from "@/services/api"

export const locationsColumns: ColumnDef<Location>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      const address = row.getValue("address") as string
      return (
        <div className="max-w-[200px] truncate" title={address}>
          {address}
        </div>
      )
    },
  },
  {
    accessorKey: "latitude",
    header: "Latitude",
    cell: ({ row }) => {
      const lat = row.getValue("latitude") as number
      return <div className="font-mono text-sm">{lat?.toFixed(6)}</div>
    },
  },
  {
    accessorKey: "longitude",
    header: "Longitude",
    cell: ({ row }) => {
      const lng = row.getValue("longitude") as number
      return <div className="font-mono text-sm">{lng?.toFixed(6)}</div>
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string
      const variant = 
        type === "emergency" ? "destructive" :
        type === "safe_zone" ? "default" :
        type === "landmark" ? "secondary" : "outline"
      
      return <Badge variant={variant}>{type}</Badge>
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"))
      return <div>{date.toLocaleDateString()}</div>
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const location = row.original
      const { onView, onViewOnMap } = (table.options.meta as any) || {}

      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView?.(location)}
            className="h-8 px-2"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewOnMap?.(location)}
            className="h-8 px-2"
          >
            <MapPin className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
]
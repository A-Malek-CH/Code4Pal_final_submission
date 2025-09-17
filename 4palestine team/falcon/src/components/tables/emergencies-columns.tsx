"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye, MapPin, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Emergency } from "@/services/api"

export const emergenciesColumns: ColumnDef<Emergency>[] = [
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
    accessorKey: "user_id",
    header: "User ID",
    cell: ({ row }) => <div>{row.getValue("user_id")}</div>,
  },
  {
    accessorKey: "emergency_type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("emergency_type") as string
      const variant = 
        type === "medical" ? "destructive" :
        type === "fire" ? "destructive" :
        type === "accident" ? "destructive" :
        type === "crime" ? "destructive" :
        type === "natural_disaster" ? "destructive" : "secondary"
      
      return (
        <Badge variant={variant} className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          {type}
        </Badge>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const variant = 
        status === "active" ? "destructive" :
        status === "in_progress" ? "default" :
        status === "resolved" ? "default" :
        status === "closed" ? "secondary" : "outline"
      
      return <Badge variant={variant}>{status}</Badge>
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string
      return (
        <div className="max-w-[200px] truncate" title={description}>
          {description}
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
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Reported
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"))
      return (
        <div>
          <div className="text-sm">{date.toLocaleDateString()}</div>
          <div className="text-xs text-muted-foreground">{date.toLocaleTimeString()}</div>
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const emergency = row.original
      const { onView, onViewOnMap } = (table.options.meta as any) || {}

      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView?.(emergency)}
            className="h-8 px-2"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewOnMap?.(emergency)}
            className="h-8 px-2"
          >
            <MapPin className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
]
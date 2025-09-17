"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Check, X, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Contributor } from "@/services/api"

export const contributorsColumns: ColumnDef<Contributor>[] = [
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
    accessorKey: "contributor_type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("contributor_type") as string
      return (
        <Badge variant={type === "organization" ? "default" : "secondary"}>
          {type}
        </Badge>
      )
    },
  },
  {
    accessorKey: "verification_status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("verification_status") as string
      const variant = 
        status === "approved" ? "default" :
        status === "pending" ? "secondary" :
        status === "rejected" ? "destructive" : "outline"
      
      return <Badge variant={variant}>{status}</Badge>
    },
  },
  {
    accessorKey: "verified",
    header: "Verified",
    cell: ({ row }) => {
      const verified = row.getValue("verified") as boolean
      return (
        <Badge variant={verified ? "default" : "secondary"}>
          {verified ? "Yes" : "No"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "motivation",
    header: "Motivation",
    cell: ({ row }) => {
      const motivation = row.getValue("motivation") as string
      return (
        <div className="max-w-[200px] truncate" title={motivation}>
          {motivation}
        </div>
      )
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
      const contributor = row.original
      const { onApprove, onReject, onView } = (table.options.meta as any) || {}

      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView?.(contributor)}
            className="h-8 px-2"
          >
            <Eye className="h-4 w-4" />
          </Button>
          {contributor.verification_status === "pending" && (
            <>
              <Button
                variant="default"
                size="sm"
                onClick={() => onApprove?.(contributor)}
                className="h-8 px-2 bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onReject?.(contributor)}
                className="h-8 px-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      )
    },
  },
]
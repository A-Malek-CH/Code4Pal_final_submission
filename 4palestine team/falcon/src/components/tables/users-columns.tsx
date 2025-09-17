"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User } from "@/services/api"

export const usersColumns: ColumnDef<User>[] = [
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
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "first_name",
    header: "First Name",
    cell: ({ row }) => <div>{row.getValue("first_name")}</div>,
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
    cell: ({ row }) => <div>{row.getValue("last_name")}</div>,
  },
  {
    accessorKey: "phone_number",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.getValue("phone_number") as string
      return <div>{phone || "N/A"}</div>
    },
  },
  {
    accessorKey: "user_type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("user_type") as string
      return (
        <Badge variant={type === "contributor" ? "default" : "secondary"}>
          {type}
        </Badge>
      )
    },
  },
  {
    accessorKey: "is_email_verified",
    header: "Email Verified",
    cell: ({ row }) => {
      const verified = row.getValue("is_email_verified") as boolean
      return (
        <Badge variant={verified ? "default" : "secondary"}>
          {verified ? "Yes" : "No"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "is_phone_verified",
    header: "Phone Verified",
    cell: ({ row }) => {
      const verified = row.getValue("is_phone_verified") as boolean
      return (
        <Badge variant={verified ? "default" : "secondary"}>
          {verified ? "Yes" : "No"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "preferred_language",
    header: "Language",
    cell: ({ row }) => {
      const language = row.getValue("preferred_language") as string
      return <div className="uppercase">{language}</div>
    },
  },
  {
    accessorKey: "registration_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Registered
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("registration_date"))
      return <div>{date.toLocaleDateString()}</div>
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const user = row.original
      const { onDelete, onView } = (table.options.meta as any) || {}

      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView?.(user)}
            className="h-8 px-2"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete?.(user)}
            className="h-8 px-2"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
]
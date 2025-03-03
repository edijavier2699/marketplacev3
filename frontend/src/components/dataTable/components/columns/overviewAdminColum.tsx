"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "@/components/ui/checkbox"
import {  statuses } from "../../data/data"
import { Properties, propertySchema } from "../../data/schema"
import { DataTableColumnHeader } from "../tasdata-table-column-header"
import { DataTableRowActionsAdmin } from "../rows/row-action-admin"

const formatStatus = (status: string): string => {
    return status
      .replace(/_/g, ' ') // Replace underscores with spaces
      .split(' ') // Split the string into words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(' '); // Join the words back into a string
};

const toNumber = (value: unknown): number => {
  return typeof value === "number" ? value : parseFloat(value as string) || 0;
};

export const AdminOverviewColumns: ColumnDef<Properties>[] = [
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
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Property" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center min-w-[260px] max-w-[500px]">
              <img src={row.original.image} alt={row.original.title} className="w-12 h-12 mr-4 rounded-full" />
              <div>
                <div className="font-medium truncate ">{row.original.title}</div>
                <div className="text-sm text-gray-500">{row.original.location}</div>
              </div>
            </div>
      )
    },
  },
  {
    accessorKey: "listingPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Listing Price" />
    ),
    cell: ({ row }) => {
      const value = toNumber(row.getValue("listingPrice"));
      return <div className="font-medium">{new Intl.NumberFormat("en-UK", {
        style: "currency",
        currency: "GBP",
      }).format(value)}</div>;
    },
  },
  {
    accessorKey: "ownershipPercentage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ownership Percentage" />
    ),
    cell: ({ row }) =>{
      const value = toNumber(row.getValue("ownershipPercentage"));
      return <div>{value.toFixed(2)}%</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
        const value = row.getValue("status") as string;
        const statusClasses = {
          "published": ["text-green-600", "bg-green-600"],
          "under_review": ["text-red-400", "bg-yellow-300"],
          "coming_soon": ["text-gray-600", "bg-gray-600"],
          "sold": ["text-red-800", "bg-red-800"],
          "default": ["text-gray-500", "bg-gray-500"],
        };
        const [textColor, dotColor] = statusClasses[value as keyof typeof statusClasses] || statusClasses.default;
        
        return (
          <div className={`flex items-center w-[140px] ${textColor}`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${dotColor}`}></div>
            <span className="font-medium">{formatStatus(value)}</span> {/* Use formatStatus here */}
          </div>
        );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActionsAdmin row={row} statuses={statuses} schema={propertySchema}/>,
  },
]



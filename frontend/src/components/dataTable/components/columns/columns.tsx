"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "@/components/ui/checkbox"
import { investmentCategories, statuses } from "../../data/data"
import { DataTableColumnHeader } from "../tasdata-table-column-header"
import { formatDistanceToNow, parseISO } from 'date-fns'; // Import necessary functions from date-fns
import {  Properties} from "../../data/schema"
import { DataTableRowActionsPManagment } from "../rows/rowActionAdminPManagment"

const toNumber = (value: unknown): number => {
  return typeof value === "number" ? value : parseFloat(value as string) || 0;
};

export const columns: ColumnDef<Properties>[] = [
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
        <div className="flex items-center min-w-[320px] max-w-[500px]">
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
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      )
      return status ? (
        <div className="flex w-[150px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      ) : null
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: "investmentCategory",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Investment Category" />
    ),
    cell: ({ row }) => {
      const investmentCategory = investmentCategories.find(
        (investmentCategory) => investmentCategory.value === row.getValue("investmentCategory")
      )
      return investmentCategory ? (
        <div className="flex items-center">
          {investmentCategory.icon && (
            <investmentCategory.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{investmentCategory.label}</span>
        </div>
      ) : null
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
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
    accessorKey: "listingDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Listing Date" />
    ),
    cell: ({ row }) =>{
      const dateValue = row.getValue("listingDate") as string;
      const formattedDate = formatDistanceToNow(parseISO(dateValue), {
        addSuffix: true, // Add 'ago' suffix
      });
      return <div className="font-medium w-[150px]">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "capRate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cap Rate" />
    ),
    cell: ({ row }) => <div>{row.getValue("capRate")}</div>,
  },
  {
    accessorKey: "propertyType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Property Type" />
    ),
    cell: ({ row }) => <div>{row.getValue("propertyType")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActionsPManagment row={row}  statuses={statuses}/>,
  },
]



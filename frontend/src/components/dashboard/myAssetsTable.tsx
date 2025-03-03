"use client";
import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AssetSmallTable } from "@/types";



export const MyAssetsTable: React.FC<{ assetsData: AssetSmallTable[] }> = ({ assetsData }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  // Helper function to safely convert a value to number
  const toNumber = (value: unknown): number => {
    return typeof value === "number" ? value : parseFloat(value as string) || 0;
  };

  // Define columns based on the available data
  const columns: ColumnDef<AssetSmallTable>[] = [];

  if (Array.isArray(assetsData) && assetsData.length > 0) {
    const asset = assetsData[0];

    // Add columns dynamically based on the asset data
    if (asset.first_image && asset.title) {
      columns.push({
        accessorKey: "title",
        header: "Upcoming Rent Payments",
        cell: ({ row }) => (
          <div className="flex items-center ">
            <img src={row.original.first_image} alt={row.original.title} className="w-12 h-12 mr-4 rounded-full" />
            <div>
              <div className="font-bold">{row.original.title}</div>
              <div className="text-sm text-gray-500">{row.original.location}</div>
            </div>
          </div>
        ),
      });
    }

     // Add a utility function to add numeric columns (like rent_amount, price, returns) with optional currency/percentage format
     const addNumberColumn = (key: keyof AssetSmallTable, label: string, currency?: boolean, percentage?: boolean) => {
      asset[key] != null && columns.push({
        accessorKey: key,
        header: label,
        cell: ({ row }) => {
          const value = toNumber(row.getValue(key));
          let formatted = "";
          if (currency) {
            formatted = new Intl.NumberFormat("en-UK", { style: "currency", currency: "GBP" }).format(value);
          } else if (percentage) {
            formatted = `${value.toFixed(2)}%`;
          } else {
            formatted = value.toFixed(2);
          }
          return <div className="font-medium">{formatted}</div>;
        },
      });
    };

  // Amount column with sorting toggle
      asset.rent_amount != null && columns.push({
        accessorKey: "rent_amount",
        header: () => (
          <div className="flex items-center w-[150px]">
            <span>Amount</span>
            <button
              onClick={() => setSorting([{ id: "rent_amount", desc: !sorting[0]?.desc }])}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              {sorting[0]?.desc ? "↑" : "↓"}
            </button>
          </div>
        ),
        cell: ({ row }) => {
          const value = toNumber(row.getValue("rent_amount"));
          const formatted = new Intl.NumberFormat("en-UK", {
            style: "currency",
            currency: "GBP",
          }).format(value);
          return <div className="font-medium">{formatted}</div>;
        },
      });
      

    // Date columns
    const addDateColumn = (key: keyof AssetSmallTable, label: string) => {
      asset[key] && columns.push({
        accessorKey: key,
        header: label,
        cell: ({ row }) => {
          const dateValue = row.getValue(key) as string;
          return <div className="font-medium">{dateValue}</div>;
        },
      });
    };

    addDateColumn("rental_due_day", "Payment Date");
    addNumberColumn("projected_annual_return", "Projected Annual Return", false, true); // Projected Annual Return (formatted as percentage)
    addNumberColumn("projected_annual_yield", "Projected Annual Yield", false, true); // Projected Annual Yield (formatted as percentage)
    addNumberColumn("projected_rental_yield", "Projected Rental Yield", false, true); // Projected Rental Yield (formatted as percentage)


  }

  // Set up the React Table instance
  const table = useReactTable({
    data: assetsData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="border-t">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

import React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
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

import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { DownloadCSV } from "@/components/downloads/DownloadCSV";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isDownloadable?:boolean,
  onRowClick?: (referenceNumber: string) => void;
  filterOptions: Array<{ column: string; title: string; options: Array<{ label: string; value: string }> }>;
}
interface RowData {
  id?: string;
  reference_number?:string;
  title: string;
}

export function DataTable<TData extends RowData, TValue>({
  columns,
  data,
  isDownloadable,
  filterOptions,
  onRowClick
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    totalTokens: false,
    performanceStatus: false,
  });

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const handleRowClickInternal = (row: TData) => {
    if (onRowClick && row.reference_number) {
      onRowClick(row.reference_number);
    }
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  // Filtrar las filas seleccionadas
  const selectedRows = table.getRowModel().rows.filter(row => rowSelection[row.id]);

// Filtrar los datos según las filas seleccionadas
const selectedProperties = data.filter((property) => 
  selectedRows.some((row) => row.original.title === property.title) // Compara el 'id' de la fila con el 'id' de la propiedad
);

const handleDownload = () =>{
  DownloadCSV(selectedProperties, "my-assets.csv")
}
  return (
    <section>
      <div className="space-y-4">
        <DataTableToolbar filterOptions={filterOptions} table={table} />
        {isDownloadable && (
          <Button 
            disabled={selectedProperties.length === 0} 
            onClick={handleDownload}
            title="Download CSV">
            Download CSV
          </Button>
        )}
       
        <div className="rounded-md border flex flex-col w-full overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleRowClickInternal(row.original)}
                    data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, {
                        ...cell.getContext(),
                      })}
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
        <DataTablePagination table={table} />
      </div>
    </section>
  );
}



"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"


interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filterOptions: Array<{ column: string, title: string, options: Array<{ label: string, value: string }> }> // Especifica el tipo esperado
}

export function DataTableToolbar<TData>({
  table,
  filterOptions = [],  // Valor por defecto como array vacío
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;  

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter properties..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {/* Mapeo dinámico de filtros */}
        {filterOptions.length > 0 && filterOptions.map((filter) => (
          table.getColumn(filter.column) && (
            <DataTableFacetedFilter
              key={filter.column}
              column={table.getColumn(filter.column)}
              title={filter.title}
              options={filter.options}
            />
          )
        ))}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}

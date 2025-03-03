import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import {  propertyType,  } from "../../data/data"
import { HomeProperties } from "../../data/schema"
import { DataTableColumnHeader } from "../tasdata-table-column-header"
import positiveNumber from "../../../../assets/postiveNumber.svg"
import negativeNumber from "../../../../assets/negativeNumber.svg"


const toNumber = (value: unknown): number => {
  return typeof value === "number" ? value : parseFloat(value as string) || 0;
};

export const HomePropertyColumns: ColumnDef<HomeProperties>[] = [
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
        <div className="flex items-center min-w-[100px] max-w-[200px]">
          <div>
            <div className="font-medium truncate ">{row.original.title}</div>
            <div className="text-sm text-gray-500">{row.original.location}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const value = toNumber(row.getValue("price"));
      return <div className="font-medium">{new Intl.NumberFormat("en-UK", {
        style: "currency",
        currency: "GBP",
      }).format(value)}</div>;
    },
  },
  {
    accessorKey: "price_increase_percentage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price Chart" />
    ),
    cell: ({ row }) => {
      const priceChartValue = row.getValue("price_increase_percentage") as number;
  
      // Determinamos el src dinámicamente
      const imgSrc = priceChartValue > 0 
        ? positiveNumber // Imagen para valores positivos
        : priceChartValue < 0 
        ? negativeNumber // Imagen para valores negativos
        : "/path/to/neutral-image.png"; // Imagen para el caso de valor 0
  
      return (
        <div className="flex space-x-3 items-center">
          <p className={`${priceChartValue > 0 ? "text-green-500" : "text-red-500"}`}>{priceChartValue}%</p>
          <img
            src={imgSrc}
            alt="Price chart indicator"
            className="w-12 h-12" // Ajusta el tamaño según sea necesario
          />
        </div>
      );
    },
  }, 
  {
    accessorKey: "projected_rental_yield",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rental Yield" />
    ),
    cell: ({ row }) => <div>{row.getValue("projected_rental_yield")}%</div>,
  },  
  {
    accessorKey: "cap_rate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cap Rate" />
    ),
    cell: ({ row }) => <div>{row.getValue("cap_rate")}%</div>,
  },  
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      // Asegura que el valor es un string
      const occupancyStatus = row.getValue("status") as string;
      // Capitaliza la primera letra
      const capitalizedStatus = occupancyStatus.charAt(0).toUpperCase() + occupancyStatus.slice(1);
      return <div>{capitalizedStatus}</div>;
    },
  },  
  {
    accessorKey: "investment_category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => <div>{row.getValue("investment_category")}</div>,
  },
  {
    accessorKey: "property_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Property Type" />
    ),
    cell: ({ row }) => {
      const propertyTypes = propertyType.find(
        (status) => status.value === row.getValue("property_type")
      )
      return propertyTypes ? (
        <div className="flex w-[150px] items-center">
          {propertyTypes.icon && (
            <propertyTypes.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{propertyTypes.label}</span>
        </div>
      ) : null
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: "availableTokens",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Available Tokens" />
    ),
    cell: ({ row }) =>{
      const tokens = row.original.tokens;
      if (!tokens || tokens.length === 0) return <span>No tokens</span>;
  
      const availableTokens = parseInt(tokens[0].tokens_available);
      const totalTokens = parseInt(tokens[0].total_tokens);
      const tokensPercentage = totalTokens > 0 ? (availableTokens * 100) / totalTokens : 0;
  
      return(
        <div className="flex flex-col">
          <span className="text-[#82A621] font-bold">{tokensPercentage.toFixed(2)}%</span>
          <span>{availableTokens} of {totalTokens}</span>
        </div>
      );
    }
  }
]


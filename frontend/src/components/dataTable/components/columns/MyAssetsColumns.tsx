import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import positiveNumber from "../../../../assets/postiveNumber.svg";
import negativeNumber from "../../../../assets/negativeNumber.svg";
import { DataTableColumnHeader } from "../tasdata-table-column-header";
import { RowData } from "@/types";

// Función para convertir el valor a número
const toNumber = (value: unknown): number => {
  return typeof value === "number" ? value : parseFloat(value as string) || 0;
};

// Definimos las columnas para `MyAssets`
export const MyAssetsColumns: ColumnDef<RowData, unknown>[] = [
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
    header: ({ column }) => <DataTableColumnHeader column={column} title="Property" />,
    cell: ({ row }) => (
      <div className="flex items-center min-w-[320px] max-w-[500px]">
        <img
          src={row.original.first_image}
          alt={row.original.title}
          className="w-12 h-12 mr-4 rounded-full"
        />
        <div>
          <div className="font-medium truncate">{row.original.title}</div>
          <div className="text-sm text-gray-500">{row.original.location}</div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
    cell: ({ row }) => {
      const value = toNumber(row.getValue("price"));
      return (
        <div className="font-medium">
          {new Intl.NumberFormat("en-UK", {
            style: "currency",
            currency: "GBP",
          }).format(value)}
        </div>
      );
    },
  },
  {
    accessorKey: "price_increase_percentage",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Price Chart" />,
    cell: ({ row }) => {
      const priceChartValue = row.getValue("price_increase_percentage") as number;
      const imgSrc =
        priceChartValue > 0
          ? positiveNumber
          : priceChartValue < 0
          ? negativeNumber
          : "/path/to/neutral-image.png";
      return (
        <div className="flex space-x-3 items-center">
          <p
            className={`${
              priceChartValue > 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {priceChartValue}%
          </p>
          <img src={imgSrc} alt="Price chart indicator" className="w-12 h-12" />
        </div>
      );
    },
  },
  {
    accessorKey: "projected_rental_yield",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Yield" />,
    cell: ({ row }) => <div>{row.getValue("projected_rental_yield")}</div>,
  },
  {
    accessorKey: "cap_rate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cap Rate" />,
    cell: ({ row }) => <div>{row.getValue("cap_rate")}</div>,
  },
  {
    accessorKey: "ocupancy_status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const occupancyStatus = row.getValue("ocupancy_status");
      return typeof occupancyStatus === "string" && occupancyStatus.length > 0
        ? <div>{occupancyStatus.charAt(0).toUpperCase() + occupancyStatus.slice(1)}</div>
        : <div>Not Available</div>;
    },
  },
  {
    accessorKey: "property_type",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Property Type" />,
    cell: ({ row }) => <div>{row.getValue("property_type")}</div>,
  },
  {
    accessorKey: "user_tokens",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Available Tokens" />,
    cell: ({ row }) => {
      const tokensPercentage =
        (parseInt(row.getValue("user_tokens")) * 100) /
        parseInt(row.getValue("totalTokens"));
      return (
        <div className="flex flex-col">
          <span className="text-[#82A621] font-bold">
            {tokensPercentage.toFixed(2)}%
          </span>
          <span>
            {row.getValue("user_tokens")} of {row.getValue("totalTokens")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "totalTokens",
    header: "Total Tokens",
    cell: ({ row }) => <div>{row.getValue("totalTokens")}</div>,
  },
];

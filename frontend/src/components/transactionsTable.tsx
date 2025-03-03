import React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNowStrict } from "date-fns";
import { FormatCurrency } from "./currencyConverter";
import { Transaction } from "@/types";

interface TransactionTableProps {
  transactions: Transaction[];
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Define las columnas de forma condicional
  const columns: ColumnDef<Transaction>[] = [];

  // Si existe "event", agrega la columna "Event"
  if (transactions.some(t => t.event)) {
    columns.push({
      accessorKey: "event",
      header: "Event",
      cell: ({ row }) => {
        const event = row.getValue<string>("event");
        let eventColor = "text-gray-500"; // Color predeterminado

        // Determinar color según el tipo de evento
        if (event === "SELL") {
          eventColor = "text-blue-500";
        } else if (event === "CANCELLATION") {
          eventColor = "text-red-500";
        } else if (event === "BUY") {
          eventColor = "text-[#C8E870]";
        }
        return <div className={eventColor}>{event}</div>;
      },
    });
  }

  // Si existe "transaction_owner_email", agrega la columna "Owner"
  if (transactions.some(t => t.transaction_owner_email)) {
    columns.push({
      accessorKey: "transaction_owner_email",
      header: "Owner",
      cell: ({ row }) => {
        const owner = row.getValue<string>("transaction_owner_email");
        return <div className="lowercase">{owner.slice(0,5) + "..."+  owner.slice(-4)}</div>;
      },
    });
  }

  // Si existe "transaction_amount", agrega la columna "Amount"
  if (transactions.some(t => t.transaction_amount)) {
    columns.push({
      accessorKey: "transaction_amount",
      header: () => (
        <div className="flex items-center justify-end">
          <span>Amount (GBP)</span>
          <button
            onClick={() => setSorting([{ id: "transaction_amount", desc: !sorting[0]?.desc }])}
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            {sorting[0]?.desc ? "↑" : "↓"}
          </button>
        </div>
      ),
      cell: ({ row }) => {
        const amount = Number(row.getValue<string>("transaction_amount")); // Convertir a número
        const formattedAmount = new Intl.NumberFormat("en-UK", {
          style: "currency",
          currency: "GBP",
        }).format(amount);

        return <div className="text-right font-medium">{formattedAmount}</div>;
      },
      sortingFn: (rowA, rowB) => {
        const amountA = Number(rowA.getValue<string>("transaction_amount")) || 0;
        const amountB = Number(rowB.getValue<string>("transaction_amount")) || 0;
        return amountA - amountB;
      },
    });
  }

  // Si existe "transaction_tokens_amount", agrega la columna "Token Quantity"
  if (transactions.some(t => t.transaction_tokens_amount)) {
    columns.push({
      accessorKey: "transaction_tokens_amount",
      header: () => <div className="text-right">Token Quantity</div>,
      cell: ({ row }) => {
        const tokens = Number(row.getValue<string>("transaction_tokens_amount")); // Convertir a número
        return <div className="text-right">{tokens}</div>;
      },
      sortingFn: (rowA, rowB) => {
        const tokensA = Number(rowA.getValue<string>("transaction_tokens_amount")) || 0;
        const tokensB = Number(rowB.getValue<string>("transaction_tokens_amount")) || 0;
        return tokensA - tokensB;
      },
    });
  }

  // Si existe "transaction_date", agrega la columna "Date"
  if (transactions.some(t => t.transaction_date)) {
    columns.push({
      accessorKey: "transaction_date", 
      header: "Date",
      cell: ({ row }) => {
        const dateString = row.getValue<string>("transaction_date");
        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
          return <div>Invalid date</div>;
        }

        const formattedDate = formatDistanceToNowStrict(date, { addSuffix: true });
        return <div className="min-w-[100px]">{formattedDate}</div>;
      },
    });
  }

  // Si existe "buyOrder", agrega la columna "Buy Orders"
  if (transactions.some(t => t.buyOrder && t.buyOrder.length > 0)) {
    columns.push({
      accessorKey: "buyOrder", // El nombre de la propiedad
      header: "Buy Orders",
      cell: ({ row }) => {
        const buyOrders = row.getValue<{ orderPrice: number; orderAmount?: number }[]>("buyOrder");

        // Mostrar todas las órdenes de compra de la transacción
        return (
          <div>
            {buyOrders.map((order, index) => (
              <div key={index} className="flex  min-w-[120px] justify-between">
                <span ><FormatCurrency amount={order.orderPrice}/></span>
                <span>{order.orderAmount ? order.orderAmount : "0"} Tokens</span>
              </div>
            ))}
          </div>
        );
      },
    });
  }

  if (transactions.some(t => t.sellOrder && t.sellOrder.length > 0)) {
    columns.push({
      accessorKey: "sellOrder", // El nombre de la propiedad
      header: "Sell Orders",
      cell: ({ row }) => {
        const buyOrders = row.getValue<{ orderPrice: number; orderAmount?: number }[]>("sellOrder");

        // Mostrar todas las órdenes de compra de la transacción
        return (
          <div>
            {buyOrders.map((order, index) => (
              <div key={index} className="flex min-w-[120px] justify-between">
                <span><FormatCurrency amount={order.orderPrice}/></span>
                <span>{order.orderAmount ? order.orderAmount : "0"} Tokens</span>
              </div>
            ))}
          </div>
        );
      },
    });
  }

  
  if (transactions.some(t => t.trade_price)) {
    columns.push({
      accessorKey: "trade_price",
      header: "Trade Price",
      cell: ({ row }) => {
        const price = Number(row.getValue<string>("trade_price"));
        const formattedPrice = new Intl.NumberFormat("en-UK", {
          style: "currency",
          currency: "GBP",
        }).format(price);
        return <div className="text-right font-medium">{formattedPrice}</div>;
      },
    });
  }
  
  if (transactions.some(t => t.trade_quantity)) {
    columns.push({
      accessorKey: "trade_quantity",
      header: "Trade Quantity",
      cell: ({ row }) => {
        const quantity = Number(row.getValue<string>("trade_quantity"));
        return <div className="text-right">{quantity}</div>;
      },
    });
  }
  
  if (transactions.some(t => t.executed_at)) {
    columns.push({
      accessorKey: "executed_at",
      header: "Traded At",
      cell: ({ row }) => {
        const dateString = row.getValue<string>("executed_at");
        const date = new Date(dateString);
  
        if (isNaN(date.getTime())) {
          return <div>Invalid date</div>;
        }
  
        const formattedDate = formatDistanceToNowStrict(date, { addSuffix: true });
        return <div className="min-w-[100px]">{formattedDate}</div>;
      },
    });
  }
  if (transactions.some(t => t.seller_address)) {
    columns.push({
      accessorKey: "seller_address",
      header: "Seller Address",
      cell: ({ row }) => {
        const address = row.getValue<string>("seller_address");
        return (
          <div className="lowercase">{address.slice(0, 4) + "..." + address.slice(-4)}</div>
        );
      },
    });
  }
  
  if (transactions.some(t => t.buyer_address)) {
    columns.push({
      accessorKey: "buyer_address",
      header: "Buyer Address",
      cell: ({ row }) => {
        const address = row.getValue<string>("buyer_address");
        return (
          <div className="lowercase">{address.slice(0, 4) + "..." + address.slice(-4)}</div>
        );
      },
    });
  }
  
  

  const table = useReactTable({
    data: transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    enableSorting: true,
    initialState: {
      pagination: {
        pageSize: 10, 
      },
    },
     
  });

  return (
    <div className="w-full py-5">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
        <div className="space-x-2">
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
    </div>
  );
};

// DataTableRowActionsInvestorTrading.tsx
import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { MyAssets, myAssetsSchema } from "../../data/schema";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
interface DataTableRowActionsProps {
  row: Row<MyAssets>;
}

export function DataTableRowActionsInvestorAssets({
  row,
}: DataTableRowActionsProps) {
  const navigate = useNavigate();
  // Validar los datos de la fila con Zod
  const properties = myAssetsSchema.parse(row.original);
  const navigateTo = (path: string) => {
    navigate(path);
  };



  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          {/* Botón para actualizar */}
          <DropdownMenuItem onClick={() => navigateTo(`/property-details/${properties.id}/`)}>
            Check Property
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

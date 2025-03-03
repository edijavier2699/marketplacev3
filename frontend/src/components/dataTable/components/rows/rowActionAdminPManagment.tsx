import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { propertySchema, Properties } from "../../data/schema"; // Import Properties type
import { useNavigate } from "react-router-dom";

// Define possible status types
interface Status {
  value: string;
  label: string;
  icon: React.ElementType;
}

interface DataTableRowActionsProps {
  row: Row<Properties>; // Use Properties type directly
  statuses: Status[]; // Define possible status options
}

// Component for row actions in the data table
export function DataTableRowActionsPManagment({
  row,
  statuses,
}: DataTableRowActionsProps) {
  const navigate = useNavigate();

  // Validate the row data using the schema (no need to parse again if properties are already typed)
  const properties = propertySchema.parse(row.original); // This validates the row data

  // Helper function to handle navigation based on dynamic path
  const navigateTo = (path: string) => {
    navigate(path);
  };

  
  return (
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
        {/* Update property option */}
        <DropdownMenuItem onClick={() => navigateTo(`/dashboard-property/${properties.id}/`)}>
          Update
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() =>  navigateTo(`/property/smart-contract/${properties.referenceNumber}/`)}>
          Smart Contract
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigateTo(`/property/${properties.referenceNumber}/`)}>
          Check Property
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        {/* Submenu to change the property's status */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={properties.status || ""}>
              {statuses.map((statusItem) => (
                <DropdownMenuRadioItem key={statusItem.value} value={statusItem.value}>
                  <div className="flex items-center">
                    <statusItem.icon className="mr-2 h-4" />
                    {statusItem.label}
                  </div>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

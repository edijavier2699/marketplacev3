"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerWithRangeProps {
  className?: string;
  startDate: Date | undefined; // Changed to undefined
  endDate: Date | undefined; // Changed to undefined
  setStartDate: (date: Date | undefined) => void; // Changed to undefined
  setEndDate: (date: Date | undefined) => void; // Changed to undefined
}

export const DatePickerWithRange: React.FC<DatePickerWithRangeProps> = ({
  className,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) => {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: startDate,
    to: endDate,
  });

  const [selectedDate, setSelectedDate] = React.useState<DateRange | undefined>(date);
  const [open, setOpen] = React.useState(false); // Control the visibility of the popover

  React.useEffect(() => {
    setDate({
      from: startDate,
      to: endDate,
    });
    setSelectedDate({
      from: startDate,
      to: endDate,
    });
  }, [startDate, endDate]);

  // Handle date selection
  const handleSelect = (selectedRange: DateRange | undefined) => {
    setSelectedDate(selectedRange);
  };

  // Apply the selected dates
  const handleApply = () => {
    if (selectedDate) {
      setStartDate(selectedDate.from);
      setEndDate(selectedDate.to);
    } else {
      setStartDate(undefined);
      setEndDate(undefined);
    }
    setDate(selectedDate); // Update the local state
    setOpen(false); // Close the popover
  };

  // Handle reset dates
const handleReset = () => {
  setSelectedDate(undefined); // Limpiar la selección de fechas localmente
  setStartDate(undefined); // Limpiar la fecha de inicio
  setEndDate(undefined); // Limpiar la fecha de fin
  setDate(undefined); // Limpiar el estado del rango de fechas
  setOpen(false); // Cerrar el popover (opcional)
};


  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "max-w-md justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={selectedDate}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
          <div className="flex justify-end p-2 space-x-2">
            <Button variant="outline"  onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button variant="default" onClick={handleApply}>
              Apply
            </Button>
            <Button onClick={handleReset}>Reset Days</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

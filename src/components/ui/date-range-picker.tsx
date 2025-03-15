
import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateRangePickerProps {
  date: DateRange | undefined;
  onDateChange: (date: DateRange) => void;
  className?: string;
}

export function DateRange({
  date,
  onDateChange,
  className,
}: DateRangePickerProps) {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  // Predefined ranges
  const handleRangeSelection = (value: string) => {
    const today = new Date();
    switch (value) {
      case "today":
        onDateChange({
          from: today,
          to: today,
        });
        break;
      case "yesterday":
        const yesterday = addDays(today, -1);
        onDateChange({
          from: yesterday,
          to: yesterday,
        });
        break;
      case "last7":
        onDateChange({
          from: addDays(today, -6),
          to: today,
        });
        break;
      case "last30":
        onDateChange({
          from: addDays(today, -29),
          to: today,
        });
        break;
      case "thisMonth": {
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        onDateChange({
          from: firstDay,
          to: lastDay,
        });
        break;
      }
      case "lastMonth": {
        const firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth(), 0);
        onDateChange({
          from: firstDay,
          to: lastDay,
        });
        break;
      }
      case "thisYear": {
        const firstDay = new Date(today.getFullYear(), 0, 1);
        const lastDay = new Date(today.getFullYear(), 11, 31);
        onDateChange({
          from: firstDay,
          to: lastDay,
        });
        break;
      }
      case "clear":
        onDateChange({ from: undefined, to: undefined });
        break;
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
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
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto flex flex-col space-y-2 p-2"
          align="start"
        >
          <Select onValueChange={handleRangeSelection}>
            <SelectTrigger>
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="last7">Last 7 days</SelectItem>
              <SelectItem value="last30">Last 30 days</SelectItem>
              <SelectItem value="thisMonth">This month</SelectItem>
              <SelectItem value="lastMonth">Last month</SelectItem>
              <SelectItem value="thisYear">This year</SelectItem>
              <SelectItem value="clear">Clear selection</SelectItem>
            </SelectContent>
          </Select>
          <div className="border rounded-md p-3">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={(selectedDate) => {
                if (selectedDate) {
                  onDateChange(selectedDate);
                }
              }}
              numberOfMonths={2}
            />
          </div>
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={() => {
                setIsPopoverOpen(false);
              }}
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

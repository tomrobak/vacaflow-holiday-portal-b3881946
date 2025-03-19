
import React from "react";
import { DateRange } from "react-day-picker";
import { X } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface CalendarHeaderProps {
  dateRange: DateRange | undefined;
  onClearDates: () => void;
  calculateNights: () => number;
}

const CalendarHeader = ({ dateRange, onClearDates, calculateNights }: CalendarHeaderProps) => {
  if (!dateRange?.from || !dateRange?.to) return null;

  return (
    <div className="flex justify-between items-center mb-5 px-1">
      <div className="flex-1">
        <h3 className="text-lg font-semibold">Your trip</h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          {calculateNights()} night{calculateNights() !== 1 ? 's' : ''}
        </p>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              onClick={onClearDates} 
              className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-accent"
              aria-label="Clear dates"
            >
              <X className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Clear selected dates</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default CalendarHeader;

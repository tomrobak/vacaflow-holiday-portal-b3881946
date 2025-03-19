
import React from "react";
import { DateRange } from "react-day-picker";
import { format, differenceInDays } from "date-fns";
import { CalendarDays } from "lucide-react";

interface TripSummaryProps {
  dateRange: DateRange;
  onClearDates: () => void;
}

const TripSummary = ({ dateRange, onClearDates }: TripSummaryProps) => {
  // Calculate total nights if a date range is selected
  const calculateNights = () => {
    if (dateRange.from && dateRange.to) {
      return differenceInDays(dateRange.to, dateRange.from);
    }
    return 0;
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return format(date, "EEE, MMM d, yyyy");
  };

  if (!dateRange.from) return null;
  
  return (
    <div className="mt-6 px-1.5">
      <div className="calendar-selection-summary flex flex-col space-y-4">
        {dateRange.from && (
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium flex items-center gap-1.5">
              <div className="calendar-legend-dot bg-primary"></div>
              Check-in
            </div>
            <div className="font-medium">{formatDate(dateRange.from)}</div>
          </div>
        )}
        
        {dateRange.to && dateRange.from !== dateRange.to && (
          <>
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium flex items-center gap-1.5">
                <div className="calendar-legend-dot bg-primary"></div>
                Check-out
              </div>
              <div className="font-medium">{formatDate(dateRange.to)}</div>
            </div>
            
            <div className="pt-3 border-t border-border flex justify-between items-center">
              <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                Total Stay
              </div>
              <div className="font-semibold">{calculateNights()} night{calculateNights() !== 1 ? 's' : ''}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TripSummary;

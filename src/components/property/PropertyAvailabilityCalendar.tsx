
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Property } from "@/types/property";
import { DateRange } from "react-day-picker";
import { addDays, differenceInDays, isPast, format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Info, CalendarDays, X } from "lucide-react";

interface PropertyAvailabilityCalendarProps {
  property: Property;
}

const PropertyAvailabilityCalendar = ({ property }: PropertyAvailabilityCalendarProps) => {
  const [date, setDate] = useState<DateRange | undefined>();
  const [numberOfMonths, setNumberOfMonths] = useState(2);
  
  // In a real app, you would fetch booked dates from an API
  const bookedDates = [
    { from: addDays(new Date(), 2), to: addDays(new Date(), 5) },
    { from: addDays(new Date(), 14), to: addDays(new Date(), 18) },
  ];
  
  // Function to check if a date is unavailable
  const isDateUnavailable = (date: Date) => {
    // Check if date is in the past
    if (isPast(date) && date.setHours(0, 0, 0, 0) !== new Date().setHours(0, 0, 0, 0)) {
      return true;
    }
    
    // Check if date is outside availability range
    if (date < property.availableFrom || date > property.availableTo) {
      return true;
    }
    
    // Check if date falls within any booked period
    return bookedDates.some(
      ({ from, to }) => 
        date >= from && date <= to
    );
  };

  // Calculate total nights if a date range is selected
  const calculateNights = () => {
    if (date?.from && date?.to) {
      return differenceInDays(date.to, date.from);
    }
    return 0;
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return format(date, "MMM d, yyyy");
  };

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      setNumberOfMonths(window.innerWidth < 768 ? 1 : 2);
    };
    
    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  // Clear selected dates
  const handleClearDates = () => {
    setDate(undefined);
  };
  
  return (
    <Card className="bg-card border shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            <CalendarDays className="h-5 w-5 text-primary" />
            Availability
          </CardTitle>
          
          {date?.from && date?.to && (
            <div className="flex gap-2 items-center">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 px-2 py-1">
                {calculateNights()} night{calculateNights() !== 1 ? 's' : ''}
              </Badge>
              <button 
                onClick={handleClearDates} 
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear dates"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        
        {date?.from && date?.to ? (
          <div className="text-sm mt-1 text-muted-foreground">
            <span>{formatDate(date.from)} — {formatDate(date.to)}</span>
          </div>
        ) : (
          <div className="flex items-center text-sm mt-1 text-muted-foreground">
            <Info className="mr-1 h-4 w-4" />
            <span>Select dates to check availability</span>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="rounded-lg border bg-background p-1 sm:p-2">
          <Calendar
            mode="range"
            selected={date}
            onSelect={setDate}
            numberOfMonths={numberOfMonths}
            disabled={isDateUnavailable}
            classNames={{
              day_disabled: "bg-red-50/30 text-red-300 opacity-70",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground font-bold",
              day_range_middle: "bg-primary/15 text-foreground",
              day_hidden: "invisible",
              nav_button: "hover:bg-accent text-foreground transition-colors",
              table: "w-full border-collapse space-y-1",
              head_row: "flex w-full",
              row: "flex w-full mt-2",
              head_cell: "text-muted-foreground rounded-md w-10 font-normal text-[0.8rem] sm:w-14",
              cell: "relative p-0 text-center text-sm sm:text-base w-10 sm:w-14 h-10 sm:h-14",
              day: "h-9 w-9 sm:h-10 sm:w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-full transition-colors",
            }}
            defaultMonth={new Date()}
            className="w-full rounded-md"
          />
        </div>
        
        <div className="mt-4 flex flex-wrap gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-primary"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-300"></div>
            <span>Unavailable</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-primary/15"></div>
            <span>In Range</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-accent"></div>
            <span>Today</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyAvailabilityCalendar;

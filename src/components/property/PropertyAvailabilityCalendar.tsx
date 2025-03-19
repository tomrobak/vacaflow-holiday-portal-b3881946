
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Property } from "@/types/property";
import { DateRange } from "react-day-picker";
import { addDays, differenceInDays, isPast, format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { 
  Info, 
  CalendarDays, 
  X, 
  CalendarCheck, 
  CalendarX 
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    <Card className="shadow-none border border-border rounded-xl overflow-hidden">
      <CardHeader className="pb-3 pt-5 px-5">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            <CalendarDays className="h-5 w-5 text-primary" />
            Availability
          </CardTitle>
          
          {date?.from && date?.to && (
            <div className="flex gap-2 items-center">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 px-2.5 py-1 font-medium rounded-full">
                {calculateNights()} night{calculateNights() !== 1 ? 's' : ''}
              </Badge>
              <button 
                onClick={handleClearDates} 
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-accent"
                aria-label="Clear dates"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        
        {date?.from && date?.to ? (
          <div className="text-sm mt-2 text-muted-foreground font-medium flex items-center">
            <span>{formatDate(date.from)} — {formatDate(date.to)}</span>
          </div>
        ) : (
          <div className="flex items-center text-sm mt-2 text-muted-foreground">
            <Info className="mr-1.5 h-4 w-4 text-muted-foreground/70" />
            <span>Select check-in and check-out dates</span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="px-4 pb-5">
        <div className="rounded-lg border bg-card overflow-hidden">
          <Calendar
            mode="range"
            selected={date}
            onSelect={setDate}
            numberOfMonths={numberOfMonths}
            disabled={isDateUnavailable}
            classNames={{
              day_disabled: "text-red-300 line-through opacity-50",
              day_selected: "!bg-primary !text-primary-foreground hover:!bg-primary hover:!text-primary-foreground focus:!bg-primary focus:!text-primary-foreground",
              day_today: "bg-accent text-accent-foreground font-bold",
              day_range_middle: "!bg-primary/15 !text-foreground",
              day_hidden: "invisible",
              nav_button: "hover:bg-accent text-foreground transition-colors",
              cell: "relative p-0 text-center text-sm first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: "h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors",
              caption: "flex justify-center pt-1 relative items-center text-sm font-medium",
              nav: "space-x-1 flex items-center",
              table: "w-full border-collapse space-y-1",
              head_row: "flex w-full",
              row: "flex w-full mt-2",
              head_cell: "text-muted-foreground rounded-md w-10 font-normal text-[0.8rem] sm:w-12",
              caption_label: "text-sm font-semibold",
            }}
            defaultMonth={new Date()}
            weekStartsOn={1}
            fixedWeeks
            className="w-full rounded-md"
          />
        </div>
        
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
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

        <div className="mt-6">
          {date?.from && date?.to && (
            <div className="rounded-xl border bg-accent/10 p-4 flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Check-in</span>
                </div>
                <span className="font-medium">{formatDate(date.from)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarX className="h-4 w-4 text-red-600" />
                  <span className="font-medium">Check-out</span>
                </div>
                <span className="font-medium">{formatDate(date.to)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between items-center">
                <span className="text-muted-foreground">Total stay</span>
                <span className="font-medium">{calculateNights()} night{calculateNights() !== 1 ? 's' : ''}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyAvailabilityCalendar;

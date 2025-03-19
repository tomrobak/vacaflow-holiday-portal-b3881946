
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Property } from "@/types/property";
import { DateRange } from "react-day-picker";
import { addDays, differenceInDays, isPast } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Info, CalendarDays } from "lucide-react";

interface PropertyAvailabilityCalendarProps {
  property: Property;
}

const PropertyAvailabilityCalendar = ({ property }: PropertyAvailabilityCalendarProps) => {
  const [date, setDate] = useState<DateRange | undefined>();
  
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
  
  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <CalendarDays className="h-5 w-5 text-primary" />
            Availability Calendar
          </CardTitle>
          
          {date?.from && date?.to && (
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
              {calculateNights()} night{calculateNights() !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="mb-2 flex items-center text-sm text-muted-foreground">
          <Info className="mr-1 h-4 w-4" />
          <span>Select dates to see availability</span>
        </div>
        
        <div className="rounded-lg border bg-card p-1 sm:p-2">
          <Calendar
            mode="range"
            selected={date}
            onSelect={setDate}
            numberOfMonths={window.innerWidth < 768 ? 1 : 2}
            disabled={isDateUnavailable}
            classNames={{
              day_disabled: "bg-red-50/50 text-red-400 opacity-50",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground font-bold",
              day_range_middle: "bg-primary/20 text-foreground",
              day_hidden: "invisible",
              nav_button: "hover:bg-primary/10 text-foreground",
              table: "w-full border-collapse space-y-1",
              head_row: "flex w-full",
              row: "flex w-full mt-2",
              head_cell: "text-muted-foreground rounded-md w-10 font-normal text-[0.8rem] sm:w-14",
              cell: "relative p-0 text-center text-sm sm:text-base w-10 sm:w-14 h-10 sm:h-14",
              day: "h-9 w-9 sm:h-10 sm:w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-full",
            }}
            defaultMonth={new Date()}
            className="w-full rounded-md"
          />
        </div>
        
        <div className="mt-4 flex gap-3 text-sm">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-primary"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-400/50"></div>
            <span>Unavailable</span>
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

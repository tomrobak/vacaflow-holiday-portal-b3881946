
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Property } from "@/types/property";
import { DateRange } from "react-day-picker";
import { addDays, differenceInDays, isPast, format, isSameMonth } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyAvailabilityCalendarProps {
  property: Property;
}

const PropertyAvailabilityCalendar = ({ property }: PropertyAvailabilityCalendarProps) => {
  const [date, setDate] = useState<DateRange | undefined>();
  const [numberOfMonths, setNumberOfMonths] = useState(2);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
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

  // Custom footer component for the calendar selection summary
  const renderSelectionSummary = () => {
    if (!date?.from) return null;
    
    return (
      <div className="mt-6 px-1.5">
        <div className="bg-accent/30 rounded-xl p-4 flex flex-col space-y-4">
          {date.from && (
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Check-in</div>
              <div className="font-medium">{formatDate(date.from)}</div>
            </div>
          )}
          
          {date.to && date.from !== date.to && (
            <>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Check-out</div>
                <div className="font-medium">{formatDate(date.to)}</div>
              </div>
              
              <div className="pt-2 border-t border-border flex justify-between items-center">
                <div className="text-sm text-muted-foreground">Total</div>
                <div className="font-semibold">{calculateNights()} nights</div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };
  
  const handleMonthChange = (month: Date) => {
    setCurrentMonth(month);
  };

  // Determine if we should show a single month
  const shouldShowSingleMonth = window.innerWidth < 768;

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-0">
        {date?.from && date?.to && (
          <div className="flex justify-between items-center mb-4 px-1">
            <div className="flex-1">
              <h3 className="text-lg font-semibold">Your trip</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                {calculateNights()} night{calculateNights() !== 1 ? 's' : ''}
              </p>
            </div>
            <button 
              onClick={handleClearDates} 
              className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-accent"
              aria-label="Clear dates"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="airbnb-style-calendar">
          <Calendar
            mode="range"
            selected={date}
            onSelect={setDate}
            numberOfMonths={numberOfMonths}
            disabled={isDateUnavailable}
            month={currentMonth}
            onMonthChange={handleMonthChange}
            classNames={{
              day_disabled: "text-red-300 line-through opacity-50",
              day_selected: "!bg-primary !text-primary-foreground hover:!bg-primary hover:!text-primary-foreground focus:!bg-primary focus:!text-primary-foreground",
              day_today: "font-bold border border-accent",
              day_range_middle: "!bg-primary/15 !text-foreground rounded-none",
              day_hidden: "invisible",
              nav_button: cn(
                "hover:bg-accent text-foreground transition-colors rounded-full p-1",
                "absolute top-1"
              ),
              nav_button_previous: "left-1",
              nav_button_next: "right-1",
              cell: "text-center relative rounded-md p-0 focus-within:relative focus-within:z-20",
              day: "h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-full transition-colors focus:outline-none",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-base font-semibold capitalize mx-2",
              head_cell: "text-muted-foreground font-normal text-[0.8rem] w-10 h-6",
              table: "w-full border-collapse space-y-2",
              months: "flex space-x-6 mt-2",
            }}
            defaultMonth={new Date()}
            weekStartsOn={1}
            fixedWeeks
            className="w-full"
            footer={renderSelectionSummary()}
          />
        </div>

        <div className="flex flex-wrap gap-3 mt-5 px-1.5 text-xs">
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
            <span>Selected range</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyAvailabilityCalendar;

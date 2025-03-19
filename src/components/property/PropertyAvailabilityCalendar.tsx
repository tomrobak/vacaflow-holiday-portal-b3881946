
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Property } from "@/types/property";
import { DateRange } from "react-day-picker";
import { differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";

// Import our new components and utilities
import CalendarLegend from "./calendar/CalendarLegend";
import TripSummary from "./calendar/TripSummary";
import CalendarHeader from "./calendar/CalendarHeader";
import { isDateUnavailable } from "./calendar/calendarUtils";

interface PropertyAvailabilityCalendarProps {
  property: Property;
}

const PropertyAvailabilityCalendar = ({ property }: PropertyAvailabilityCalendarProps) => {
  const [date, setDate] = useState<DateRange | undefined>();
  const [numberOfMonths, setNumberOfMonths] = useState(2);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  // Calculate total nights if a date range is selected
  const calculateNights = () => {
    if (date?.from && date?.to) {
      return differenceInDays(date.to, date.from);
    }
    return 0;
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
  
  const handleMonthChange = (month: Date) => {
    setCurrentMonth(month);
  };

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-0">
        <CalendarHeader 
          dateRange={date} 
          onClearDates={handleClearDates} 
          calculateNights={calculateNights} 
        />

        <div className="airbnb-style-calendar">
          <Calendar
            mode="range"
            selected={date}
            onSelect={setDate}
            numberOfMonths={numberOfMonths}
            disabled={(date) => isDateUnavailable(date, property)}
            month={currentMonth}
            onMonthChange={handleMonthChange}
            classNames={{
              day_disabled: "text-red-300 line-through opacity-50",
              day_selected: "!bg-primary !text-primary-foreground hover:!bg-primary hover:!text-primary-foreground focus:!bg-primary focus:!text-primary-foreground",
              day_today: "font-bold border border-accent",
              day_range_middle: "!bg-primary/15 !text-foreground rounded-none",
              day_range_start: "day-range-start !rounded-l-full !rounded-r-none", 
              day_range_end: "day-range-end !rounded-r-full !rounded-l-none",
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
            footer={date ? <TripSummary dateRange={date} onClearDates={handleClearDates} /> : undefined}
          />
        </div>

        <CalendarLegend />
      </CardContent>
    </Card>
  );
};

export default PropertyAvailabilityCalendar;

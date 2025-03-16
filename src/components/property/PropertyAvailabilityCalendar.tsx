
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Property } from "@/types/property";
import { DateRange } from "react-day-picker";
import { addDays, differenceInDays, isPast } from "date-fns";

interface PropertyAvailabilityCalendarProps {
  property: Property;
}

const PropertyAvailabilityCalendar = ({ property }: PropertyAvailabilityCalendarProps) => {
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
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Availability</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="flex flex-col md:flex-row gap-4">
          <Calendar
            mode="range"
            numberOfMonths={2}
            disabled={isDateUnavailable}
            classNames={{
              day_disabled: "opacity-50 text-red-300 bg-red-50",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground"
            }}
            defaultMonth={new Date()}
            className="pointer-events-auto"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyAvailabilityCalendar;


import { addDays, isPast } from "date-fns";
import { Property } from "@/types/property";

// In a real app, you would fetch booked dates from an API
export const getBookedDates = () => [
  { from: addDays(new Date(), 2), to: addDays(new Date(), 5) },
  { from: addDays(new Date(), 14), to: addDays(new Date(), 18) },
];

// Function to check if a date is unavailable
export const isDateUnavailable = (date: Date, property: Property) => {
  const bookedDates = getBookedDates();
  
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

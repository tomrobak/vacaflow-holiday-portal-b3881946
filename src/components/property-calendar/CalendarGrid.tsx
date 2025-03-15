
import { useState } from "react";
import { format, isSameDay, isSameMonth, addMonths } from "date-fns";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BookingStatus } from "@/types/booking";

interface Booking {
  id: string;
  propertyId: number;
  startDate: Date;
  endDate: Date;
  guestName: string;
  guestEmail: string;
  status: BookingStatus;
  guestCount: number;
  totalPrice: number;
}

interface CalendarGridProps {
  filteredBookings: Booking[];
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
}

const CalendarGrid = ({ filteredBookings, selectedDate, setSelectedDate }: CalendarGridProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const prevMonth = () => {
    setCurrentDate(prev => addMonths(prev, -1));
  };

  const nextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const getBookingsForDate = (date: Date) => {
    return filteredBookings.filter(booking => {
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);
      return date >= bookingStart && date <= bookingEnd;
    });
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Adjust for Monday start
    
    const days: Date[] = [];
    
    // Add days from previous month
    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
      days.push(addDays(firstDayOfMonth, -i - 1));
    }
    
    // Add days from current month
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    // Add days from next month to complete the grid
    const remainingDays = 42 - days.length; // 6 weeks of 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push(addDays(lastDayOfMonth, i));
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-300 hover:bg-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200";
    }
  };

  function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentDate(new Date())}>
              <CalendarIcon className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-border">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="py-2 text-center text-sm font-medium bg-card">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px bg-border mt-px">
          {calendarDays.map((day, index) => {
            const dayBookings = getBookingsForDate(day);
            const isToday = isSameDay(day, new Date());
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, currentDate);
            
            return (
              <div
                key={index}
                className={cn(
                  "min-h-[120px] bg-card p-1 relative cursor-pointer",
                  !isCurrentMonth && "bg-muted/20",
                  isSelected && "bg-primary/10",
                  isToday && "bg-accent/5"
                )}
                onClick={() => setSelectedDate(day)}
              >
                <div className={cn(
                  "flex justify-end items-start",
                  isToday && "font-bold"
                )}>
                  <span
                    className={cn(
                      "text-sm inline-flex items-center justify-center rounded-full w-6 h-6",
                      isToday && "bg-primary text-primary-foreground",
                      !isCurrentMonth && "text-muted-foreground",
                      isSelected && !isToday && "bg-primary/20"
                    )}
                  >
                    {format(day, "d")}
                  </span>
                </div>
                <div className="mt-1 space-y-1 w-full overflow-hidden">
                  {dayBookings.slice(0, 2).map((booking) => (
                    <div
                      key={booking.id}
                      className={cn(
                        "text-xs px-1 py-0.5 rounded truncate border w-full",
                        getStatusColor(booking.status),
                        isSameDay(day, booking.startDate) && "border-l-4"
                      )}
                      title={`${booking.guestName}: ${format(booking.startDate, "PP")} - ${format(booking.endDate, "PP")}`}
                    >
                      {isSameDay(day, booking.startDate) ? (
                        <span className="font-medium truncate block">{booking.guestName}</span>
                      ) : (
                        <span className="truncate block">•••</span>
                      )}
                    </div>
                  ))}
                  {dayBookings.length > 2 && (
                    <div className="text-xs text-center text-muted-foreground">
                      +{dayBookings.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarGrid;

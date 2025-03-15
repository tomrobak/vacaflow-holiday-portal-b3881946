
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
    
    const days: Date[] = [];
    
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push(addDays(firstDayOfMonth, -i - 1));
    }
    
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    const remainingDays = 7 - (days.length % 7);
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        days.push(addDays(lastDayOfMonth, i));
      }
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
    <div>
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

      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <div className="grid grid-cols-7">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="py-2 text-center text-sm font-medium border-b">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const dayBookings = getBookingsForDate(day);
            const isToday = isSameDay(day, new Date());
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, currentDate);
            
            return (
              <div
                key={index}
                className={cn(
                  "h-24 p-1 border-r border-b relative",
                  !isCurrentMonth && "bg-muted/30",
                  isSelected && "bg-primary/10",
                  isToday && "bg-primary/5"
                )}
                onClick={() => setSelectedDate(day)}
              >
                <div className="flex justify-between items-start">
                  <span
                    className={cn(
                      "text-sm font-medium inline-flex items-center justify-center rounded-full w-6 h-6",
                      isToday && "bg-primary text-primary-foreground",
                      !isCurrentMonth && "text-muted-foreground"
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

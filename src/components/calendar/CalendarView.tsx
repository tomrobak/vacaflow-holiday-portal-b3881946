
import { useState, useMemo } from "react";
import { format, addMonths, isWithinInterval, isSameDay } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingEvent } from "@/types/calendar";
import { cn } from "@/lib/utils";

interface CalendarViewProps {
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  selectedDate: Date | undefined;
  handleDateClick: (date: Date) => void;
  filteredBookings: BookingEvent[];
  view: "month" | "dual";
  selectedDateEvents: BookingEvent[];
  goToNewBooking: (date?: Date) => void;
}

const CalendarView = ({
  currentDate,
  setCurrentDate,
  selectedDate,
  handleDateClick,
  filteredBookings,
  view,
  selectedDateEvents,
  goToNewBooking,
}: CalendarViewProps) => {
  const nextMonth = useMemo(() => {
    return addMonths(currentDate, 1);
  }, [currentDate]);

  const prevMonth = () => {
    setCurrentDate((prev) => addMonths(prev, -1));
  };

  const nextMonthNav = () => {
    setCurrentDate((prev) => addMonths(prev, 1));
  };

  const hasEvents = (date: Date) => {
    return filteredBookings.some((booking) =>
      isWithinInterval(date, {
        start: booking.startDate,
        end: booking.endDate,
      })
    );
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {view === "dual"
            ? `${format(currentDate, "MMMM yyyy")} - ${format(
                nextMonth,
                "MMMM yyyy"
              )}`
            : format(currentDate, "MMMM yyyy")}
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(new Date())}
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonthNav}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {view === "dual" ? (
        <div className="grid grid-cols-1 gap-6">
          {/* Combined calendar card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Calendar View</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current month calendar */}
                <div>
                  <h3 className="text-sm font-medium mb-2">{format(currentDate, "MMMM yyyy")}</h3>
                  <SingleMonthCalendar
                    selected={selectedDate}
                    onSelect={handleDateClick}
                    month={currentDate}
                    hasEvents={hasEvents}
                  />
                </div>

                {/* Next month calendar */}
                <div>
                  <h3 className="text-sm font-medium mb-2">{format(nextMonth, "MMMM yyyy")}</h3>
                  <SingleMonthCalendar
                    selected={selectedDate}
                    onSelect={handleDateClick}
                    month={nextMonth}
                    hasEvents={hasEvents}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected date events */}
          <DateEventsCard
            selectedDate={selectedDate}
            events={selectedDateEvents}
            goToNewBooking={goToNewBooking}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Monthly View</CardTitle>
            </CardHeader>
            <CardContent>
              <SingleMonthCalendar
                selected={selectedDate}
                onSelect={handleDateClick}
                month={currentDate}
                onMonthChange={setCurrentDate}
                hasEvents={hasEvents}
                fullWidth
              />
            </CardContent>
          </Card>

          <DateEventsCard
            selectedDate={selectedDate}
            events={selectedDateEvents}
            goToNewBooking={goToNewBooking}
          />
        </div>
      )}

      <div className="mt-4">
        <CalendarLegend />
      </div>
    </>
  );
};

// Helper components
interface SingleMonthCalendarProps {
  selected?: Date;
  onSelect: (date: Date) => void;
  month: Date;
  onMonthChange?: React.Dispatch<React.SetStateAction<Date>>;
  hasEvents: (date: Date) => boolean;
  fullWidth?: boolean;
}

const SingleMonthCalendar = ({
  selected,
  onSelect,
  month,
  onMonthChange,
  hasEvents,
  fullWidth = false,
}: SingleMonthCalendarProps) => {
  return (
    <CalendarComponent
      selected={selected}
      onSelect={(date) => date && onSelect(date)}
      month={month}
      onMonthChange={onMonthChange}
      className={cn("border rounded-md", fullWidth && "w-full")}
      classNames={{
        day_today: "bg-muted text-primary-foreground font-bold",
        day: cn(
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-muted hover:text-foreground focus:bg-primary focus:text-primary-foreground"
        ),
        months: fullWidth ? "w-full" : "",
        month: fullWidth ? "w-full" : "",
        table: fullWidth ? "w-full" : "",
      }}
      components={{
        Day: ({ date }) => {
          if (!date) return null;

          const hasBooking = hasEvents(date);
          const isSelected = selected ? isSameDay(date, selected) : false;

          return (
            <div
              onClick={() => date && onSelect(date)}
              className={cn(
                "h-9 w-9 flex items-center justify-center rounded-md relative cursor-pointer",
                hasBooking ? "font-semibold" : "",
                hasBooking ? "bg-blue-50" : "",
                isSelected && "bg-primary text-primary-foreground"
              )}
            >
              {date.getDate()}
              {hasBooking && !isSelected && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
              )}
            </div>
          );
        },
      }}
    />
  );
};

interface DateEventsCardProps {
  selectedDate: Date | undefined;
  events: BookingEvent[];
  goToNewBooking: (date?: Date) => void;
}

const DateEventsCard = ({ selectedDate, events, goToNewBooking }: DateEventsCardProps) => {
  const goToBookingDetails = (bookingId: string) => {
    window.location.href = `/bookings/${bookingId}`;
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-300 hover:bg-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300 hover:bg-red-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200";
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2" />
          {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "No date selected"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {events.length > 0 ? (
          <div className="space-y-3">
            {events.map((booking) => (
              <div
                key={booking.id}
                className={cn(
                  "p-3 rounded-md border cursor-pointer",
                  getStatusColor(booking.status)
                )}
                onClick={() => goToBookingDetails(booking.id)}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-medium">{booking.propertyName}</div>
                  <div className={cn(
                    "px-2 py-1 rounded-full text-xs font-semibold",
                    booking.status === "confirmed" ? "bg-green-100 text-green-800" :
                    booking.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                    booking.status === "cancelled" ? "bg-red-100 text-red-800" :
                    "bg-blue-100 text-blue-800"
                  )}>
                    {booking.status}
                  </div>
                </div>
                <div className="text-sm mb-1">{booking.customerName}</div>
                <div className="text-xs text-muted-foreground">
                  {format(booking.startDate, "MMM d")} - {format(booking.endDate, "MMM d, yyyy")}
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span>{booking.guestCount} guests</span>
                  <span>${booking.totalAmount}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center py-3 text-muted-foreground">
              No bookings for this date
            </div>
            <Button
              className="w-full"
              onClick={() => selectedDate && goToNewBooking(selectedDate)}
            >
              Add New Booking
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const CalendarLegend = () => {
  return (
    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-full bg-blue-50 border border-blue-200 mr-1"></div>
        <span>Has Booking</span>
      </div>
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-full bg-primary mr-1"></div>
        <span>Selected Date</span>
      </div>
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-full bg-muted mr-1"></div>
        <span>Today</span>
      </div>
    </div>
  );
};

export default CalendarView;

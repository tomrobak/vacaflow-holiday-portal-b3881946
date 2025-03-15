
import { useState } from "react";
import { useParams } from "react-router-dom";
import { addDays } from "date-fns";
import PropertyCalendarHeader from "@/components/property-calendar/PropertyCalendarHeader";
import CalendarGrid from "@/components/property-calendar/CalendarGrid";
import BookingsList from "@/components/property-calendar/BookingsList";
import BookingDialog from "@/components/property-calendar/BookingDialog";

const mockPropertyData = {
  id: 1,
  name: "Sunset Villa",
  location: "Malibu, CA",
};

type BookingStatus = "confirmed" | "pending" | "canceled";

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

const generateMockBookings = (): Booking[] => {
  const bookings: Booking[] = [];
  const startDate = new Date();
  
  for (let i = 0; i < 15; i++) {
    const randomStartDayOffset = Math.floor(Math.random() * 180);
    const randomDuration = Math.floor(Math.random() * 7) + 2;
    
    const bookingStart = addDays(startDate, randomStartDayOffset);
    const bookingEnd = addDays(bookingStart, randomDuration);
    
    const statuses: BookingStatus[] = ["confirmed", "pending", "canceled"];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    bookings.push({
      id: `booking-${i + 1}`,
      propertyId: 1,
      startDate: bookingStart,
      endDate: bookingEnd,
      guestName: ["John Smith", "Emma Johnson", "Michael Brown", "Sophia Davis", "William Miller"][Math.floor(Math.random() * 5)],
      guestEmail: "guest@example.com",
      status: randomStatus,
      guestCount: Math.floor(Math.random() * 4) + 1,
      totalPrice: (Math.floor(Math.random() * 20) + 10) * 100,
    });
  }
  
  return bookings;
};

const mockBookings = generateMockBookings();

const PropertyCalendar = () => {
  const { id } = useParams();
  const property = mockPropertyData;
  const bookings = mockBookings;

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showNewBookingDialog, setShowNewBookingDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");

  const filteredBookings = statusFilter === "all"
    ? bookings
    : bookings.filter(booking => booking.status === statusFilter);

  const getBookingsForDate = (date: Date) => {
    return filteredBookings.filter(booking => {
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);
      return date >= bookingStart && date <= bookingEnd;
    });
  };

  return (
    <div className="p-6">
      <PropertyCalendarHeader
        propertyName={property.name}
        propertyLocation={property.location}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        setShowNewBookingDialog={setShowNewBookingDialog}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CalendarGrid
            filteredBookings={filteredBookings}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
          
          <BookingsList
            filteredBookings={filteredBookings}
            selectedDate={selectedDate}
            getBookingsForDate={getBookingsForDate}
          />
        </div>

        <BookingDialog
          open={showNewBookingDialog}
          onOpenChange={setShowNewBookingDialog}
          propertyName={property.name}
        />
      </div>
    </div>
  );
};

export default PropertyCalendar;

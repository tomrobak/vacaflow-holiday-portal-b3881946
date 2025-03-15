import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, RefreshCw, Link as LinkIcon } from "lucide-react";
import PropertyCalendarHeader from "@/components/property-calendar/PropertyCalendarHeader";
import CalendarGrid from "@/components/property-calendar/CalendarGrid";
import BookingsList from "@/components/property-calendar/BookingsList";
import BookingDialog from "@/components/property-calendar/BookingDialog";
import { BookingStatus } from "@/types/booking";
import { Property } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { getGoogleCalendarEvents, authorizeGoogleCalendar } from "@/utils/google-calendar";

const mockPropertyData: Property = {
  id: "1",
  name: "Sunset Villa",
  location: "Malibu, CA",
  description: "A beautiful beachfront property",
  address: "123 Beach Dr, Malibu, CA",
  price: 350,
  bedrooms: 3,
  bathrooms: 2,
  maxGuests: 6,
  squareFeet: 2200,
  amenities: ["wifi", "pool", "kitchen"],
  availableFrom: new Date(),
  availableTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
  propertyType: "villa",
  status: "active",
  featured: true,
  images: [],
  googleCalendarSync: true,
  googleCalendarId: "example@gmail.com",
  createdAt: new Date(),
  updatedAt: new Date(),
};

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
    
    const statuses: BookingStatus[] = ["confirmed", "pending", "cancelled"];
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

const PropertyCalendar = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<Property>(mockPropertyData);
  const [bookings, setBookings] = useState<Booking[]>(generateMockBookings());
  const [isLoadingCalendar, setIsLoadingCalendar] = useState<boolean>(false);
  const [isSyncEnabled, setIsSyncEnabled] = useState<boolean>(property?.googleCalendarSync || false);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showNewBookingDialog, setShowNewBookingDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");

  useEffect(() => {
    console.log(`Fetching property details for ID: ${id}`);
    setProperty(mockPropertyData);
  }, [id]);

  useEffect(() => {
    if (isSyncEnabled && property?.googleCalendarId) {
      syncWithGoogleCalendar();
    }
  }, [isSyncEnabled, property?.googleCalendarId]);

  const syncWithGoogleCalendar = async () => {
    if (!property?.googleCalendarId) return;
    
    setIsLoadingCalendar(true);
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 6);
      
      await getGoogleCalendarEvents(
        property.googleCalendarId,
        startDate,
        endDate
      );
      
      toast.success("Calendar synced successfully");
    } catch (error) {
      console.error("Error syncing calendar:", error);
      toast.error("Failed to sync calendar");
    } finally {
      setIsLoadingCalendar(false);
    }
  };

  const connectGoogleCalendar = () => {
    authorizeGoogleCalendar();
    setIsSyncEnabled(true);
  };

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

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarIcon className="mr-2 h-5 w-5" />
            Google Calendar Sync
          </CardTitle>
          <CardDescription>
            Synchronize bookings with Google Calendar for easy management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isSyncEnabled ? (
              <div>
                <p className="text-sm mb-2">
                  <span className="font-medium">Status:</span>{" "}
                  <span className="text-green-600 font-medium">Connected</span>
                </p>
                <p className="text-sm mb-2">
                  <span className="font-medium">Calendar ID:</span>{" "}
                  {property.googleCalendarId}
                </p>
                <div className="flex items-center mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mr-2"
                    onClick={syncWithGoogleCalendar}
                    disabled={isLoadingCalendar}
                  >
                    <RefreshCw className={`mr-2 h-4 w-4 ${isLoadingCalendar ? 'animate-spin' : ''}`} />
                    {isLoadingCalendar ? 'Syncing...' : 'Sync Now'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                  >
                    <LinkIcon className="mr-2 h-4 w-4" />
                    View in Google Calendar
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm mb-4">
                  Connect to Google Calendar to automatically sync your bookings and avoid double bookings.
                </p>
                <Button onClick={connectGoogleCalendar}>
                  Connect Google Calendar
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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

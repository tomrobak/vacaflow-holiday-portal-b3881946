
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format, isWithinInterval, isSameDay } from "date-fns";
import { X, Building, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Property, Customer, BookingEvent } from "@/types/calendar";
import { BookingStatus } from "@/types/booking";
import CalendarView from "@/components/calendar/CalendarView";
import BookingList from "@/components/calendar/BookingList";
import PropertyStats from "@/components/calendar/PropertyStats";
import CustomerStats from "@/components/calendar/CustomerStats";

// Mock data
const mockProperties: Property[] = [
  { id: "prop1", name: "Sunset Villa", location: "Malibu, CA" },
  { id: "prop2", name: "Mountain Retreat", location: "Aspen, CO" },
  { id: "prop3", name: "Downtown Loft", location: "New York, NY" },
  { id: "prop4", name: "Beachfront Cottage", location: "Cape Cod, MA" },
  { id: "prop5", name: "Lakeside Cabin", location: "Lake Tahoe, CA" },
];

const mockCustomers: Customer[] = [
  { id: "cust1", name: "John Smith", email: "john@example.com" },
  { id: "cust2", name: "Emma Johnson", email: "emma@example.com" },
  { id: "cust3", name: "Michael Brown", email: "michael@example.com" },
  { id: "cust4", name: "Sophia Davis", email: "sophia@example.com" },
  { id: "cust5", name: "William Miller", email: "william@example.com" },
];

const generateMockBookings = (): BookingEvent[] => {
  const bookings: BookingEvent[] = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const randomProperty = mockProperties[Math.floor(Math.random() * mockProperties.length)];
    const randomCustomer = mockCustomers[Math.floor(Math.random() * mockCustomers.length)];
    
    const startOffset = Math.floor(Math.random() * 120) - 30;
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() + startOffset);
    
    const duration = Math.floor(Math.random() * 10) + 1;
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + duration);
    
    const statuses: BookingStatus[] = ["confirmed", "pending", "cancelled", "completed"];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    bookings.push({
      id: `booking-${i + 1}`,
      propertyId: randomProperty.id,
      propertyName: randomProperty.name,
      customerId: randomCustomer.id,
      customerName: randomCustomer.name,
      startDate,
      endDate,
      status: randomStatus,
      guestCount: Math.floor(Math.random() * 6) + 1,
      totalAmount: Math.floor(Math.random() * 900) + 100,
    });
  }
  
  return bookings;
};

const mockBookings = generateMockBookings();

const Calendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"month" | "list" | "dual">("dual");
  const [filterProperty, setFilterProperty] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const goToBookingDetails = (bookingId: string) => {
    navigate(`/bookings/${bookingId}`);
  };
  
  const goToPropertyDetails = (propertyId: string) => {
    navigate(`/properties/${propertyId}`);
  };
  
  const goToCustomerDetails = (customerId: string) => {
    navigate(`/customers/${customerId}`);
  };

  const goToNewBooking = (date?: Date) => {
    if (date) {
      navigate(`/bookings/new?date=${format(date, 'yyyy-MM-dd')}`);
    } else {
      navigate('/bookings/new');
    }
  };

  const filteredBookings = useMemo(() => {
    return mockBookings.filter(booking => {
      if (filterProperty !== "all" && booking.propertyId !== filterProperty) return false;
      
      if (filterStatus !== "all" && booking.status !== filterStatus) return false;
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !booking.propertyName.toLowerCase().includes(query) &&
          !booking.customerName.toLowerCase().includes(query)
        ) {
          return false;
        }
      }
      
      return true;
    });
  }, [filterProperty, filterStatus, searchQuery]);

  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    
    return filteredBookings.filter(booking => 
      isWithinInterval(selectedDate, {
        start: booking.startDate,
        end: booking.endDate,
      }) || isSameDay(selectedDate, booking.startDate) || isSameDay(selectedDate, booking.endDate)
    );
  }, [selectedDate, filteredBookings]);

  const monthEvents = useMemo(() => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    return filteredBookings.filter(booking => 
      (booking.startDate >= firstDay && booking.startDate <= lastDay) ||
      (booking.endDate >= firstDay && booking.endDate <= lastDay) ||
      (booking.startDate <= firstDay && booking.endDate >= lastDay)
    ).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }, [currentDate, filteredBookings]);

  const findBookingsForDate = (date: Date) => {
    return filteredBookings.filter(booking => 
      isWithinInterval(date, {
        start: booking.startDate,
        end: booking.endDate,
      }) || isSameDay(date, booking.startDate) || isSameDay(date, booking.endDate)
    );
  };

  const handleDateClick = (date: Date) => {
    const bookingsOnDate = findBookingsForDate(date);
    setSelectedDate(date);
    
    if (bookingsOnDate.length === 1) {
      // If there's only one booking, go directly to it
      goToBookingDetails(bookingsOnDate[0].id);
    } else if (bookingsOnDate.length === 0) {
      // If there are no bookings, go to new booking page
      goToNewBooking(date);
    }
    // If there are multiple bookings, just select the date to show them in the sidebar
  };

  const resetFilters = () => {
    setFilterProperty("all");
    setFilterStatus("all");
    setSearchQuery("");
  };

  return (
    <div className="p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Booking Calendar</h1>
          <p className="text-muted-foreground">
            View and manage all property bookings in one place
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline"
            onClick={() => goToNewBooking()}
          >
            Add Booking
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 mb-6 border">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Input
                placeholder="Search by property or customer name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {searchQuery && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Select value={filterProperty} onValueChange={setFilterProperty}>
              <SelectTrigger className="w-[180px]">
                <Building className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by property" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                {mockProperties.map(property => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <ListFilter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            {(filterProperty !== "all" || filterStatus !== "all" || searchQuery) && (
              <Button variant="outline" onClick={resetFilters} size="icon">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <Tabs value={view} onValueChange={(v) => setView(v as "month" | "list" | "dual")}>
          <TabsList className="mb-4">
            <TabsTrigger value="dual">Dual Calendar</TabsTrigger>
            <TabsTrigger value="month">Month View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dual" className="space-y-4">
            <CalendarView
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              selectedDate={selectedDate}
              handleDateClick={handleDateClick}
              filteredBookings={filteredBookings}
              view="dual"
              selectedDateEvents={selectedDateEvents}
              goToNewBooking={goToNewBooking}
            />
          </TabsContent>
          
          <TabsContent value="month" className="space-y-4">
            <CalendarView
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              selectedDate={selectedDate}
              handleDateClick={handleDateClick}
              filteredBookings={filteredBookings}
              view="month"
              selectedDateEvents={selectedDateEvents}
              goToNewBooking={goToNewBooking}
            />
          </TabsContent>
          
          <TabsContent value="list">
            <BookingList
              bookings={monthEvents}
              goToBookingDetails={goToBookingDetails}
              goToPropertyDetails={goToPropertyDetails}
              goToCustomerDetails={goToCustomerDetails}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PropertyStats
          properties={mockProperties}
          filteredBookings={filteredBookings}
          goToPropertyDetails={goToPropertyDetails}
        />
        
        <CustomerStats
          customers={mockCustomers}
          filteredBookings={filteredBookings}
          goToCustomerDetails={goToCustomerDetails}
        />
      </div>
    </div>
  );
};

export default Calendar;

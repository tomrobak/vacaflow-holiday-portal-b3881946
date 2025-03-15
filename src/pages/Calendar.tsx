import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format, addMonths, isWithinInterval, isSameDay, parseISO } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight, Filter, X, Building, Users, ListFilter } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { BookingStatus } from "@/types/booking";

const mockProperties = [
  { id: "prop1", name: "Sunset Villa", location: "Malibu, CA" },
  { id: "prop2", name: "Mountain Retreat", location: "Aspen, CO" },
  { id: "prop3", name: "Downtown Loft", location: "New York, NY" },
  { id: "prop4", name: "Beachfront Cottage", location: "Cape Cod, MA" },
  { id: "prop5", name: "Lakeside Cabin", location: "Lake Tahoe, CA" },
];

const mockCustomers = [
  { id: "cust1", name: "John Smith", email: "john@example.com" },
  { id: "cust2", name: "Emma Johnson", email: "emma@example.com" },
  { id: "cust3", name: "Michael Brown", email: "michael@example.com" },
  { id: "cust4", name: "Sophia Davis", email: "sophia@example.com" },
  { id: "cust5", name: "William Miller", email: "william@example.com" },
];

interface BookingEvent {
  id: string;
  propertyId: string;
  propertyName: string;
  customerId: string;
  customerName: string;
  startDate: Date;
  endDate: Date;
  status: BookingStatus;
  guestCount: number;
  totalAmount: number;
}

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

const getStatusColor = (status: BookingStatus) => {
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

const Calendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"month" | "list">("month");
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

  const hasEvents = (date: Date) => {
    return filteredBookings.some(booking => 
      isWithinInterval(date, {
        start: booking.startDate,
        end: booking.endDate,
      })
    );
  };

  const prevMonth = () => {
    setCurrentDate(prev => addMonths(prev, -1));
  };

  const nextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
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
            onClick={() => navigate("/bookings/new")}
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
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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

        <Tabs value={view} onValueChange={(v) => setView(v as "month" | "list")}>
          <TabsList className="mb-4">
            <TabsTrigger value="month">Month View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="month" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {format(currentDate, "MMMM yyyy")}
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
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
              <div className="md:col-span-5">
                <CalendarComponent
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  month={currentDate}
                  onMonthChange={setCurrentDate}
                  className="border rounded-md"
                  classNames={{
                    day_today: "bg-muted text-primary-foreground font-bold",
                    day: cn(
                      "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-muted hover:text-foreground focus:bg-primary focus:text-primary-foreground"
                    ),
                  }}
                  components={{
                    Day: ({ date }) => {
                      if (!date) return null;
                      
                      const hasBooking = hasEvents(date);
                      const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
                      
                      return (
                        <div
                          onClick={() => setSelectedDate(date)}
                          className={cn(
                            "h-9 w-9 flex items-center justify-center rounded-md relative",
                            hasBooking ? "font-semibold" : "",
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
              </div>
              
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "No date selected"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedDateEvents.length > 0 ? (
                    <div className="space-y-3">
                      {selectedDateEvents.map((booking) => (
                        <div 
                          key={booking.id}
                          className={cn(
                            "p-2 rounded-md border cursor-pointer",
                            getStatusColor(booking.status)
                          )}
                          onClick={() => goToBookingDetails(booking.id)}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <div className="font-medium">{booking.propertyName}</div>
                            <Badge variant={booking.status === "confirmed" ? "default" : 
                                         booking.status === "pending" ? "secondary" : 
                                         booking.status === "cancelled" ? "destructive" : "outline"}>
                              {booking.status}
                            </Badge>
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
                    <div className="text-center py-6 text-muted-foreground">
                      No bookings for this date
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="list">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Check In/Out</TableHead>
                    <TableHead>Guests</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthEvents.length > 0 ? (
                    monthEvents.map((booking) => (
                      <TableRow 
                        key={booking.id}
                        className="cursor-pointer"
                        onClick={() => goToBookingDetails(booking.id)}
                      >
                        <TableCell 
                          className="font-medium hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            goToPropertyDetails(booking.propertyId);
                          }}
                        >
                          {booking.propertyName}
                        </TableCell>
                        <TableCell
                          className="hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            goToCustomerDetails(booking.customerId);
                          }}
                        >
                          {booking.customerName}
                        </TableCell>
                        <TableCell>
                          <div>{format(booking.startDate, "MMM d")}</div>
                          <div>{format(booking.endDate, "MMM d")}</div>
                        </TableCell>
                        <TableCell>{booking.guestCount}</TableCell>
                        <TableCell>
                          <Badge variant={booking.status === "confirmed" ? "default" : 
                                        booking.status === "pending" ? "secondary" : 
                                        booking.status === "cancelled" ? "destructive" : "outline"}>
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">${booking.totalAmount}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No bookings found for the selected filters
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Properties with Most Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockProperties.slice(0, 5).map((property, index) => {
                const propertyBookings = filteredBookings.filter(b => b.propertyId === property.id);
                return (
                  <div key={property.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="font-medium text-muted-foreground">{index + 1}</span>
                      <div>
                        <div className="font-medium hover:underline cursor-pointer" 
                          onClick={() => goToPropertyDetails(property.id)}>
                          {property.name}
                        </div>
                        <div className="text-sm text-muted-foreground">{property.location}</div>
                      </div>
                    </div>
                    <Badge variant="outline">{propertyBookings.length} bookings</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockCustomers.slice(0, 5).map((customer, index) => {
                const customerBookings = filteredBookings.filter(b => b.customerId === customer.id);
                const totalSpent = customerBookings.reduce((sum, b) => sum + b.totalAmount, 0);
                
                return (
                  <div key={customer.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="font-medium text-muted-foreground">{index + 1}</span>
                      <div>
                        <div className="font-medium hover:underline cursor-pointer"
                          onClick={() => goToCustomerDetails(customer.id)}>
                          {customer.name}
                        </div>
                        <div className="text-sm text-muted-foreground">{customer.email}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${totalSpent}</div>
                      <div className="text-sm text-muted-foreground">{customerBookings.length} bookings</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Calendar;

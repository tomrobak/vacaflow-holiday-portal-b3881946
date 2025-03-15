import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { addDays, format, isSameDay, addMonths, isSameMonth, parseISO } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, User, Filter, X, Check } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

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

const getStatusColor = (status: BookingStatus) => {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-800 border-green-300 hover:bg-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200";
    case "canceled":
      return "bg-red-100 text-red-800 border-red-300 hover:bg-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200";
  }
};

const getStatusBadgeVariant = (status: BookingStatus): "default" | "destructive" | "outline" | "secondary" => {
  switch (status) {
    case "confirmed":
      return "default";
    case "pending":
      return "secondary";
    case "canceled":
      return "destructive";
    default:
      return "outline";
  }
};

const PropertyCalendar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = mockPropertyData;
  const bookings = mockBookings;

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showNewBookingDialog, setShowNewBookingDialog] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    startDate: new Date(),
    endDate: addDays(new Date(), 3),
    guestName: "",
    guestEmail: "",
    guestCount: 2,
    status: "confirmed" as BookingStatus,
  });
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

  const prevMonth = () => {
    setCurrentDate(prev => addMonths(prev, -1));
  };

  const nextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
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

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleNewBooking = () => {
    console.log("New booking:", bookingForm);
    
    toast.success("Booking created successfully", {
      description: `Booking for ${bookingForm.guestName} from ${format(bookingForm.startDate, 'PP')} to ${format(bookingForm.endDate, 'PP')}`,
    });
    
    setShowNewBookingDialog(false);
    setBookingForm({
      startDate: new Date(),
      endDate: addDays(new Date(), 3),
      guestName: "",
      guestEmail: "",
      guestCount: 2,
      status: "confirmed",
    });
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center mb-2">
            <Link
              to="/properties"
              className="text-sm text-muted-foreground flex items-center mr-2"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Properties
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">
              {property.name} Calendar
            </h1>
          </div>
          <p className="text-muted-foreground">
            Manage bookings and availability for {property.name}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select
            value={statusFilter}
            onValueChange={(value: string) => setStatusFilter(value as BookingStatus | "all")}
          >
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bookings</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="canceled">Canceled</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={showNewBookingDialog} onOpenChange={setShowNewBookingDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Booking
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Booking</DialogTitle>
                <DialogDescription>
                  Create a new booking for {property.name}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Check-in</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(bookingForm.startDate, "PP")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={bookingForm.startDate}
                          onSelect={(date) => date && setBookingForm(prev => ({ 
                            ...prev, 
                            startDate: date 
                          }))}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Check-out</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(bookingForm.endDate, "PP")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={bookingForm.endDate}
                          onSelect={(date) => date && setBookingForm(prev => ({
                            ...prev,
                            endDate: date
                          }))}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                          disabled={(date) => date < bookingForm.startDate}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guestName">Guest Name</Label>
                  <Input
                    id="guestName"
                    value={bookingForm.guestName}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, guestName: e.target.value }))}
                    placeholder="John Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guestEmail">Guest Email</Label>
                  <Input
                    id="guestEmail"
                    type="email"
                    value={bookingForm.guestEmail}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, guestEmail: e.target.value }))}
                    placeholder="john@example.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="guestCount">Number of Guests</Label>
                    <Input
                      id="guestCount"
                      type="number"
                      min={1}
                      value={bookingForm.guestCount}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, guestCount: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={bookingForm.status}
                      onValueChange={(value: string) => setBookingForm(prev => ({ ...prev, status: value as BookingStatus }))}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="canceled">Canceled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowNewBookingDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" onClick={handleNewBooking} disabled={!bookingForm.guestName || !bookingForm.guestEmail}>
                  Create Booking
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
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
            <div className="grid grid-cols-7 bg-muted">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div key={day} className="py-2 text-center text-sm font-medium">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 border-t">
              {calendarDays.map((day, index) => {
                const dayBookings = getBookingsForDate(day);
                const isToday = isSameDay(day, new Date());
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, currentDate);
                
                return (
                  <div
                    key={index}
                    className={cn(
                      "min-h-24 p-1 border-r border-b relative",
                      !isCurrentMonth && "bg-muted/30",
                      isSelected && "bg-primary/10",
                      isToday && "bg-primary/5"
                    )}
                    onClick={() => handleDateClick(day)}
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
                    <div className="mt-1 space-y-1">
                      {dayBookings.slice(0, 2).map((booking) => (
                        <div
                          key={booking.id}
                          className={cn(
                            "text-xs px-1 py-0.5 rounded truncate border",
                            getStatusColor(booking.status),
                            isSameDay(day, booking.startDate) && "border-l-4"
                          )}
                          title={`${booking.guestName}: ${format(booking.startDate, "PP")} - ${format(booking.endDate, "PP")}`}
                        >
                          {isSameDay(day, booking.startDate) ? (
                            <span className="font-medium">{booking.guestName}</span>
                          ) : (
                            <span>•••</span>
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

          {selectedDate && (
            <Card className="mt-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  Bookings for {format(selectedDate, "MMMM d, yyyy")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {getBookingsForDate(selectedDate).length > 0 ? (
                  <div className="space-y-4">
                    {getBookingsForDate(selectedDate).map((booking) => (
                      <div 
                        key={booking.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border"
                      >
                        <div className="mb-2 sm:mb-0">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div className="font-medium">{booking.guestName}</div>
                            <Badge variant={getStatusBadgeVariant(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {format(booking.startDate, "PP")} - {format(booking.endDate, "PP")}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                          <div className="text-sm text-muted-foreground">
                            ${booking.totalPrice}
                          </div>
                          <Button variant="outline" size="sm" onClick={() => navigate(`/bookings/${booking.id}`)}>
                            View Details
                          </Button>
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
          )}
        </div>

        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Upcoming Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings
                  .filter(booking => booking.startDate >= new Date() && booking.status !== "canceled")
                  .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
                  .slice(0, 5)
                  .map((booking) => (
                    <div key={booking.id} className="flex flex-col space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{booking.guestName}</div>
                          <div className="text-sm text-muted-foreground">
                            {format(booking.startDate, "PP")} - {format(booking.endDate, "PP")}
                          </div>
                        </div>
                        <Badge variant={getStatusBadgeVariant(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{booking.guestCount} guests</span>
                        <span>${booking.totalPrice}</span>
                      </div>
                      <Separator />
                    </div>
                  ))}

                {bookings.filter(booking => booking.startDate >= new Date() && booking.status !== "canceled").length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    No upcoming bookings
                  </div>
                )}

                <div className="pt-2">
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/bookings">View All Bookings</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyCalendar;

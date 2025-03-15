
import { useNavigate } from "react-router-dom";
import { format, startOfToday, endOfMonth, isWithinInterval } from "date-fns";
import {
  Calendar,
  CreditCard,
  DollarSign,
  Home,
  MessageSquare,
  Plus,
  User,
  Users,
  ArrowRight,
  BookOpen,
  Building,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BookingStatus } from "@/types/booking";
import { Link } from "react-router-dom";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

// Dummy data
const recentBookings = [
  {
    id: "booking1",
    propertyName: "Sunset Villa",
    customerName: "John Smith",
    startDate: new Date(2024, 5, 15),
    endDate: new Date(2024, 5, 20),
    status: "confirmed" as BookingStatus,
    amount: 1200,
  },
  {
    id: "booking2",
    propertyName: "Mountain Cabin",
    customerName: "Alice Johnson",
    startDate: new Date(2024, 5, 18),
    endDate: new Date(2024, 5, 25),
    status: "pending" as BookingStatus,
    amount: 950,
  },
  {
    id: "booking3",
    propertyName: "Ocean View Apartment",
    customerName: "Robert Davis",
    startDate: new Date(2024, 5, 22),
    endDate: new Date(2024, 5, 28),
    status: "confirmed" as BookingStatus,
    amount: 1450,
  },
  {
    id: "booking4",
    propertyName: "Urban Loft",
    customerName: "Emma Wilson",
    startDate: new Date(2024, 5, 25),
    endDate: new Date(2024, 6, 2),
    status: "pending" as BookingStatus,
    amount: 800,
  },
];

const recentPayments = [
  {
    id: "payment1",
    bookingId: "booking1",
    customerName: "John Smith",
    date: new Date(2024, 5, 12),
    amount: 1200,
    method: "Credit Card",
  },
  {
    id: "payment2",
    bookingId: "booking3",
    customerName: "Robert Davis",
    date: new Date(2024, 5, 20),
    amount: 1450,
    method: "PayPal",
  },
  {
    id: "payment3",
    bookingId: "booking4",
    customerName: "Emma Wilson",
    date: new Date(2024, 5, 23),
    amount: 400,
    method: "Bank Transfer",
  },
  {
    id: "payment4",
    bookingId: null,
    customerName: "Sarah Miller",
    date: new Date(2024, 5, 24),
    amount: 950,
    method: "Credit Card",
  },
];

const upcomingBookings = recentBookings.filter(
  (booking) => booking.startDate > new Date()
);

const stats = [
  {
    title: "Total Properties",
    value: "12",
    icon: Building,
    description: "Active vacation properties",
    change: "+2 from last month",
    color: "bg-blue-50 text-blue-700",
  },
  {
    title: "Active Bookings",
    value: "28",
    icon: BookOpen,
    description: "Current and upcoming",
    change: "+5 from last month",
    color: "bg-green-50 text-green-700",
  },
  {
    title: "Total Customers",
    value: "143",
    icon: Users,
    description: "Registered users",
    change: "+12 from last month",
    color: "bg-purple-50 text-purple-700",
  },
  {
    title: "Revenue",
    value: "$24,589",
    icon: DollarSign,
    description: "This month",
    change: "+22% from last month",
    color: "bg-amber-50 text-amber-700",
  },
];

const popularProperties = [
  {
    id: "prop1",
    name: "Sunset Villa",
    location: "Malibu, CA",
    bookings: 8,
    occupancy: "82%",
    revenue: "$9,600",
  },
  {
    id: "prop2",
    name: "Mountain Cabin",
    location: "Aspen, CO",
    bookings: 6,
    occupancy: "75%",
    revenue: "$7,200",
  },
  {
    id: "prop3",
    name: "Ocean View Apartment",
    location: "Miami, FL",
    bookings: 5,
    occupancy: "68%",
    revenue: "$7,250",
  },
];

const recentMessages = [
  {
    id: "msg1",
    customerName: "John Smith",
    subject: "Question about check-in",
    preview: "I wanted to ask about early check-in options for my upcoming stay...",
    timestamp: new Date(2024, 5, 25, 14, 30),
    unread: true,
  },
  {
    id: "msg2",
    customerName: "Alice Johnson",
    subject: "Special accommodations",
    preview: "Could you please let me know if the property is wheelchair accessible?",
    timestamp: new Date(2024, 5, 25, 11, 15),
    unread: true,
  },
  {
    id: "msg3",
    customerName: "Robert Davis",
    subject: "Payment confirmation",
    preview: "I just wanted to confirm that my payment went through successfully.",
    timestamp: new Date(2024, 5, 24, 18, 45),
    unread: false,
  },
];

// Calendar events
const calendarEvents = [
  {
    id: "event1",
    title: "Sunset Villa Check-in",
    start: new Date(2024, 5, 15),
    end: new Date(2024, 5, 15),
    propertyId: "prop1",
    type: "check-in",
  },
  {
    id: "event2",
    title: "Sunset Villa Check-out",
    start: new Date(2024, 5, 20),
    end: new Date(2024, 5, 20),
    propertyId: "prop1",
    type: "check-out",
  },
  {
    id: "event3",
    title: "Mountain Cabin Check-in",
    start: new Date(2024, 5, 18),
    end: new Date(2024, 5, 18),
    propertyId: "prop2",
    type: "check-in",
  },
  {
    id: "event4",
    title: "Ocean View Check-in",
    start: new Date(2024, 5, 22),
    end: new Date(2024, 5, 22),
    propertyId: "prop3",
    type: "check-in",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfToday(),
    to: endOfMonth(startOfToday()),
  });

  const getStatusBadgeVariant = (status: BookingStatus) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // Filter calendar events based on the selected date range
  const filteredEvents = dateRange.from && dateRange.to
    ? calendarEvents.filter(event => 
        isWithinInterval(event.start, {
          start: dateRange.from as Date,
          end: dateRange.to as Date
        })
      )
    : calendarEvents;

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's an overview of your vacation rental business
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/properties/new">
              <Plus className="mr-2 h-4 w-4" /> Add Property
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/bookings/new">
              <Plus className="mr-2 h-4 w-4" /> New Booking
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/calendar">
              <Calendar className="mr-2 h-4 w-4" /> Calendar
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className={cn("pb-2", stat.color)}>
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              <p className="text-xs text-green-600 font-medium mt-2">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Bookings Calendar</CardTitle>
              <DateRangePicker 
                date={dateRange}
                onDateChange={setDateRange}
                className="w-[300px]"
              />
            </div>
            <CardDescription>
              Check-ins, check-outs and bookings for the selected period
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-4 space-y-4">
              <div className="text-sm font-medium text-center mb-2">
                {dateRange.from && dateRange.to 
                  ? `${format(dateRange.from, "MMMM d, yyyy")} - ${format(dateRange.to, "MMMM d, yyyy")}`
                  : "Select a date range"}
              </div>
              
              {filteredEvents.length > 0 ? (
                <div className="space-y-2">
                  {filteredEvents.map(event => (
                    <div key={event.id} className="flex items-center justify-between p-3 rounded-md border">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-2 h-full min-h-[2rem] rounded-full",
                          event.type === "check-in" ? "bg-green-500" : "bg-red-500"
                        )} />
                        <div>
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {format(event.start, "MMM d, yyyy")}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {event.type === "check-in" ? "Check-in" : "Check-out"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No calendar events for the selected period
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t p-4 flex justify-center">
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link to="/calendar">
                View Full Calendar <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button className="flex-col h-24 w-full" asChild>
                <Link to="/bookings/new">
                  <Plus className="h-6 w-6 mb-1" />
                  <span>New Booking</span>
                </Link>
              </Button>
              <Button className="flex-col h-24 w-full" variant="secondary" asChild>
                <Link to="/customers/new">
                  <User className="h-6 w-6 mb-1" />
                  <span>Add Customer</span>
                </Link>
              </Button>
              <Button className="flex-col h-24 w-full" variant="outline" asChild>
                <Link to="/payments/new">
                  <CreditCard className="h-6 w-6 mb-1" />
                  <span>Record Payment</span>
                </Link>
              </Button>
              <Button className="flex-col h-24 w-full" variant="outline" asChild>
                <Link to="/properties/new">
                  <Home className="h-6 w-6 mb-1" />
                  <span>Add Property</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Bookings</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/bookings">
                  See all <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Property</th>
                    <th className="text-left py-3 px-4 font-medium">Customer</th>
                    <th className="text-left py-3 px-4 font-medium">Dates</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-right py-3 px-4 font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr 
                      key={booking.id} 
                      className="border-b hover:bg-muted/50 cursor-pointer"
                      onClick={() => navigate(`/bookings/${booking.id}`)}
                    >
                      <td className="py-3 px-4">{booking.propertyName}</td>
                      <td className="py-3 px-4">{booking.customerName}</td>
                      <td className="py-3 px-4">
                        <div>{format(booking.startDate, "MMM d")}</div>
                        <div className="text-xs text-muted-foreground">
                          to {format(booking.endDate, "MMM d, yyyy")}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={cn("border", getStatusBadgeVariant(booking.status))}>
                          {booking.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right font-medium">${booking.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Popular Properties */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Popular Properties</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/properties">
                  See all <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {popularProperties.map((property) => (
              <div 
                key={property.id} 
                className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0 cursor-pointer"
                onClick={() => navigate(`/properties/${property.id}`)}
              >
                <div>
                  <div className="font-medium">{property.name}</div>
                  <div className="text-sm text-muted-foreground">{property.location}</div>
                  <div className="text-sm mt-1">
                    <span className="text-green-600 font-medium">{property.occupancy}</span> occupancy
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{property.revenue}</div>
                  <div className="text-sm text-muted-foreground">{property.bookings} bookings</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Payments</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/payments">
                  See all <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentPayments.map((payment) => (
              <div 
                key={payment.id} 
                className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0 cursor-pointer"
                onClick={() => navigate(`/payments/${payment.id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{payment.customerName}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(payment.date, "MMM d, yyyy")}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${payment.amount}</div>
                  <div className="text-sm text-muted-foreground">{payment.method}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Messages</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/messages">
                  See all <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <CardDescription>Latest customer inquiries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentMessages.map((message) => (
              <div 
                key={message.id} 
                className="flex flex-col border-b last:border-0 pb-4 last:pb-0 cursor-pointer"
                onClick={() => navigate(`/messages/${message.id}`)}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-medium flex items-center">
                    {message.customerName}
                    {message.unread && (
                      <Badge className="ml-2 bg-primary" variant="default">New</Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format(message.timestamp, "h:mm a")}
                  </div>
                </div>
                <div className="font-medium text-sm">{message.subject}</div>
                <div className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {message.preview}
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="border-t p-4 flex justify-center">
            <Button variant="outline" asChild className="w-full">
              <Link to="/messages">
                View All Messages <MessageSquare className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

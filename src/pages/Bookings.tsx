
import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { 
  CalendarCheck, 
  Calendar, 
  Plus, 
  Search, 
  Check, 
  Clock, 
  X, 
  Filter, 
  CheckCircle,
  XCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Booking, BookingStatus } from "@/types/booking";

// Sample mock data
const mockBookings: Booking[] = [
  {
    id: "BK-1001",
    propertyId: "PROP-101",
    propertyName: "Beachfront Villa",
    customerId: "CUST-1001",
    customerName: "John Smith",
    startDate: new Date(2023, 5, 15),
    endDate: new Date(2023, 5, 22),
    totalAmount: 1450.00,
    amountPaid: 1450.00,
    status: "completed",
    guestCount: 4,
    notes: "Requested early check-in",
    createdAt: new Date(2023, 4, 10),
    updatedAt: new Date(2023, 4, 10),
  },
  {
    id: "BK-1002",
    propertyId: "PROP-102",
    propertyName: "Mountain Cabin",
    customerId: "CUST-1002",
    customerName: "Jane Cooper",
    startDate: new Date(2023, 6, 3),
    endDate: new Date(2023, 6, 10),
    totalAmount: 980.00,
    amountPaid: 490.00,
    status: "confirmed",
    guestCount: 2,
    notes: "",
    createdAt: new Date(2023, 5, 15),
    updatedAt: new Date(2023, 5, 15),
  },
  {
    id: "BK-1003",
    propertyId: "PROP-103",
    propertyName: "Downtown Apartment",
    customerId: "CUST-1003",
    customerName: "Robert Johnson",
    startDate: new Date(2023, 7, 1),
    endDate: new Date(2023, 7, 7),
    totalAmount: 750.00,
    amountPaid: 375.00,
    status: "pending",
    guestCount: 3,
    notes: "First-time guest",
    createdAt: new Date(2023, 6, 12),
    updatedAt: new Date(2023, 6, 12),
  },
  {
    id: "BK-1004",
    propertyId: "PROP-104",
    propertyName: "Lakeside Cottage",
    customerId: "CUST-1004",
    customerName: "Emily Davis",
    startDate: new Date(2023, 8, 10),
    endDate: new Date(2023, 8, 15),
    totalAmount: 870.00,
    amountPaid: 0,
    status: "cancelled",
    guestCount: 5,
    notes: "Cancelled due to weather",
    createdAt: new Date(2023, 7, 5),
    updatedAt: new Date(2023, 7, 20),
  },
  {
    id: "BK-1005",
    propertyId: "PROP-105",
    propertyName: "Countryside Farmhouse",
    customerId: "CUST-1005",
    customerName: "Michael Wilson",
    startDate: new Date(2023, 9, 5),
    endDate: new Date(2023, 9, 12),
    totalAmount: 1100.00,
    amountPaid: 550.00,
    status: "confirmed",
    guestCount: 6,
    notes: "Celebrating anniversary",
    createdAt: new Date(2023, 8, 1),
    updatedAt: new Date(2023, 8, 1),
  },
];

const BookingStatusBadge = ({ status }: { status: BookingStatus }) => {
  switch (status) {
    case "confirmed":
      return (
        <Badge className="bg-blue-500 hover:bg-blue-600">
          <Check className="mr-1 h-3 w-3" />
          Confirmed
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="outline" className="text-orange-500 border-orange-500">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="destructive">
          <X className="mr-1 h-3 w-3" />
          Cancelled
        </Badge>
      );
    case "completed":
      return (
        <Badge className="bg-green-500 hover:bg-green-600">
          <CheckCircle className="mr-1 h-3 w-3" />
          Completed
        </Badge>
      );
    default:
      return null;
  }
};

const Bookings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredBookings = mockBookings.filter((booking) => {
    // Apply search filter
    const searchMatch =
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase());

    // Apply status filter
    const statusMatch =
      statusFilter === "all" || booking.status === statusFilter;

    return searchMatch && statusMatch;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Bookings</h1>
          <p className="text-muted-foreground">
            Manage your property bookings
          </p>
        </div>
        <Link to="/bookings/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Booking
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Bookings</CardTitle>
            <CardDescription>All booking records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockBookings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upcoming</CardTitle>
            <CardDescription>Confirmed future bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockBookings.filter(b => b.status === "confirmed").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">This Month</CardTitle>
            <CardDescription>Bookings in the current month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {mockBookings.filter(b => 
                new Date(b.startDate).getMonth() === new Date().getMonth() && 
                new Date(b.startDate).getFullYear() === new Date().getFullYear()
              ).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative w-full sm:w-auto flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search bookings..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
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
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.id}</TableCell>
                    <TableCell>{booking.propertyName}</TableCell>
                    <TableCell>{booking.customerName}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>
                          {format(new Date(booking.startDate), "MMM d")} - {format(new Date(booking.endDate), "MMM d, yyyy")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      ${booking.totalAmount.toFixed(2)}
                      {booking.amountPaid < booking.totalAmount && (
                        <div className="text-xs text-muted-foreground">
                          Paid: ${booking.amountPaid.toFixed(2)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <BookingStatusBadge status={booking.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/bookings/${booking.id}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                        <Link to={`/bookings/${booking.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No bookings found. Try adjusting your search or filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Bookings;

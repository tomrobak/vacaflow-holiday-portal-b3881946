
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookingEvent } from "@/types/calendar";

interface BookingListProps {
  bookings: BookingEvent[];
  goToBookingDetails: (bookingId: string) => void;
  goToPropertyDetails: (propertyId: string) => void;
  goToCustomerDetails: (customerId: string) => void;
}

const BookingList = ({
  bookings,
  goToBookingDetails,
  goToPropertyDetails,
  goToCustomerDetails,
}: BookingListProps) => {
  const getStatusBadgeVariant = (status: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (status) {
      case "confirmed":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      case "completed":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
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
          {bookings.length > 0 ? (
            bookings.map((booking) => (
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
                  <Badge variant={getStatusBadgeVariant(booking.status)}>
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
  );
};

export default BookingList;


import { useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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

interface BookingsListProps {
  filteredBookings: Booking[];
  selectedDate: Date | null;
  getBookingsForDate: (date: Date) => Booking[];
}

const BookingsList = ({ filteredBookings, selectedDate, getBookingsForDate }: BookingsListProps) => {
  const navigate = useNavigate();

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

  return (
    <div className="lg:col-span-1">
      {selectedDate && (
        <Card className="mt-6 lg:mt-0">
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

      <Card className="sticky top-6 mt-6">
        <CardHeader>
          <CardTitle>Upcoming Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredBookings
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

            {filteredBookings.filter(booking => booking.startDate >= new Date() && booking.status !== "canceled").length === 0 && (
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
  );
};

export default BookingsList;

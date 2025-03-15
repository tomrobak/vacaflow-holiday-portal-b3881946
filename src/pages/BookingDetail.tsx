
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  User,
  Home,
  DollarSign,
  Clock,
  MessageSquare,
  Users,
  Phone,
  Mail,
  Edit,
  XCircle,
  CheckCircle,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Booking, BookingStatus } from "@/types/booking";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// Mock data for a single booking
const mockBooking: Booking = {
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
  notes: "Guest requested extra pillows and late check-out on departure day. Prefers a room away from the elevator. First time staying at this property.",
  createdAt: new Date(2023, 5, 15),
  updatedAt: new Date(2023, 5, 15),
};

const calculateNights = (startDate: Date, endDate: Date) => {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const BookingStatusBadge = ({ status }: { status: BookingStatus }) => {
  switch (status) {
    case "confirmed":
      return (
        <Badge className="bg-blue-500 hover:bg-blue-600">
          <CheckCircle className="mr-1 h-3 w-3" />
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
          <XCircle className="mr-1 h-3 w-3" />
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

const BookingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking>(mockBooking);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  
  // In a real app, you would fetch the booking based on the ID
  // For demo purposes, we're using the mock data
  
  const nights = calculateNights(booking.startDate, booking.endDate);
  
  const handleStatusChange = async (newStatus: BookingStatus) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setBooking({
        ...booking,
        status: newStatus,
      });
      
      // Close dialog if cancelling
      if (newStatus === "cancelled") {
        setShowCancelDialog(false);
      }
      
      toast.success(`Booking ${newStatus} successfully`);
    } catch (error) {
      toast.error("Failed to update booking status");
    }
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/bookings")}
          className="pl-0"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Bookings
        </Button>
        
        <div className="flex items-center gap-2">
          <Link to={`/bookings/${id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit Booking
            </Button>
          </Link>
          
          {booking.status !== "cancelled" && (
            <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel Booking
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cancel Booking</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to cancel this booking? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                    Keep Booking
                  </Button>
                  <Button variant="destructive" onClick={() => handleStatusChange("cancelled")}>
                    Cancel Booking
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Booking Details</CardTitle>
                  <CardDescription>ID: {booking.id}</CardDescription>
                </div>
                <BookingStatusBadge status={booking.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Property</h3>
                    <div className="flex items-center">
                      <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Link 
                        to={`/properties/${booking.propertyId}`}
                        className="text-primary hover:underline"
                      >
                        {booking.propertyName}
                      </Link>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Guest</h3>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Link 
                        to={`/customers/${booking.customerId}`}
                        className="text-primary hover:underline"
                      >
                        {booking.customerName}
                      </Link>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Guest Count</h3>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{booking.guestCount} {booking.guestCount === 1 ? 'person' : 'people'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Check-in</h3>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{format(booking.startDate, "EEEE, MMMM d, yyyy")}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Check-out</h3>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{format(booking.endDate, "EEEE, MMMM d, yyyy")}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Duration</h3>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{nights} {nights === 1 ? 'night' : 'nights'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
                <div className="p-3 bg-muted rounded-md">
                  <div className="flex items-start">
                    <MessageSquare className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <p className="text-sm">{booking.notes || "No notes provided for this booking."}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="font-medium">${booking.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Amount Paid</span>
                <span className="font-medium">${booking.amountPaid.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Balance Due</span>
                <span className="font-bold">${(booking.totalAmount - booking.amountPaid).toFixed(2)}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Payment Status</span>
                {booking.amountPaid === 0 ? (
                  <Badge variant="outline" className="text-destructive border-destructive">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    Unpaid
                  </Badge>
                ) : booking.amountPaid < booking.totalAmount ? (
                  <Badge variant="outline" className="text-orange-500 border-orange-500">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    Partially Paid
                  </Badge>
                ) : (
                  <Badge className="bg-green-500 hover:bg-green-600">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Fully Paid
                  </Badge>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled={booking.amountPaid >= booking.totalAmount}>
                <DollarSign className="mr-2 h-4 w-4" />
                {booking.amountPaid === 0 ? "Record Payment" : "Record Additional Payment"}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Guest Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Contact</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>guest@example.com</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Booking History</h3>
                <div className="text-sm">
                  <p>Previous bookings: 3</p>
                  <p>Last stay: 3 months ago</p>
                  <div className="mt-2">
                    <Link 
                      to={`/customers/${booking.customerId}`}
                      className="text-primary text-sm hover:underline"
                    >
                      View customer details →
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Booking Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex">
                  <div className="mr-4 flex flex-col items-center">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                      <CheckCircle className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <div className="h-full w-px bg-border"></div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Booking Created</h4>
                    <p className="text-xs text-muted-foreground">
                      {format(booking.createdAt, "PPpp")}
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 flex flex-col items-center">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                      <DollarSign className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <div className="h-full w-px bg-border"></div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Partial Payment Received</h4>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(booking.createdAt.getTime() + 1000 * 60 * 60), "PPpp")}
                    </p>
                    <p className="text-xs">${booking.amountPaid.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 flex flex-col items-center">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted border border-border">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Check-in (Upcoming)</h4>
                    <p className="text-xs text-muted-foreground">
                      {format(booking.startDate, "PPP")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;

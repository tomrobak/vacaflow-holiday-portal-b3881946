
import { useLocation, Link } from "react-router-dom";
import { CheckCircle, Calendar, MapPin, Info, ArrowRight, Download, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { toast } from "sonner";

const BookingConfirmation = () => {
  const location = useLocation();
  
  // In a real app, this would come from location state
  const bookingData = location.state || {
    bookingId: "booking-12345",
    propertyId: "property-123",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    guests: 2,
    total: 1734,
    paymentId: "pi_1abc123"
  };
  
  const handleShareBooking = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Booking link copied to clipboard");
  };
  
  const handleDownloadConfirmation = () => {
    toast.success("Booking confirmation downloaded");
  };
  
  return (
    <div className="container py-8 max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold">Booking Confirmed!</h1>
        <p className="text-muted-foreground">
          Your booking (#
          <span className="font-medium text-foreground">{bookingData.bookingId}</span>
          ) has been confirmed and your payment has been processed.
        </p>
        
        <div className="flex justify-center gap-3 mt-4">
          <Button variant="outline" size="sm" onClick={handleShareBooking}>
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadConfirmation}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-4 h-16 w-16 bg-primary/5 rounded overflow-hidden">
              <img 
                src="/placeholder.svg" 
                alt="Property" 
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium">Luxury Beachfront Villa</h3>
              <p className="text-sm text-muted-foreground">Malibu, California</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Check-in</div>
              <div className="font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                {format(new Date(bookingData.startDate), "EEE, MMM d, yyyy")}
              </div>
              <div className="text-sm text-muted-foreground">From 3:00 PM</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Check-out</div>
              <div className="font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                {format(new Date(bookingData.endDate), "EEE, MMM d, yyyy")}
              </div>
              <div className="text-sm text-muted-foreground">Until 11:00 AM</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Confirmation</div>
              <div className="font-medium">{bookingData.bookingId}</div>
              <div className="text-sm text-green-600">Confirmed</div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <h3 className="font-medium">Payment Information</h3>
            <div className="flex justify-between items-center">
              <span>Total amount paid</span>
              <span className="font-bold">${bookingData.total}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Payment ID: {bookingData.paymentId}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="h-4 w-4 mr-2" />
            What's Next
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-3">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">Check your email</p>
                <p className="text-sm text-muted-foreground">We've sent a confirmation email with all booking details.</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">Review check-in information</p>
                <p className="text-sm text-muted-foreground">Information about key pickup and access codes will be sent 24 hours before check-in.</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">Contact your host</p>
                <p className="text-sm text-muted-foreground">If you have any questions, you can contact your host through our messaging system.</p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
      
      <div className="flex justify-center gap-4">
        <Button asChild variant="outline">
          <Link to="/">Return to Home</Link>
        </Button>
        <Button asChild>
          <Link to={`/property/${bookingData.propertyId}`}>
            View Property
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default BookingConfirmation;

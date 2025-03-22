
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar,
  Clock, 
  Home, 
  Users, 
  CreditCard, 
  FileText, 
  Download,
  MessageSquare,
  CheckCircle2,
  AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface BookingAddon {
  name: string;
  price: number;
  quantity: number;
}

interface BookingDetail {
  id: string;
  propertyName: string;
  propertyImage: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  totalAmount: number;
  amountPaid: number;
  paymentStatus: 'paid' | 'partially_paid' | 'unpaid';
  invoiceId: string;
  addons: BookingAddon[];
  notes: string;
  cancellationPolicy: string;
  bookingDate: string;
  lastUpdated: string;
  propertyAddress: string;
  propertyManager: string;
  checkInInstructions: string;
}

const CustomerBookingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setBooking({
        id: id || "BK-1001",
        propertyName: "Beachside Villa",
        propertyImage: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=2832&auto=format&fit=crop",
        checkIn: "2023-08-12",
        checkOut: "2023-08-19",
        guests: 4,
        status: "confirmed",
        totalAmount: 1250.00,
        amountPaid: 625.00,
        paymentStatus: "partially_paid",
        invoiceId: "INV-2001",
        addons: [
          { name: "Airport Transfer", price: 75.00, quantity: 1 },
          { name: "Welcome Package", price: 50.00, quantity: 1 }
        ],
        notes: "Please provide a high chair for our infant.",
        cancellationPolicy: "Full refund up to 7 days before check-in. 50% refund between 7 days and 24 hours before check-in. No refund within 24 hours of check-in.",
        bookingDate: "2023-07-01",
        lastUpdated: "2023-07-05",
        propertyAddress: "123 Beach Road, Miami, FL 33101",
        propertyManager: "John Manager",
        checkInInstructions: "Check-in is at 3:00 PM. The key will be in a lockbox by the front door. The code is 1234. Please call the property manager if you have any issues."
      });
      setLoading(false);
    }, 500);
  }, [id]);

  const handleDownloadInvoice = () => {
    toast.success("Invoice download started");
    // In a real app, this would trigger an actual download
  };

  const handleDownloadReceipt = () => {
    toast.success("Receipt download started");
    // In a real app, this would trigger an actual download
  };

  const handleContactSupport = () => {
    toast.success("Message sent to support");
    // In a real app, this would open a message form or redirect to support
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-64 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-64 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Booking not found</h1>
        <p className="mt-2">The booking you're looking for doesn't exist or you don't have permission to view it.</p>
        <Button asChild className="mt-4">
          <Link to="/customer/bookings">Back to Bookings</Link>
        </Button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800">Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      default:
        return null;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case 'partially_paid':
        return <Badge className="bg-amber-100 text-amber-800">Partially Paid</Badge>;
      case 'unpaid':
        return <Badge className="bg-red-100 text-red-800">Unpaid</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with back button */}
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" asChild>
          <Link to="/customer/bookings">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Booking {booking.id}</h1>
        {getStatusBadge(booking.status)}
      </div>

      {/* Property banner */}
      <div className="relative h-48 rounded-lg overflow-hidden">
        <img 
          src={booking.propertyImage} 
          alt={booking.propertyName}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h2 className="text-xl font-bold text-white">{booking.propertyName}</h2>
          <p className="text-white/80">{booking.propertyAddress}</p>
        </div>
      </div>

      {/* Quick action buttons */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button variant="outline" onClick={handleDownloadInvoice} className="flex items-center justify-center">
          <FileText className="mr-2 h-4 w-4" />
          Download Invoice
        </Button>
        
        <Button variant="outline" onClick={handleDownloadReceipt} className="flex items-center justify-center">
          <Download className="mr-2 h-4 w-4" />
          Download Receipt
        </Button>
        
        <Button variant="outline" onClick={handleContactSupport} className="flex items-center justify-center">
          <MessageSquare className="mr-2 h-4 w-4" />
          Contact Support
        </Button>
        
        {booking.paymentStatus !== 'paid' && (
          <Button variant="default" asChild className="flex items-center justify-center">
            <Link to={`/customer/checkout/${booking.invoiceId}`}>
              <CreditCard className="mr-2 h-4 w-4" />
              Complete Payment
            </Link>
          </Button>
        )}
      </div>

      {/* Booking details */}
      <Tabs defaultValue="details">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Booking Details</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="instructions">Check-in Instructions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Stay Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Check-in</div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    <span>{new Date(booking.checkIn).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Check-out</div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    <span>{new Date(booking.checkOut).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Guests</div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-primary" />
                    <span>{booking.guests}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Property</div>
                  <div className="flex items-center">
                    <Home className="h-4 w-4 mr-2 text-primary" />
                    <span>{booking.propertyName}</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <div className="text-sm font-medium mb-2">Add-ons</div>
                {booking.addons.length > 0 ? (
                  <div className="space-y-2">
                    {booking.addons.map((addon, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{addon.name} x{addon.quantity}</span>
                        <span>${addon.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No add-ons selected</p>
                )}
              </div>
              
              <Separator />
              
              <div>
                <div className="text-sm font-medium mb-2">Special Requests</div>
                <p className="text-sm">{booking.notes || "No special requests"}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Cancellation Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{booking.cancellationPolicy}</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
              <CardDescription>Booking made on {new Date(booking.bookingDate).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-sm">Payment Status</div>
                <div>{getPaymentStatusBadge(booking.paymentStatus)}</div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="text-sm">Accommodation</div>
                  <div>${(booking.totalAmount - booking.addons.reduce((sum, addon) => sum + addon.price * addon.quantity, 0)).toFixed(2)}</div>
                </div>
                
                {booking.addons.map((addon, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="text-sm">{addon.name} x{addon.quantity}</div>
                    <div>${(addon.price * addon.quantity).toFixed(2)}</div>
                  </div>
                ))}
                
                <Separator />
                
                <div className="flex justify-between items-center font-bold">
                  <div>Total</div>
                  <div>${booking.totalAmount.toFixed(2)}</div>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <div>Amount Paid</div>
                  <div>${booking.amountPaid.toFixed(2)}</div>
                </div>
                
                {booking.amountPaid < booking.totalAmount && (
                  <div className="flex justify-between items-center text-sm font-bold text-amber-600">
                    <div>Balance Due</div>
                    <div>${(booking.totalAmount - booking.amountPaid).toFixed(2)}</div>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={handleDownloadInvoice} 
                  className="flex items-center"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Download Invoice
                </Button>
                
                {booking.amountPaid > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={handleDownloadReceipt} 
                    className="flex items-center"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Receipt
                  </Button>
                )}
                
                {booking.paymentStatus !== "paid" && (
                  <Button 
                    variant="default" 
                    asChild 
                    className="flex items-center"
                  >
                    <Link to={`/customer/checkout/${booking.invoiceId}`}>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Complete Payment
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="instructions" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Check-in Instructions</CardTitle>
              <CardDescription>Please read carefully before arrival</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Check-in time: 3:00 PM</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Check-out time: 11:00 AM</span>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">How to get in</h3>
                <p className="text-sm whitespace-pre-line">{booking.checkInInstructions}</p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Property Manager Contact</h3>
                <p className="text-sm">{booking.propertyManager}</p>
                <p className="text-sm">Phone: +1 (555) 123-4567</p>
                <p className="text-sm">Email: manager@example.com</p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="font-medium">Important Information</h3>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <p className="text-sm">Parking is available on-site.</p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <p className="text-sm">Wifi password will be available in the welcome book.</p>
                </div>
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                  <p className="text-sm">No smoking allowed in the property.</p>
                </div>
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                  <p className="text-sm">No parties or events.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerBookingDetail;

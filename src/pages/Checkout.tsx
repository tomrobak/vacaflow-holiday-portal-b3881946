
import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CreditCard, CalendarClock, Home, Info, User } from "lucide-react";
import LoginForm from "@/components/checkout/LoginForm";
import GuestInfoForm from "@/components/checkout/GuestInfoForm";
import PaymentForm from "@/components/checkout/PaymentForm";
import BookingSummary from "@/components/checkout/BookingSummary";
import { toast } from "sonner";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("guest");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  
  // In a real app, this would come from the location state
  const bookingData = location.state || {
    propertyId: "mock-property-id",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    guests: 2,
    price: {
      nightly: 299,
      nights: 5,
      subtotal: 1495,
      cleaningFee: 60,
      serviceFee: 179,
      total: 1734
    }
  };
  
  const handleGuestInfoComplete = () => {
    setActiveTab("payment");
  };
  
  const handleLoginComplete = () => {
    setIsLoggedIn(true);
    setActiveTab("payment");
    toast.success("Successfully logged in!");
  };
  
  const handlePaymentComplete = (paymentId: string) => {
    // In a real app, you would process the payment and create booking
    setBookingId("mock-booking-" + Math.floor(Math.random() * 1000));
    navigate("/confirmation", { 
      state: { 
        bookingId: bookingId || "mock-booking-" + Math.floor(Math.random() * 1000),
        propertyId: bookingData.propertyId,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        guests: bookingData.guests,
        total: bookingData.price.total,
        paymentId
      } 
    });
  };
  
  return (
    <div className="container py-8 max-w-7xl">
      <div className="mb-6">
        <Link to={`/property/${bookingData.propertyId}`} className="flex items-center text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to property
        </Link>
      </div>
      
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Complete your booking</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="guest" disabled={!!bookingId}>
                <User className="h-4 w-4 mr-2" />
                Guest Information
              </TabsTrigger>
              <TabsTrigger value="payment" disabled={!isLoggedIn && activeTab !== "payment"}>
                <CreditCard className="h-4 w-4 mr-2" />
                Payment
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="guest" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Guest Information</CardTitle>
                  <CardDescription>
                    {isLoggedIn 
                      ? "You're signed in. Update your information if needed."
                      : "Enter your details or sign in to your account."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoggedIn ? (
                    <GuestInfoForm onComplete={handleGuestInfoComplete} />
                  ) : (
                    <div className="space-y-6">
                      <GuestInfoForm onComplete={handleGuestInfoComplete} />
                      
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">
                            Or sign in to your account
                          </span>
                        </div>
                      </div>
                      
                      <LoginForm onComplete={handleLoginComplete} />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="payment" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                  <CardDescription>
                    Complete your payment securely with Stripe
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PaymentForm onComplete={handlePaymentComplete} totalAmount={bookingData.price.total} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="lg:col-span-1">
          <BookingSummary 
            propertyId={bookingData.propertyId}
            startDate={bookingData.startDate}
            endDate={bookingData.endDate}
            guests={bookingData.guests}
            price={bookingData.price}
          />
          
          <Card className="mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <Info className="h-4 w-4 mr-2" />
                Booking Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex">
                <CalendarClock className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Free cancellation for 48 hours</p>
                  <p className="text-muted-foreground">Cancel before check-in for a full refund.</p>
                </div>
              </div>
              <div className="flex">
                <Home className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">House rules</p>
                  <p className="text-muted-foreground">Check-in: 3:00 PM - 8:00 PM</p>
                  <p className="text-muted-foreground">Checkout: 11:00 AM</p>
                  <p className="text-muted-foreground">Maximum 6 guests</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

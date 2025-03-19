
import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CreditCard, CalendarClock, Home, Info, User, Package, Plus, X } from "lucide-react";
import LoginForm from "@/components/checkout/LoginForm";
import GuestInfoForm from "@/components/checkout/GuestInfoForm";
import PaymentForm from "@/components/checkout/PaymentForm";
import BookingSummary from "@/components/checkout/BookingSummary";
import { toast } from "sonner";
import { Addon } from "@/types/addon";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock addons data
const mockAddons: Addon[] = [
  {
    id: "1",
    name: "Late Checkout",
    description: "Extend your stay until 3 PM instead of the standard 11 AM checkout time.",
    price: 45,
    category: "checkout",
    featuredImage: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    gallery: [],
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2",
    name: "Early Check-in",
    description: "Check in as early as 10 AM instead of the standard 3 PM check-in time.",
    price: 45,
    category: "checkin",
    featuredImage: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    gallery: [],
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "3",
    name: "Train Station Pickup",
    description: "We'll pick you up from the train station and bring you directly to the property.",
    price: 30,
    category: "transportation",
    featuredImage: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    gallery: [],
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "4",
    name: "Professional Photo Session",
    description: "1-hour photo session with a professional photographer at the property or nearby landmarks.",
    price: 120,
    category: "entertainment",
    featuredImage: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
    gallery: [],
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("guest");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [isAddonsDialogOpen, setIsAddonsDialogOpen] = useState(false);
  
  // In a real app, this would come from the location state
  const bookingData = location.state || {
    propertyId: "mock-property-id",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    guests: 2,
    addons: ["1", "3"], // Selected addon IDs
    price: {
      nightly: 299,
      nights: 5,
      subtotal: 1495,
      addonsTotal: 75, // Late checkout + Train pickup
      cleaningFee: 60,
      serviceFee: 179,
      total: 1809
    }
  };
  
  // State to manage selected addons
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>(
    bookingData.addons || []
  );
  
  // Get addon details from selected IDs
  const selectedAddons = selectedAddonIds.map(addonId => 
    mockAddons.find(addon => addon.id === addonId)
  ).filter(Boolean) as Addon[];
  
  // Available addons (those not already selected)
  const availableAddons = mockAddons.filter(
    addon => !selectedAddonIds.includes(addon.id)
  );
  
  // Calculate updated price with current addons
  const calculateUpdatedPrice = () => {
    const addonsTotal = selectedAddons.reduce((total, addon) => total + addon.price, 0);
    const total = bookingData.price.subtotal + bookingData.price.cleaningFee + 
                  bookingData.price.serviceFee + addonsTotal;
    
    return {
      ...bookingData.price,
      addonsTotal,
      total
    };
  };
  
  const updatedPrice = calculateUpdatedPrice();
  
  const handleGuestInfoComplete = () => {
    setActiveTab("payment");
  };
  
  const handleLoginComplete = () => {
    setIsLoggedIn(true);
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
        addons: selectedAddonIds,
        total: updatedPrice.total,
        paymentId
      } 
    });
  };
  
  const addAddon = (addonId: string) => {
    setSelectedAddonIds([...selectedAddonIds, addonId]);
    toast.success("Add-on added to your booking");
  };
  
  const removeAddon = (addonId: string) => {
    setSelectedAddonIds(selectedAddonIds.filter(id => id !== addonId));
    toast.success("Add-on removed from your booking");
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
                {!isLoggedIn && (
                  <>
                    <CardHeader>
                      <CardTitle>Sign in to your account</CardTitle>
                      <CardDescription>
                        Sign in for a faster checkout experience
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <LoginForm onComplete={handleLoginComplete} />
                    </CardContent>
                    <Separator />
                  </>
                )}
                
                <CardHeader>
                  <CardTitle>Guest Information</CardTitle>
                  <CardDescription>
                    {isLoggedIn 
                      ? "You're signed in. Update your information if needed."
                      : "Or continue as a guest by entering your details below."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <GuestInfoForm onComplete={handleGuestInfoComplete} />
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
                  <PaymentForm onComplete={handlePaymentComplete} totalAmount={updatedPrice.total} />
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
            price={updatedPrice}
          />
          
          <Card className="mt-6">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <Package className="h-4 w-4 mr-2" />
                  Your Add-ons
                </CardTitle>
                <Dialog open={isAddonsDialogOpen} onOpenChange={setIsAddonsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add More
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add more add-ons</DialogTitle>
                    </DialogHeader>
                    {availableAddons.length === 0 ? (
                      <div className="py-6 text-center text-muted-foreground">
                        You've already added all available add-ons
                      </div>
                    ) : (
                      <ScrollArea className="max-h-[60vh]">
                        <div className="space-y-4 py-2">
                          {availableAddons.map((addon) => (
                            <div key={addon.id} className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50">
                              <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                                {addon.featuredImage ? (
                                  <img 
                                    src={addon.featuredImage} 
                                    alt={addon.name} 
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full bg-muted flex items-center justify-center">
                                    <Package className="h-5 w-5 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <h4 className="font-medium">{addon.name}</h4>
                                  <span className="font-semibold">${addon.price}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">{addon.description}</p>
                                <Button 
                                  variant="secondary" 
                                  size="sm" 
                                  className="mt-2"
                                  onClick={() => {
                                    addAddon(addon.id);
                                    setIsAddonsDialogOpen(false);
                                  }}
                                >
                                  Add to booking
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedAddons.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No add-ons selected</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setIsAddonsDialogOpen(true)}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add Add-ons
                  </Button>
                </div>
              ) : (
                selectedAddons.map((addon) => (
                  <div key={addon.id} className="flex justify-between items-start bg-muted/40 p-3 rounded-md">
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded-md overflow-hidden flex-shrink-0 mr-2">
                        {addon.featuredImage ? (
                          <img 
                            src={addon.featuredImage} 
                            alt={addon.name} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-muted flex items-center justify-center">
                            <Package className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{addon.name}</p>
                          <Badge variant="outline" className="h-5 text-xs">
                            {addon.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {addon.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <p className="font-semibold text-sm">${addon.price}</p>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 rounded-full"
                        onClick={() => removeAddon(addon.id)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
          
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

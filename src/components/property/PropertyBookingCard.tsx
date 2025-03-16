
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Property } from "@/types/property";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format, differenceInDays, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, Users, CheckCircle, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Addon } from "@/types/addon";

interface PropertyBookingCardProps {
  property: Property;
}

// Mock addons data - in a real app, this would come from an API call
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
    gallery: [
      "https://images.unsplash.com/photo-1472396961693-142e6e269027",
      "https://images.unsplash.com/photo-1466721591366-2d5fba72006d"
    ],
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const PropertyBookingCard = ({ property }: PropertyBookingCardProps) => {
  const navigate = useNavigate();
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), 1),
    to: addDays(new Date(), 5),
  });
  const [guests, setGuests] = useState("2");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [showAddons, setShowAddons] = useState(false);
  
  // Filter addons that are available for this property
  const availableAddons = mockAddons.filter(addon => 
    property.addons?.includes(addon.id)
  );
  
  // Calculate number of nights and total price
  const nights = date?.from && date?.to ? differenceInDays(date.to, date.from) : 0;
  const subtotal = property.price * nights;
  
  // Calculate addons price
  const addonsTotal = selectedAddons.reduce((total, addonId) => {
    const addon = mockAddons.find(a => a.id === addonId);
    return total + (addon?.price || 0);
  }, 0);
  
  const cleaningFee = 60;
  const serviceFee = Math.round(subtotal * 0.12);
  const total = subtotal + cleaningFee + serviceFee + addonsTotal;
  
  const handleReserve = () => {
    if (!date?.from || !date?.to) {
      return;
    }
    
    // In a real app, you would navigate to checkout with query params
    navigate("/checkout", { 
      state: { 
        propertyId: property.id,
        startDate: date.from,
        endDate: date.to,
        guests: parseInt(guests),
        addons: selectedAddons,
        price: {
          nightly: property.price,
          nights,
          subtotal,
          addonsTotal,
          cleaningFee,
          serviceFee,
          total
        }
      } 
    });
  };
  
  return (
    <div className="sticky top-6">
      <Card className="border shadow-md">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-baseline">
            <div className="flex items-baseline">
              <span className="text-xl font-bold">${property.price}</span>
              <span className="text-muted-foreground"> / night</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="font-medium mr-1">4.9</span>
              <span className="text-muted-foreground">(128 reviews)</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "MMM d")} - {format(date.to, "MMM d, yyyy")}
                        </>
                      ) : (
                        format(date.from, "MMM d, yyyy")
                      )
                    ) : (
                      <span>Check-in - Check-out</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                    disabled={(date) => date < new Date()}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="guests">Guests</Label>
              <Select
                value={guests}
                onValueChange={setGuests}
              >
                <SelectTrigger id="guests" className="w-full mt-1">
                  <SelectValue placeholder="Number of guests" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: property.maxGuests }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'guest' : 'guests'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {availableAddons.length > 0 && (
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full flex justify-between items-center"
                onClick={() => setShowAddons(!showAddons)}
              >
                <div className="flex items-center">
                  <Package className="h-4 w-4 mr-2" />
                  <span>{showAddons ? "Hide Add-ons" : "View Add-ons"}</span>
                </div>
                <span className="text-muted-foreground text-sm">
                  {selectedAddons.length ? `${selectedAddons.length} selected` : "Optional"}
                </span>
              </Button>
              
              {showAddons && (
                <div className="border rounded-md p-3 space-y-3 mt-1">
                  <h4 className="text-sm font-medium mb-2">Enhance your stay</h4>
                  {availableAddons.map((addon) => (
                    <div key={addon.id} className="flex items-start">
                      <Checkbox
                        id={`addon-${addon.id}`}
                        checked={selectedAddons.includes(addon.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedAddons([...selectedAddons, addon.id]);
                          } else {
                            setSelectedAddons(selectedAddons.filter(id => id !== addon.id));
                          }
                        }}
                        className="mt-1"
                      />
                      <div className="ml-3 space-y-1">
                        <label
                          htmlFor={`addon-${addon.id}`}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {addon.name} - ${addon.price}
                        </label>
                        <p className="text-xs text-muted-foreground">{addon.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          <Button 
            className="w-full" 
            disabled={!date?.from || !date?.to || nights === 0}
            onClick={handleReserve}
          >
            Reserve
          </Button>
          
          <div className="text-center text-sm text-muted-foreground">
            You won't be charged yet
          </div>
          
          {nights > 0 && (
            <>
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>${property.price} x {nights} nights</span>
                  <span>${subtotal}</span>
                </div>
                
                {selectedAddons.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm font-medium">
                      <span>Add-ons</span>
                      <span>${addonsTotal}</span>
                    </div>
                    {selectedAddons.map(addonId => {
                      const addon = mockAddons.find(a => a.id === addonId);
                      return addon ? (
                        <div key={addon.id} className="flex justify-between text-xs text-muted-foreground pl-4">
                          <span>{addon.name}</span>
                          <span>${addon.price}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Cleaning fee</span>
                  <span>${cleaningFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>${serviceFee}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total before taxes</span>
                  <span>${total}</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      <div className="mt-4 space-y-3">
        <div className="flex items-start">
          <CheckCircle className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Free cancellation before check-in</p>
            <p className="text-sm text-muted-foreground">Cancel before check-in for a full refund.</p>
          </div>
        </div>
        <div className="flex items-start">
          <CheckCircle className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Self check-in</p>
            <p className="text-sm text-muted-foreground">Check yourself in with the keypad.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyBookingCard;

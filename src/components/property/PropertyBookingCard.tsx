
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
import { CalendarIcon, Users, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface PropertyBookingCardProps {
  property: Property;
}

const PropertyBookingCard = ({ property }: PropertyBookingCardProps) => {
  const navigate = useNavigate();
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), 1),
    to: addDays(new Date(), 5),
  });
  const [guests, setGuests] = useState("2");
  
  // Calculate number of nights and total price
  const nights = date?.from && date?.to ? differenceInDays(date.to, date.from) : 0;
  const subtotal = property.price * nights;
  const cleaningFee = 60;
  const serviceFee = Math.round(subtotal * 0.12);
  const total = subtotal + cleaningFee + serviceFee;
  
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
        price: {
          nightly: property.price,
          nights,
          subtotal,
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

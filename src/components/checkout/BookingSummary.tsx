
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Users } from "lucide-react";
import { differenceInDays } from "date-fns";

interface BookingSummaryProps {
  propertyId: string;
  startDate: Date;
  endDate: Date;
  guests: number;
  price: {
    nightly: number;
    nights: number;
    subtotal: number;
    cleaningFee: number;
    serviceFee: number;
    total: number;
  };
}

const BookingSummary = ({ propertyId, startDate, endDate, guests, price }: BookingSummaryProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
        
        <div className="space-y-3">
          <div className="flex items-center">
            <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Check-in</p>
              <p className="text-muted-foreground text-sm">{format(startDate, "EEE, MMM d, yyyy")}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Check-out</p>
              <p className="text-muted-foreground text-sm">{format(endDate, "EEE, MMM d, yyyy")}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Guests</p>
              <p className="text-muted-foreground text-sm">{guests} {guests === 1 ? "guest" : "guests"}</p>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>${price.nightly} x {price.nights} nights</span>
            <span>${price.subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Cleaning fee</span>
            <span>${price.cleaningFee}</span>
          </div>
          <div className="flex justify-between">
            <span>Service fee</span>
            <span>${price.serviceFee}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${price.total}</span>
          </div>
          <p className="text-xs text-muted-foreground text-right">
            Taxes may be added at checkout
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingSummary;

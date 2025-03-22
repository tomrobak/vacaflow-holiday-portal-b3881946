
import { useState, useEffect } from "react";
import { Property, Customer } from "@/types/bookingForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, DollarSign, Calendar, Users } from "lucide-react";
import { differenceInDays, format } from "date-fns";

interface BookingPriceSummaryProps {
  selectedProperty: Property | null;
  startDate: Date | undefined;
  endDate: Date | undefined;
  guestCount: number;
}

const BookingPriceSummary = ({
  selectedProperty,
  startDate,
  endDate,
  guestCount,
}: BookingPriceSummaryProps) => {
  const [totalNights, setTotalNights] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [breakdown, setBreakdown] = useState<{label: string, amount: number}[]>([]);

  useEffect(() => {
    if (startDate && endDate && selectedProperty) {
      const nights = differenceInDays(endDate, startDate);
      setTotalNights(nights);
      
      const accommodationCost = nights * selectedProperty.price;
      const cleaningFee = selectedProperty.price * 0.15; // 15% of one night
      const serviceFee = accommodationCost * 0.08; // 8% service fee
      
      setBreakdown([
        { label: `${nights} nights × $${selectedProperty.price}`, amount: accommodationCost },
        { label: "Cleaning fee", amount: cleaningFee },
        { label: "Service fee", amount: serviceFee }
      ]);
      
      setTotalAmount(accommodationCost + cleaningFee + serviceFee);
    } else {
      setTotalNights(0);
      setTotalAmount(0);
      setBreakdown([]);
    }
  }, [startDate, endDate, selectedProperty]);

  return (
    <Card className="bg-white shadow-md border-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Price Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedProperty ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Check-in</span>
              </div>
              <div className="text-sm font-medium text-right">
                {startDate ? format(startDate, "MMM d, yyyy") : "Not selected"}
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Check-out</span>
              </div>
              <div className="text-sm font-medium text-right">
                {endDate ? format(endDate, "MMM d, yyyy") : "Not selected"}
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                <span>Duration</span>
              </div>
              <div className="text-sm font-medium text-right">
                {totalNights} {totalNights === 1 ? "night" : "nights"}
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-2" />
                <span>Guests</span>
              </div>
              <div className="text-sm font-medium text-right">
                {guestCount} {guestCount === 1 ? "person" : "people"}
              </div>
            </div>
            
            <div className="border-t pt-3 mt-3">
              <h4 className="text-sm font-medium mb-2">Price breakdown</h4>
              <div className="space-y-2">
                {breakdown.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.label}</span>
                    <span>${item.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-3 mt-3 flex justify-between font-medium">
                <span className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Total
                </span>
                <span className="text-primary text-lg">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="p-4 bg-muted rounded-md text-center text-sm text-muted-foreground">
            <p>Select a property and dates to see the price details.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingPriceSummary;

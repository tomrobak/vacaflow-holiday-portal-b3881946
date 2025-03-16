
import { format } from "date-fns";
import { CalendarDays, Users } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Price {
  nightly: number;
  nights: number;
  subtotal: number;
  cleaningFee: number;
  serviceFee: number;
  addonsTotal?: number;
  total: number;
}

interface BookingSummaryProps {
  propertyId: string;
  startDate: Date;
  endDate: Date;
  guests: number;
  price: Price;
}

const BookingSummary = ({
  propertyId,
  startDate,
  endDate,
  guests,
  price,
}: BookingSummaryProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="h-12 w-12 bg-muted rounded-md" />
          <div>
            <h3 className="font-medium text-sm">Your reservation</h3>
            <p className="text-xs text-muted-foreground">
              {price.nights} night stay in Property #{propertyId.substring(0, 8)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex">
            <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm">
                <span className="font-medium">
                  {format(new Date(startDate), "MMM d, yyyy")}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {format(new Date(endDate), "MMM d, yyyy")}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                {price.nights} {price.nights === 1 ? "night" : "nights"}
              </p>
            </div>
          </div>
          <div className="flex">
            <Users className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm">
                <span className="font-medium">{guests}</span>{" "}
                {guests === 1 ? "guest" : "guests"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="pt-6">
        <div className="w-full space-y-2">
          <div className="flex justify-between text-sm">
            <span>
              ${price.nightly} x {price.nights} nights
            </span>
            <span>${price.subtotal}</span>
          </div>
          {price.addonsTotal && price.addonsTotal > 0 && (
            <div className="flex justify-between text-sm">
              <span>Add-ons</span>
              <span>${price.addonsTotal}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span>Cleaning fee</span>
            <span>${price.cleaningFee}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Service fee</span>
            <span>${price.serviceFee}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${price.total}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BookingSummary;

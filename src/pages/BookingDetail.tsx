import { useParams } from "react-router-dom";
import { ArrowLeft, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const BookingDetail = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" className="mr-2" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bookings
          </Button>
        </div>
        <Button variant="outline" className="flex items-center">
          <Edit className="h-4 w-4 mr-2" />
          Edit Booking
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Booking #{id}</CardTitle>
                <Badge>Confirmed</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Property</h3>
                  <p className="mt-1">Ocean View Villa</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Guest</h3>
                  <p className="mt-1">John Smith</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Check-in / Check-out</h3>
                  <p className="mt-1">May 15, 2023 - May 20, 2023</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Guests</h3>
                  <p className="mt-1">2 Adults, 1 Child</p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <h3 className="font-medium text-sm">Notes</h3>
                <p className="mt-1 text-muted-foreground">
                  Guest has requested early check-in if possible.
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* We'd add more detail cards here in a real implementation */}
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Amount</span>
                  <span className="font-medium">$750.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount Paid</span>
                  <span className="font-medium">$375.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Balance Due</span>
                  <span className="font-medium">$375.00</span>
                </div>
                
                <Separator className="my-2" />
                
                <div className="flex justify-between items-center">
                  <span>Payment Status</span>
                  <Badge variant="outline">Partially Paid</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* We'd add more sidebar cards here in a real implementation */}
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;

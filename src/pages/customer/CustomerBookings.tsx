
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText, Info, CreditCard, Download } from "lucide-react";
import { toast } from "sonner";

const CustomerBookings = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  // Mock data that would come from an API in a real application
  const upcomingBookings = [
    { id: "BK-1001", property: "Beachside Villa", checkIn: "2023-08-12", checkOut: "2023-08-19", status: "confirmed", totalAmount: 1250.00, invoiceId: "INV-2001" },
    { id: "BK-1002", property: "Mountain Cabin", checkIn: "2023-09-20", checkOut: "2023-09-25", status: "pending", totalAmount: 750.00, invoiceId: "INV-2002" },
  ];

  const pastBookings = [
    { id: "BK-0999", property: "Lakeside Cottage", checkIn: "2023-06-10", checkOut: "2023-06-15", status: "completed", totalAmount: 950.00, invoiceId: "INV-1999" },
    { id: "BK-0998", property: "Downtown Apartment", checkIn: "2023-05-05", checkOut: "2023-05-08", status: "completed", totalAmount: 450.00, invoiceId: "INV-1998" },
    { id: "BK-0997", property: "Forest Retreat", checkIn: "2023-03-20", checkOut: "2023-03-25", status: "completed", totalAmount: 675.00, invoiceId: "INV-1997" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast.success(`Invoice ${invoiceId} download started`);
    // In a real app, this would trigger an actual download
  };

  const handleDownloadReceipt = (bookingId: string) => {
    toast.success(`Receipt for booking ${bookingId} download started`);
    // In a real app, this would trigger an actual download
  };

  const renderBookingsList = (bookings: any[]) => {
    return bookings.length > 0 ? (
      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card key={booking.id} className="overflow-hidden">
            <CardHeader className="bg-muted/50 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{booking.property}</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {new Date(booking.checkIn).toLocaleDateString()} to {new Date(booking.checkOut).toLocaleDateString()}
                  </div>
                </div>
                <Badge className={getStatusColor(booking.status)}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="font-medium">${booking.totalAmount.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Booking #{booking.id}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/customer/bookings/${booking.id}`}>
                      <Info className="h-4 w-4 mr-1" />
                      Details
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownloadInvoice(booking.invoiceId)}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Invoice
                  </Button>
                  
                  {booking.status === "completed" && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadReceipt(booking.id)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Receipt
                    </Button>
                  )}
                  
                  {(booking.status === "confirmed" || booking.status === "pending") && (
                    <Button variant="default" size="sm" asChild>
                      <Link to={`/customer/checkout/${booking.invoiceId}`}>
                        <CreditCard className="h-4 w-4 mr-1" />
                        Pay Now
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    ) : (
      <div className="text-center py-8 text-muted-foreground">
        No bookings found in this category.
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">My Bookings</h1>
      
      <Tabs defaultValue="upcoming" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          {renderBookingsList(upcomingBookings)}
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4">
          {renderBookingsList(pastBookings)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerBookings;

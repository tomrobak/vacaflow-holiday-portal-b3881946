
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CreditCard, FileText, MessageSquare, Home, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const CustomerDashboard = () => {
  // Mock data that would come from an API in a real application
  const upcomingBookings = [
    { id: "BK-1001", property: "Beachside Villa", checkIn: "2023-08-12", checkOut: "2023-08-19", status: "confirmed", invoiceId: "INV-2001" },
    { id: "BK-1002", property: "Mountain Cabin", checkIn: "2023-09-20", checkOut: "2023-09-25", status: "pending", invoiceId: "INV-2002" },
  ];
  
  const recentPayments = [
    { id: "PAY-2001", amount: 1250.00, date: "2023-07-15", status: "completed", bookingId: "BK-1001" },
    { id: "PAY-2002", amount: 450.00, date: "2023-08-01", status: "pending", bookingId: "BK-1002", invoiceId: "INV-2002" },
  ];

  const unpaidInvoices = [
    { id: "INV-2002", amount: 450.00, dueDate: "2023-08-15", bookingId: "BK-1002" }
  ];
  
  const unreadMessages = 2;

  const handleDownloadInvoice = (invoiceId: string) => {
    toast.success(`Invoice ${invoiceId} download started`);
    // In a real app, this would trigger an actual download
  };

  const handleDownloadReceipt = (paymentId: string) => {
    toast.success(`Receipt for payment ${paymentId} download started`);
    // In a real app, this would trigger an actual download
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Welcome back, Jane</h1>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Stays</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingBookings.length}</div>
            <p className="text-xs text-muted-foreground">Next: Aug 12 - Beachside Villa</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadMessages}</div>
            <p className="text-xs text-muted-foreground">Last message 2 days ago</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$450.00</div>
            <p className="text-xs text-muted-foreground">Due on August 15, 2023</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unpaid Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unpaidInvoices.length}</div>
            <p className="text-xs text-muted-foreground">
              <Link to="/customer/invoices" className="text-primary hover:underline">View all invoices</Link>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Bookings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Upcoming Bookings</h2>
          <Button variant="outline" size="sm" asChild>
            <Link to="/customer/bookings">View All</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingBookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle>{booking.property}</CardTitle>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    booking.status === "confirmed" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
                <CardDescription>
                  {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Ref: {booking.id}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/customer/bookings/${booking.id}`}>Details</Link>
                    </Button>
                    {booking.status === "pending" && (
                      <Button variant="default" size="sm" asChild>
                        <Link to={`/customer/checkout/${booking.invoiceId}`}>Pay Now</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Payments & Invoices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Payments</h2>
            <Button variant="outline" size="sm" asChild>
              <Link to="/customer/payments">View All</Link>
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentPayments.map((payment) => (
              <Card key={payment.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle>${payment.amount.toFixed(2)}</CardTitle>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      payment.status === "completed" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </div>
                  <CardDescription>
                    {new Date(payment.date).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Ref: {payment.id}</span>
                    {payment.status === "completed" ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadReceipt(payment.id)}
                        className="flex items-center"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Receipt
                      </Button>
                    ) : (
                      <Button variant="default" size="sm" asChild>
                        <Link to={`/customer/checkout/${payment.invoiceId}`}>Pay Now</Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Unpaid Invoices */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Unpaid Invoices</h2>
            <Button variant="outline" size="sm" asChild>
              <Link to="/customer/invoices">View All</Link>
            </Button>
          </div>
          
          <div className="space-y-4">
            {unpaidInvoices.map((invoice) => (
              <Card key={invoice.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle>${invoice.amount.toFixed(2)}</CardTitle>
                    <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800">
                      Due
                    </span>
                  </div>
                  <CardDescription>
                    Due by: {new Date(invoice.dueDate).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Invoice: {invoice.id}</span>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDownloadInvoice(invoice.id)}
                        className="flex items-center"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Invoice
                      </Button>
                      <Button variant="default" size="sm" asChild>
                        <Link to={`/customer/checkout/${invoice.id}`}>
                          <CreditCard className="h-4 w-4 mr-1" />
                          Pay Now
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {unpaidInvoices.length === 0 && (
              <Card>
                <CardContent className="py-6">
                  <div className="text-center text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground/60" />
                    <p>No unpaid invoices</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;

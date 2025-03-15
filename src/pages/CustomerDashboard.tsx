
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Download,
  FileText,
  MailCheck,
  MessageSquare,
  Phone,
  Mail,
  Share2,
  TrendingUp,
  UserCheck
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { notifyCustomerDataExported, notifyReportSentToCustomer } from "@/utils/customer-notifications";
import { notifyBookingStatusChange, notifyBookingEmailSent, notifyBookingInvoiceSent } from "@/utils/booking-notifications";

// Mock customer
interface CustomerDashboardData {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  totalSpent: number;
  bookingsCount: number;
  lastBooking: Date | null;
  nextBooking: Date | null;
  status: 'active' | 'pending' | 'inactive';
  loyaltyPoints: number;
  preferredProperties: string[];
  bookings: {
    id: string;
    propertyId: string;
    propertyName: string;
    startDate: Date;
    endDate: Date;
    status: 'upcoming' | 'completed' | 'cancelled' | 'confirmed';
    totalAmount: number;
    amountPaid: number;
    invoice?: {
      id: string;
      status: 'paid' | 'unpaid' | 'overdue' | 'refunded';
    };
  }[];
  payments: {
    id: string;
    date: Date;
    amount: number;
    method: string;
    status: 'successful' | 'pending' | 'failed';
    bookingId: string;
    invoiceId?: string;
  }[];
  invoices: {
    id: string;
    date: Date;
    dueDate: Date;
    amount: number;
    status: 'paid' | 'unpaid' | 'overdue' | 'refunded';
    bookingId: string;
    paymentId?: string;
  }[];
  messages: {
    id: string;
    date: Date;
    subject: string;
    content: string;
    isRead: boolean;
    bookingId?: string;
  }[];
}

// Mock data
const mockCustomer: CustomerDashboardData = {
  id: "CUST-1001",
  name: "John Smith",
  email: "john.smith@example.com",
  phone: "+1 (555) 123-4567",
  avatar: undefined,
  totalSpent: 6250.75,
  bookingsCount: 8,
  lastBooking: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), // 2 weeks ago
  nextBooking: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days from now
  status: 'active',
  loyaltyPoints: 450,
  preferredProperties: ["Beach Villa", "Mountain Cabin"],
  bookings: [
    {
      id: "BOOK-1001",
      propertyId: "PROP-101",
      propertyName: "Beach Villa Deluxe",
      startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days from now
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 37), // 37 days from now
      status: 'upcoming',
      totalAmount: 1200.00,
      amountPaid: 600.00,
      invoice: {
        id: "INV-2001",
        status: 'unpaid',
      },
    },
    {
      id: "BOOK-1002",
      propertyId: "PROP-102",
      propertyName: "Mountain Cabin",
      startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), // 14 days ago
      endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
      status: 'completed',
      totalAmount: 950.50,
      amountPaid: 950.50,
      invoice: {
        id: "INV-2002",
        status: 'paid',
      },
    },
    {
      id: "BOOK-1003",
      propertyId: "PROP-103",
      propertyName: "Lakeside Cottage",
      startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60), // 60 days ago
      endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 54), // 54 days ago
      status: 'completed',
      totalAmount: 750.25,
      amountPaid: 750.25,
      invoice: {
        id: "INV-2003",
        status: 'paid',
      },
    },
    {
      id: "BOOK-1004",
      propertyId: "PROP-104",
      propertyName: "City Apartment",
      startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60), // 60 days from now
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 64), // 64 days from now
      status: 'confirmed',
      totalAmount: 500,
      amountPaid: 250,
      invoice: {
        id: "INV-2004",
        status: 'unpaid',
      },
    },
  ],
  payments: [
    {
      id: "PAY-3001",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), // 15 days ago
      amount: 950.50,
      method: "Credit Card",
      status: 'successful',
      bookingId: "BOOK-1002",
      invoiceId: "INV-2002",
    },
    {
      id: "PAY-3002",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 61), // 61 days ago
      amount: 750.25,
      method: "PayPal",
      status: 'successful',
      bookingId: "BOOK-1003",
      invoiceId: "INV-2003",
    },
    {
      id: "PAY-3003",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      amount: 600.00,
      method: "Bank Transfer",
      status: 'pending',
      bookingId: "BOOK-1001",
      invoiceId: "INV-2001",
    },
    {
      id: "PAY-3004",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
      amount: 250.00,
      method: "Credit Card",
      status: 'successful',
      bookingId: "BOOK-1004",
      invoiceId: "INV-2004",
    },
  ],
  invoices: [
    {
      id: "INV-2001",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10), // 10 days from now
      amount: 1200.00,
      status: 'unpaid',
      bookingId: "BOOK-1001",
      paymentId: "PAY-3003",
    },
    {
      id: "INV-2002",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20), // 20 days ago
      dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
      amount: 950.50,
      status: 'paid',
      bookingId: "BOOK-1002",
      paymentId: "PAY-3001",
    },
    {
      id: "INV-2003",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 65), // 65 days ago
      dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 50), // 50 days ago
      amount: 750.25,
      status: 'paid',
      bookingId: "BOOK-1003",
      paymentId: "PAY-3002",
    },
    {
      id: "INV-2004",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 27), // 27 days from now
      amount: 500.00,
      status: 'unpaid',
      bookingId: "BOOK-1004",
      paymentId: "PAY-3004",
    },
  ],
  messages: [
    {
      id: "MSG-4001",
      date: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      subject: "Welcome to our property",
      content: "Hello John, we're excited to welcome you to Beach Villa Deluxe. Here's some information about your upcoming stay...",
      isRead: true,
      bookingId: "BOOK-1001",
    },
    {
      id: "MSG-4002",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
      subject: "How was your stay?",
      content: "Hello John, we hope you enjoyed your stay at Mountain Cabin. We'd love to hear your feedback...",
      isRead: true,
      bookingId: "BOOK-1002",
    },
    {
      id: "MSG-4003",
      date: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      subject: "Your upcoming stay",
      content: "Hello John, your stay at City Apartment is coming up. Here's some information you might find useful...",
      isRead: false,
      bookingId: "BOOK-1004",
    },
    {
      id: "MSG-4004",
      date: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      subject: "Invoice reminder",
      content: "Hello John, this is a friendly reminder that you have an upcoming payment due for your booking at Beach Villa Deluxe...",
      isRead: false,
      bookingId: "BOOK-1001",
    },
  ],
};

const CustomerDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [customer, setCustomer] = useState<CustomerDashboardData | null>(null);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isSendReportDialogOpen, setIsSendReportDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  
  // Fetch customer data
  useEffect(() => {
    // In a real app, this would be an API call
    setCustomer(mockCustomer);
  }, [id]);
  
  if (!customer) {
    return (
      <div className="p-6 flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Loading customer data...</h2>
          <p className="text-muted-foreground">Please wait while we retrieve the customer information.</p>
        </div>
      </div>
    );
  }
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Format date
  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  // Get booking status badge
  const getBookingStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge variant="outline" className="border-purple-500 text-purple-500">Upcoming</Badge>;
      case "completed":
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      case "confirmed":
        return <Badge variant="default" className="bg-blue-500">Confirmed</Badge>;
      default:
        return null;
    }
  };
  
  // Get payment status badge
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "successful":
        return <Badge variant="default" className="bg-green-500">Successful</Badge>;
      case "pending":
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Pending</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return null;
    }
  };
  
  // Get invoice status badge
  const getInvoiceStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge variant="default" className="bg-green-500">Paid</Badge>;
      case "unpaid":
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Unpaid</Badge>;
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      case "refunded":
        return <Badge variant="secondary">Refunded</Badge>;
      default:
        return null;
    }
  };
  
  // Handle export data
  const handleExportData = () => {
    console.log(`Exporting data for customer: ${customer.id}`);
    notifyCustomerDataExported(customer.name);
    setIsExportDialogOpen(false);
  };
  
  // Handle send report
  const handleSendReport = () => {
    console.log(`Sending report to customer: ${customer.id}`);
    notifyReportSentToCustomer(customer.name, customer.email);
    setIsSendReportDialogOpen(false);
  };
  
  // Handle send booking email
  const handleSendBookingEmail = (bookingId: string) => {
    console.log(`Sending booking email for booking: ${bookingId}`);
    const booking = customer.bookings.find(b => b.id === bookingId);
    if (booking) {
      notifyBookingEmailSent(customer.name, customer.email);
    }
  };
  
  // Handle send invoice
  const handleSendInvoice = (bookingId: string) => {
    console.log(`Sending invoice for booking: ${bookingId}`);
    const booking = customer.bookings.find(b => b.id === bookingId);
    if (booking) {
      notifyBookingInvoiceSent(customer.name, booking.totalAmount);
    }
  };
  
  // Handle update booking status
  const handleUpdateBookingStatus = (bookingId: string, status: string) => {
    console.log(`Updating booking status: ${bookingId} to ${status}`);
    const booking = customer.bookings.find(b => b.id === bookingId);
    if (booking) {
      notifyBookingStatusChange({ id: booking.id, customerName: customer.name }, status);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/customers")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{customer.name}'s Dashboard</h1>
            <p className="text-muted-foreground">
              Customer ID: {customer.id}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Customer Data</DialogTitle>
                <DialogDescription>
                  Choose which data you want to export for {customer.name}.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="exportBookings"
                    className="rounded border-gray-300"
                    defaultChecked
                  />
                  <label htmlFor="exportBookings">Bookings</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="exportPayments"
                    className="rounded border-gray-300"
                    defaultChecked
                  />
                  <label htmlFor="exportPayments">Payments</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="exportInvoices"
                    className="rounded border-gray-300"
                    defaultChecked
                  />
                  <label htmlFor="exportInvoices">Invoices</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="exportMessages"
                    className="rounded border-gray-300"
                    defaultChecked
                  />
                  <label htmlFor="exportMessages">Messages</label>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleExportData}>
                  Export
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isSendReportDialogOpen} onOpenChange={setIsSendReportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" className="flex items-center">
                <Share2 className="mr-2 h-4 w-4" />
                Send Report
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Customer Report</DialogTitle>
                <DialogDescription>
                  Send a booking and payment report to {customer.name}.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="emailTo" className="text-right">
                    To:
                  </label>
                  <input
                    id="emailTo"
                    value={customer.email}
                    className="col-span-3 rounded-md border p-2"
                    readOnly
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="reportType" className="text-right">
                    Report:
                  </label>
                  <select
                    id="reportType"
                    className="col-span-3 rounded-md border p-2"
                    defaultValue="booking-summary"
                  >
                    <option value="booking-summary">Booking Summary</option>
                    <option value="payment-history">Payment History</option>
                    <option value="full-account">Full Account Statement</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="reportMessage" className="text-right">
                    Message:
                  </label>
                  <textarea
                    id="reportMessage"
                    className="col-span-3 rounded-md border p-2"
                    rows={3}
                    placeholder="Add a personal message..."
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsSendReportDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendReport}>
                  Send
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Separator />
      
      {/* Customer Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
            <CardDescription>Contact and account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-2xl">
                {customer.name.charAt(0)}
              </div>
              <div>
                <div className="text-lg font-medium">{customer.name}</div>
                <div className="text-sm text-muted-foreground">
                  <Badge variant="outline" className="mr-2">
                    {customer.status === 'active' ? 'Active' : customer.status === 'pending' ? 'Pending' : 'Inactive'}
                  </Badge>
                  {customer.loyaltyPoints} loyalty points
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${customer.email}`} className="text-primary hover:underline">
                  {customer.email}
                </a>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${customer.phone}`} className="hover:underline">
                  {customer.phone}
                </a>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Total Bookings</div>
                <div className="text-lg font-medium">{customer.bookingsCount}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Spent</div>
                <div className="text-lg font-medium">{formatCurrency(customer.totalSpent)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Last Booking</div>
                <div className="text-lg font-medium">{formatDate(customer.lastBooking)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Next Booking</div>
                <div className="text-lg font-medium">{formatDate(customer.nextBooking)}</div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <div className="text-sm text-muted-foreground">Preferred Properties</div>
              <div className="flex flex-wrap gap-2 mt-1">
                {customer.preferredProperties.map((property, index) => (
                  <Badge key={index} variant="secondary">
                    {property}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Activity Overview */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>Recent bookings and financial activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Upcoming Bookings</p>
                      <p className="text-2xl font-bold">
                        {customer.bookings.filter(b => b.status === 'upcoming' || b.status === 'confirmed').length}
                      </p>
                    </div>
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Unpaid Invoices</p>
                      <p className="text-2xl font-bold">
                        {customer.invoices.filter(i => i.status === 'unpaid' || i.status === 'overdue').length}
                      </p>
                    </div>
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Unread Messages</p>
                      <p className="text-2xl font-bold">
                        {customer.messages.filter(m => !m.isRead).length}
                      </p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Upcoming Bookings</h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customer.bookings
                      .filter(b => b.status === 'upcoming' || b.status === 'confirmed')
                      .slice(0, 2)
                      .map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>{booking.propertyName}</TableCell>
                          <TableCell>
                            {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                          </TableCell>
                          <TableCell>{getBookingStatusBadge(booking.status)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(booking.totalAmount)}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/bookings/${booking.id}`}>View</Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    {customer.bookings.filter(b => b.status === 'upcoming' || b.status === 'confirmed').length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          No upcoming bookings.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Recent Activity</h3>
              <div className="space-y-4">
                {[...customer.payments, ...customer.messages]
                  .sort((a, b) => b.date.getTime() - a.date.getTime())
                  .slice(0, 3)
                  .map((item) => {
                    const isPayment = 'method' in item;
                    return (
                      <div key={item.id} className="flex items-start space-x-3 p-3 rounded-md border">
                        {isPayment ? (
                          <CreditCard className="h-5 w-5 mt-1 text-muted-foreground" />
                        ) : (
                          <MessageSquare className="h-5 w-5 mt-1 text-muted-foreground" />
                        )}
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">
                              {isPayment
                                ? `Payment ${(item as typeof customer.payments[0]).status}`
                                : (item as typeof customer.messages[0]).subject}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(item.date)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {isPayment
                              ? `${formatCurrency((item as typeof customer.payments[0]).amount)} via ${(item as typeof customer.payments[0]).method}`
                              : (item as typeof customer.messages[0]).content.substring(0, 60) + '...'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs for Bookings, Payments, Invoices, Messages */}
      <Tabs defaultValue="bookings" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="bookings" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Bookings
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center">
            <CreditCard className="mr-2 h-4 w-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Invoices
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            Messages
          </TabsTrigger>
        </TabsList>
        
        {/* Bookings Tab */}
        <TabsContent value="bookings" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Bookings</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/bookings/new?customerId=${customer.id}`}>
                    New Booking
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Paid</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customer.bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.id}</TableCell>
                        <TableCell>{booking.propertyName}</TableCell>
                        <TableCell>
                          {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                        </TableCell>
                        <TableCell>{getBookingStatusBadge(booking.status)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(booking.totalAmount)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(booking.amountPaid)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedBooking(booking.id)}>
                                  <UserCheck className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Update Booking Status</DialogTitle>
                                  <DialogDescription>
                                    Change the status of booking {booking.id}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <label className="text-right">New Status:</label>
                                    <select className="col-span-3 p-2 rounded-md border">
                                      <option value="confirmed">Confirmed</option>
                                      <option value="pending">Pending</option>
                                      <option value="cancelled">Cancelled</option>
                                      <option value="completed">Completed</option>
                                    </select>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <label className="text-right">Notes:</label>
                                    <textarea className="col-span-3 p-2 rounded-md border" rows={3} />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button 
                                    variant="outline" 
                                    onClick={() => setSelectedBooking(null)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button 
                                    onClick={() => {
                                      handleUpdateBookingStatus(booking.id, 'confirmed');
                                      setSelectedBooking(null);
                                    }}
                                  >
                                    Update
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleSendBookingEmail(booking.id)}
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                            
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleSendInvoice(booking.id)}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                            
                            <Button variant="ghost" size="icon" asChild>
                              <Link to={`/bookings/${booking.id}`}>
                                <TrendingUp className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {customer.bookings.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No bookings found for this customer.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Payments Tab */}
        <TabsContent value="payments" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Payments</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/payments/new?customerId=${customer.id}`}>
                    New Payment
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Booking</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customer.payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.id}</TableCell>
                        <TableCell>{formatDate(payment.date)}</TableCell>
                        <TableCell>{payment.method}</TableCell>
                        <TableCell>{getPaymentStatusBadge(payment.status)}</TableCell>
                        <TableCell>
                          <Button variant="link" asChild className="p-0 h-auto" size="sm">
                            <Link to={`/bookings/${payment.bookingId}`}>
                              {payment.bookingId}
                            </Link>
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(payment.amount)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/payments/${payment.id}`}>
                              <TrendingUp className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {customer.payments.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No payments found for this customer.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Invoices Tab */}
        <TabsContent value="invoices" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Booking</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customer.invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{formatDate(invoice.date)}</TableCell>
                        <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                        <TableCell>{getInvoiceStatusBadge(invoice.status)}</TableCell>
                        <TableCell>
                          <Button variant="link" asChild className="p-0 h-auto" size="sm">
                            <Link to={`/bookings/${invoice.bookingId}`}>
                              {invoice.bookingId}
                            </Link>
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(invoice.amount)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleSendBookingEmail(invoice.bookingId)}
                            >
                              <MailCheck className="h-4 w-4" />
                            </Button>
                            
                            <Button variant="ghost" size="icon" asChild>
                              <Link to={`/payments/${invoice.paymentId}`}>
                                <CreditCard className="h-4 w-4" />
                              </Link>
                            </Button>
                            
                            <Button variant="ghost" size="icon" asChild>
                              <Link to={`/bookings/${invoice.bookingId}`}>
                                <TrendingUp className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {customer.invoices.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No invoices found for this customer.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Messages Tab */}
        <TabsContent value="messages" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Messages</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/messages/new?customerId=${customer.id}`}>
                    New Message
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customer.messages.map((message) => (
                  <Card key={message.id} className={message.isRead ? "" : "border-l-4 border-l-primary"}>
                    <CardContent className="p-4">
                      <div className="flex justify-between mb-2">
                        <div className="font-medium">{message.subject}</div>
                        <div className="text-sm text-muted-foreground">{formatDate(message.date)}</div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {message.content.length > 100
                          ? message.content.substring(0, 100) + '...'
                          : message.content}
                      </p>
                      <div className="flex justify-between items-center">
                        {message.bookingId && (
                          <Button variant="link" asChild className="p-0 h-auto" size="sm">
                            <Link to={`/bookings/${message.bookingId}`}>
                              View related booking: {message.bookingId}
                            </Link>
                          </Button>
                        )}
                        <div className="flex items-center space-x-2">
                          <Badge variant={message.isRead ? "outline" : "default"}>
                            {message.isRead ? "Read" : "Unread"}
                          </Badge>
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/messages/${message.id}`}>
                              View
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {customer.messages.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground border rounded-md">
                    No messages found for this customer.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
    </div>
  );
};

export default CustomerDashboard;

import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Pencil, 
  Trash2, 
  Calendar, 
  CreditCard, 
  Mail, 
  Phone, 
  MapPin, 
  Check, 
  X,
  Eye,
  UserCog,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import SmsHistory from "@/components/sms/SmsHistory";
import QuickSmsForm from "@/components/sms/QuickSmsForm";
import { SmsMessage } from "@/types/sms";

type CustomerStatus = "active" | "inactive" | "pending";

interface CustomerBooking {
  id: string;
  propertyName: string;
  checkIn: Date;
  checkOut: Date;
  totalAmount: number;
  status: 'confirmed' | 'cancelled' | 'completed' | 'upcoming';
}

interface CustomerPayment {
  id: string;
  date: Date;
  amount: number;
  method: string;
  status: 'successful' | 'pending' | 'failed';
  bookingId: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  status: CustomerStatus;
  totalBookings: number;
  totalSpent: number;
  lastBooking: Date | null;
  createdAt: Date;
  notes?: string;
  bookings: CustomerBooking[];
  payments: CustomerPayment[];
}

const mockCustomer: Customer = {
  id: "CUST-1001",
  name: "John Smith",
  email: "john.smith@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main Street",
  city: "Miami",
  state: "Florida",
  zipCode: "33101",
  country: "United States",
  status: "active",
  totalBookings: 8,
  totalSpent: 6250.75,
  lastBooking: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365),
  notes: "Prefers beachfront properties. Allergic to pets. Often books for family vacations.",
  bookings: Array.from({ length: 8 }, (_, i) => ({
    id: `BOOK-${2000 + i}`,
    propertyName: `Beach Villa ${i + 1}`,
    checkIn: new Date(Date.now() - 1000 * 60 * 60 * 24 * (365 - i * 45)),
    checkOut: new Date(Date.now() - 1000 * 60 * 60 * 24 * (358 - i * 45)),
    totalAmount: 500 + Math.floor(Math.random() * 1000),
    status: ['confirmed', 'cancelled', 'completed', 'upcoming'][Math.floor(Math.random() * 4)] as 'confirmed' | 'cancelled' | 'completed' | 'upcoming',
  })),
  payments: Array.from({ length: 10 }, (_, i) => ({
    id: `PAY-${3000 + i}`,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * (365 - i * 36)),
    amount: 200 + Math.floor(Math.random() * 800),
    method: ['Credit Card', 'PayPal', 'Bank Transfer'][Math.floor(Math.random() * 3)],
    status: ['successful', 'pending', 'failed'][Math.floor(Math.random() * 3)] as 'successful' | 'pending' | 'failed',
    bookingId: `BOOK-${2000 + Math.floor(i / 2)}`,
  })),
};

const mockSmsMessages: SmsMessage[] = [
  {
    id: "sms-1",
    customerId: "CUST-1001",
    content: "Your booking #BOOK-2005 has been confirmed for Beach Villa 6. Check-in date: May 15, 2023. We look forward to welcoming you!",
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    status: "delivered",
    twilioMessageId: "SM123456789",
  },
  {
    id: "sms-2",
    customerId: "CUST-1001",
    content: "Just a reminder that your payment of $750 for booking #BOOK-2006 is due tomorrow. Please let us know if you have any questions.",
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
    status: "delivered",
    twilioMessageId: "SM987654321",
  },
  {
    id: "sms-3",
    customerId: "CUST-1001",
    content: "Thanks for your stay at Beach Villa 7! We hope you enjoyed your visit. We'd appreciate it if you could leave a review of your experience.",
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    status: "sent",
    twilioMessageId: "SM567891234",
  },
  {
    id: "sms-4",
    customerId: "CUST-1001",
    content: "We noticed you have an upcoming booking (#BOOK-2007) at Beach Villa 8. Check-in instructions: Access code is 4321, park in space #8.",
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    status: "failed",
    twilioMessageId: "SM321654987",
  },
];

const CustomerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer] = useState<Customer>(mockCustomer);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [smsMessages, setSmsMessages] = useState<SmsMessage[]>(mockSmsMessages);
  const [isQuickSmsOpen, setIsQuickSmsOpen] = useState(false);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const formatDate = (date: Date | null) => {
    if (!date) return 'Never';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  const getStatusBadge = (status: CustomerStatus) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary" className="bg-gray-500">Inactive</Badge>;
      case "pending":
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Pending</Badge>;
      default:
        return null;
    }
  };
  
  const getBookingStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="default" className="bg-blue-500">Confirmed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      case "completed":
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case "upcoming":
        return <Badge variant="outline" className="border-purple-500 text-purple-500">Upcoming</Badge>;
      default:
        return null;
    }
  };
  
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
  
  const deleteCustomer = () => {
    console.log(`Deleting customer: ${customer.id}`);
    toast.success("Customer deleted successfully!");
    navigate("/customers");
  };

  const handleSendSms = (message: string) => {
    const newMessage: SmsMessage = {
      id: `sms-${Date.now()}`,
      customerId: customer.id,
      content: message,
      sentAt: new Date(),
      status: "sent",
      twilioMessageId: `SM${Math.floor(Math.random() * 1000000000)}`,
    };
    
    setSmsMessages([newMessage, ...smsMessages]);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/customers")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{customer.name}</h1>
            <p className="text-muted-foreground">
              Customer ID: {customer.id}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setIsQuickSmsOpen(true)}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Send SMS
          </Button>
          
          <Button variant="outline" asChild>
            <Link to={`/customers/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Customer</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this customer? This action cannot be undone, and all associated data will be permanently removed.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={deleteCustomer}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Separator />
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
            <CardDescription>Personal details and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Status</div>
              <div>{getStatusBadge(customer.status)}</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Contact</div>
              <div className="flex items-start space-x-2">
                <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <a href={`mailto:${customer.email}`} className="text-primary hover:underline">
                  {customer.email}
                </a>
              </div>
              {customer.phone && (
                <div className="flex items-start space-x-2">
                  <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <a href={`tel:${customer.phone}`} className="hover:underline">
                    {customer.phone}
                  </a>
                </div>
              )}
            </div>
            
            {(customer.address || customer.city || customer.state || customer.zipCode || customer.country) && (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Address</div>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    {customer.address && <div>{customer.address}</div>}
                    {(customer.city || customer.state || customer.zipCode) && (
                      <div>
                        {customer.city && `${customer.city}, `}
                        {customer.state && `${customer.state} `}
                        {customer.zipCode && customer.zipCode}
                      </div>
                    )}
                    {customer.country && <div>{customer.country}</div>}
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Dates</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Created</div>
                  <div>{formatDate(customer.createdAt)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Last Booking</div>
                  <div>{formatDate(customer.lastBooking)}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Booking history and payment stats</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg border p-4">
                <div className="text-xs text-muted-foreground uppercase">Total Bookings</div>
                <div className="mt-1 flex items-baseline">
                  <div className="text-3xl font-semibold">{customer.totalBookings}</div>
                </div>
              </div>
              
              <div className="rounded-lg border p-4">
                <div className="text-xs text-muted-foreground uppercase">Total Spent</div>
                <div className="mt-1 flex items-baseline">
                  <div className="text-3xl font-semibold">{formatCurrency(customer.totalSpent)}</div>
                </div>
              </div>
              
              <div className="rounded-lg border p-4">
                <div className="text-xs text-muted-foreground uppercase">Avg. Booking Value</div>
                <div className="mt-1 flex items-baseline">
                  <div className="text-3xl font-semibold">
                    {customer.totalBookings > 0
                      ? formatCurrency(customer.totalSpent / customer.totalBookings)
                      : formatCurrency(0)}
                  </div>
                </div>
              </div>
            </div>
            
            {customer.notes && (
              <div className="rounded-lg border p-4">
                <div className="text-sm font-medium">Notes</div>
                <div className="mt-1 text-sm text-muted-foreground">{customer.notes}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="bookings" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="bookings" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Bookings
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center">
            <CreditCard className="mr-2 h-4 w-4" />
            Payment History
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            SMS History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="bookings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Booking History</CardTitle>
              <CardDescription>
                List of all bookings made by this customer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customer.bookings.length > 0 ? (
                      customer.bookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.id}</TableCell>
                          <TableCell>{booking.propertyName}</TableCell>
                          <TableCell>{formatDate(booking.checkIn)}</TableCell>
                          <TableCell>{formatDate(booking.checkOut)}</TableCell>
                          <TableCell>{formatCurrency(booking.totalAmount)}</TableCell>
                          <TableCell>{getBookingStatusBadge(booking.status)}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" asChild>
                              <Link to={`/bookings/${booking.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
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
            <CardFooter className="justify-end">
              <Button variant="outline" asChild>
                <Link to="/bookings">View All Bookings</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Payment History</CardTitle>
              <CardDescription>
                All payments made by this customer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Booking ID</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customer.payments.length > 0 ? (
                      customer.payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">{payment.id}</TableCell>
                          <TableCell>{formatDate(payment.date)}</TableCell>
                          <TableCell>{formatCurrency(payment.amount)}</TableCell>
                          <TableCell>{payment.method}</TableCell>
                          <TableCell>{getPaymentStatusBadge(payment.status)}</TableCell>
                          <TableCell>
                            <Button variant="link" asChild className="p-0 h-auto" size="sm">
                              <Link to={`/bookings/${payment.bookingId}`}>
                                {payment.bookingId}
                              </Link>
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" asChild>
                              <Link to={`/payments/${payment.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
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
            <CardFooter className="justify-end">
              <Button variant="outline" asChild>
                <Link to="/payments">View All Payments</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="messages" className="mt-6">
          <SmsHistory 
            messages={smsMessages} 
            customerId={customer.id} 
            onSendNew={() => setIsQuickSmsOpen(true)}
          />
        </TabsContent>
      </Tabs>
      
      <QuickSmsForm
        open={isQuickSmsOpen}
        onOpenChange={setIsQuickSmsOpen}
        customerName={customer.name}
        customerPhone={customer.phone}
        customerId={customer.id}
        onSend={handleSendSms}
      />
    </div>
  );
};

export default CustomerDetail;

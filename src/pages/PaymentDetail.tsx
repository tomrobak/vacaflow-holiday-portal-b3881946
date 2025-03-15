
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Printer, 
  FileText, 
  Mail,
  Download,
  RefreshCcw,
  DollarSign,
  Calendar,
  CreditCard,
  User,
  Home,
  ClipboardCheck,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Payment, PaymentStatus } from "@/types/payment";

// Mock data for a single payment
const mockPayment: Payment = {
  id: "PAY-3021",
  bookingId: "BOOK-2043",
  customerId: "CUST-1012",
  propertyId: "PROP-524",
  amount: 875.50,
  currency: "USD",
  method: "credit_card",
  status: "successful",
  date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), // 2 weeks ago
  transactionId: "TXN-578923",
  receiptUrl: "https://receipts.example.com/578923",
  notes: "Payment for summer vacation booking. Premium package with additional cleaning service.",
};

// Mock data for customer and property
const mockCustomer = {
  id: "CUST-1012",
  name: "Sarah Johnson",
  email: "sarah.johnson@example.com",
  phone: "+1 (555) 987-6543",
};

const mockProperty = {
  id: "PROP-524",
  name: "Beachfront Villa in Miami",
  address: "123 Ocean Drive, Miami, FL 33139",
};

const mockBooking = {
  id: "BOOK-2043",
  checkIn: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days in future
  checkOut: new Date(Date.now() + 1000 * 60 * 60 * 24 * 37), // 37 days in future
  totalAmount: 1025.50,
  balance: 150.00,
};

const PaymentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [payment] = useState<Payment>(mockPayment);
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Format date
  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  // Format date short
  const formatDateShort = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  // Payment status badge
  const getPaymentStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case "successful":
        return <Badge variant="default" className="bg-green-500">Successful</Badge>;
      case "pending":
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Pending</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "refunded":
        return <Badge variant="secondary">Refunded</Badge>;
      default:
        return null;
    }
  };
  
  // Payment method display
  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case "credit_card":
        return (
          <div className="flex items-center">
            <CreditCard className="h-4 w-4 mr-2" />
            Credit Card
          </div>
        );
      case "paypal":
        return (
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2" />
            PayPal
          </div>
        );
      case "bank_transfer":
        return (
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Bank Transfer
          </div>
        );
      case "cash":
        return (
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2" />
            Cash
          </div>
        );
      default:
        return method;
    }
  };
  
  // Process refund
  const processRefund = () => {
    // In a real app, this would call an API to process the refund
    console.log(`Processing refund for payment: ${payment.id}`);
    toast.success("Refund processed successfully!");
    setIsRefundDialogOpen(false);
    navigate(`/payments/${id}`);  // Refresh the page
  };
  
  // Send receipt
  const sendReceipt = () => {
    // In a real app, this would call an API to send the receipt
    console.log(`Sending receipt for payment: ${payment.id}`);
    toast.success("Receipt sent successfully!");
  };
  
  // Download receipt
  const downloadReceipt = () => {
    // In a real app, this would trigger a download
    console.log(`Downloading receipt for payment: ${payment.id}`);
    toast.success("Receipt downloaded successfully!");
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/payments")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Payment {payment.id}</h1>
            <p className="text-muted-foreground">
              Transaction on {formatDateShort(payment.date)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={sendReceipt}>
            <Mail className="mr-2 h-4 w-4" />
            Email Receipt
          </Button>
          
          <Button variant="outline" onClick={downloadReceipt}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          
          {payment.status === "successful" && !payment.refundAmount && (
            <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary">
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Process Refund
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Process Refund</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to refund this payment? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment ID:</span>
                      <span className="font-medium">{payment.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-medium">{formatCurrency(payment.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Customer:</span>
                      <span className="font-medium">{mockCustomer.name}</span>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsRefundDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={processRefund}>
                    Confirm Refund
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      
      <Separator />
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
            <CardDescription>Payment details and transaction information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Status</div>
              <div>{getPaymentStatusBadge(payment.status)}</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Amount</div>
              <div className="text-3xl font-bold">{formatCurrency(payment.amount)}</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Payment Method</div>
              <div>{getPaymentMethodDisplay(payment.method)}</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Transaction Details</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Date & Time</div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    {formatDate(payment.date)}
                  </div>
                </div>
                {payment.transactionId && (
                  <div>
                    <div className="text-xs text-muted-foreground">Transaction ID</div>
                    <div className="flex items-center">
                      <ClipboardCheck className="h-4 w-4 mr-1 text-muted-foreground" />
                      {payment.transactionId}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {payment.dueDate && (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Due Date</div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                  {formatDateShort(payment.dueDate)}
                </div>
              </div>
            )}
            
            {payment.refundAmount && (
              <div className="rounded-lg border p-4 bg-secondary/50">
                <div className="text-sm font-medium">Refund Information</div>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Amount:</span>
                    <span>{formatCurrency(payment.refundAmount)}</span>
                  </div>
                  {payment.refundDate && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Date:</span>
                      <span>{formatDateShort(payment.refundDate)}</span>
                    </div>
                  )}
                  {payment.refundReason && (
                    <div className="pt-1">
                      <span className="text-sm text-muted-foreground">Reason:</span>
                      <p className="text-sm mt-1">{payment.refundReason}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Related Information</CardTitle>
            <CardDescription>Booking and customer details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Customer
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/customers/${mockCustomer.id}`}>View Customer</Link>
                </Button>
              </div>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Name:</span>
                  <span>{mockCustomer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <a href={`mailto:${mockCustomer.email}`} className="text-primary hover:underline">
                    {mockCustomer.email}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Phone:</span>
                  <a href={`tel:${mockCustomer.phone}`} className="hover:underline">
                    {mockCustomer.phone}
                  </a>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium flex items-center">
                  <Home className="h-4 w-4 mr-2" />
                  Property
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/properties/${mockProperty.id}`}>View Property</Link>
                </Button>
              </div>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Name:</span>
                  <span>{mockProperty.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Address:</span>
                  <span>{mockProperty.address}</span>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Booking Details
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/bookings/${mockBooking.id}`}>View Booking</Link>
                </Button>
              </div>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Booking ID:</span>
                  <span>{mockBooking.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Check In:</span>
                  <span>{formatDateShort(mockBooking.checkIn)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Check Out:</span>
                  <span>{formatDateShort(mockBooking.checkOut)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Amount:</span>
                  <span>{formatCurrency(mockBooking.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Balance Due:</span>
                  <span>{formatCurrency(mockBooking.balance)}</span>
                </div>
              </div>
            </div>
            
            {payment.notes && (
              <div className="rounded-lg border p-4">
                <div className="text-sm font-medium">Notes</div>
                <p className="text-sm text-muted-foreground mt-2">{payment.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="activity" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
          <TabsTrigger value="related">Related Payments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Activity Log</CardTitle>
              <CardDescription>
                Recent activity related to this payment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Payment processed</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(payment.amount)} was successfully processed
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDate(payment.date)}</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Receipt sent</p>
                    <p className="text-sm text-muted-foreground">
                      Receipt was automatically sent to {mockCustomer.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(new Date(payment.date.getTime() + 60000))}
                    </p>
                  </div>
                </div>
                
                {payment.refundAmount && payment.refundDate && (
                  <div className="flex">
                    <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                      <RefreshCcw className="h-5 w-5 text-destructive" />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Refund processed</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(payment.refundAmount)} was refunded to customer
                      </p>
                      <p className="text-xs text-muted-foreground">{formatDate(payment.refundDate)}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="related" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Related Payments</CardTitle>
              <CardDescription>
                Other payments for the same booking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-secondary/50">
                      <th className="px-4 py-2 text-left font-medium">ID</th>
                      <th className="px-4 py-2 text-left font-medium">Date</th>
                      <th className="px-4 py-2 text-left font-medium">Amount</th>
                      <th className="px-4 py-2 text-left font-medium">Method</th>
                      <th className="px-4 py-2 text-left font-medium">Status</th>
                      <th className="px-4 py-2 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="px-4 py-2 font-medium">PAY-3020</td>
                      <td className="px-4 py-2">{formatDateShort(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30))}</td>
                      <td className="px-4 py-2">{formatCurrency(150)}</td>
                      <td className="px-4 py-2">
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Credit Card
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <Badge variant="default" className="bg-green-500">Successful</Badge>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to="/payments/PAY-3020">View</Link>
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {mockBooking.balance > 0 && (
                <div className="mt-4 rounded-md bg-secondary/50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Balance Due</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(mockBooking.balance)} remaining for this booking
                      </p>
                    </div>
                    <Button asChild>
                      <Link to={`/payments/new?bookingId=${mockBooking.id}`}>
                        Record Payment
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentDetail;

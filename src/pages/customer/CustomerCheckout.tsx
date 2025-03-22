
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  CreditCard, 
  CheckCircle2, 
  Shield 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface InvoiceDetail {
  id: string;
  bookingId: string;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'unpaid';
}

const CustomerCheckout = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setInvoice({
        id: id || "INV-2001",
        bookingId: "BK-1001",
        propertyName: "Beachside Villa",
        checkIn: "2023-08-12",
        checkOut: "2023-08-19",
        amount: 625.00, // Remaining balance
        dueDate: "2023-07-30",
        status: "unpaid"
      });
      setLoading(false);
    }, 500);
  }, [id]);

  const handlePayment = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Payment successful! Redirecting to booking details.");
      
      // In a real app, this would be after a successful payment API call
      setTimeout(() => {
        navigate(`/customer/bookings/${invoice?.bookingId}`);
      }, 1500);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-64 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-64 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Invoice not found</h1>
        <p className="mt-2">The invoice you're looking for doesn't exist or you don't have permission to view it.</p>
        <Button asChild className="mt-4">
          <Link to="/customer/invoices">Back to Invoices</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header with back button */}
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" asChild>
          <Link to="/customer/invoices">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Complete Payment</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Payment form */}
        <div className="md:col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Select how you'd like to pay</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2 border rounded-md p-4">
                  <RadioGroupItem value="credit-card" id="credit-card" />
                  <Label htmlFor="credit-card" className="flex-1 cursor-pointer">
                    <div className="font-medium">Credit or Debit Card</div>
                    <div className="text-sm text-muted-foreground">Pay securely with your card</div>
                  </Label>
                  <div className="flex items-center space-x-1">
                    <div className="h-8 w-12 bg-blue-500 rounded"></div>
                    <div className="h-8 w-12 bg-red-500 rounded"></div>
                    <div className="h-8 w-12 bg-gray-300 rounded"></div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 border rounded-md p-4">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                    <div className="font-medium">PayPal</div>
                    <div className="text-sm text-muted-foreground">Pay using your PayPal account</div>
                  </Label>
                  <div className="h-8 w-20 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
                    PayPal
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 border rounded-md p-4">
                  <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                  <Label htmlFor="bank-transfer" className="flex-1 cursor-pointer">
                    <div className="font-medium">Bank Transfer</div>
                    <div className="text-sm text-muted-foreground">Pay directly from your bank account</div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {paymentMethod === "credit-card" && (
            <Card>
              <CardHeader>
                <CardTitle>Card Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="card-name">Cardholder Name</Label>
                  <Input id="card-name" placeholder="Name as it appears on card" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input id="card-number" placeholder="1234 5678 9012 3456" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" />
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 mr-2" />
                  Your payment information is secure and encrypted
                </div>
              </CardContent>
            </Card>
          )}
          
          {paymentMethod === "paypal" && (
            <Card>
              <CardContent className="p-4">
                <p className="text-center">
                  Click the "Pay Now" button to be redirected to PayPal to complete your payment.
                </p>
              </CardContent>
            </Card>
          )}
          
          {paymentMethod === "bank-transfer" && (
            <Card>
              <CardHeader>
                <CardTitle>Bank Transfer Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Bank Name</div>
                  <div>First National Bank</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Account Name</div>
                  <div>Vacation Rentals LLC</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Account Number</div>
                  <div>1234567890</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Routing Number</div>
                  <div>987654321</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Reference</div>
                  <div className="font-bold">{invoice.id}</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Please include the reference number in your transfer details.
                  Allow 1-3 business days for the payment to be processed.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Order summary */}
        <div className="md:col-span-2">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
              <CardDescription>Invoice #{invoice.id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="font-medium">{invoice.propertyName}</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(invoice.checkIn).toLocaleDateString()} - {new Date(invoice.checkOut).toLocaleDateString()}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Amount Due</span>
                  <span>${invoice.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Due Date</span>
                  <span>{new Date(invoice.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${invoice.amount.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full flex items-center justify-center" 
                size="lg"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay ${invoice.amount.toFixed(2)}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerCheckout;

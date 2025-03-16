
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CreditCard, CheckCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface PaymentFormProps {
  onComplete: (paymentId: string) => void;
  totalAmount: number;
}

const formSchema = z.object({
  paymentMethod: z.enum(["card", "paypal"]),
  cardholderName: z.string().min(2, "Cardholder name is required").optional().or(z.literal("")),
  cardNumber: z.string().min(16, "Card number must be at least 16 digits").max(19).optional().or(z.literal("")),
  expiryMonth: z.string().optional().or(z.literal("")),
  expiryYear: z.string().optional().or(z.literal("")),
  cvv: z.string().min(3, "CVV must be 3 or 4 digits").max(4).optional().or(z.literal("")),
  billingAddress: z.string().min(5, "Billing address is required").optional().or(z.literal("")),
  billingCity: z.string().min(2, "City is required").optional().or(z.literal("")),
  billingState: z.string().min(2, "State is required").optional().or(z.literal("")),
  billingZip: z.string().min(5, "Zip code is required").optional().or(z.literal("")),
  billingCountry: z.string().min(2, "Country is required").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

const PaymentForm = ({ onComplete, totalAmount }: PaymentFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentMethod: "card",
      cardholderName: "",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      billingAddress: "",
      billingCity: "",
      billingState: "",
      billingZip: "",
      billingCountry: "",
    },
  });

  const watchPaymentMethod = form.watch("paymentMethod");
  
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, you would call Stripe API to process payment
      console.log("Processing payment:", data);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a mock payment ID
      const paymentId = `pi_${Math.random().toString(36).substring(2, 10)}`;
      
      toast.success("Payment processed successfully!");
      onComplete(paymentId);
    } catch (err) {
      console.error("Payment failed:", err);
      setError("Payment processing failed. Please try again.");
      toast.error("Payment processing failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Payment Method</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-2"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0 p-4 border rounded-md">
                    <FormControl>
                      <RadioGroupItem value="card" />
                    </FormControl>
                    <div className="space-y-1 leading-none flex-1">
                      <FormLabel className="font-normal text-base flex items-center">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Credit / Debit Card
                      </FormLabel>
                    </div>
                    <div className="flex gap-2">
                      <img 
                        src="/placeholder.svg" 
                        alt="Visa" 
                        className="h-8 w-auto"
                      />
                      <img 
                        src="/placeholder.svg" 
                        alt="Mastercard" 
                        className="h-8 w-auto"
                      />
                      <img 
                        src="/placeholder.svg" 
                        alt="Amex" 
                        className="h-8 w-auto"
                      />
                    </div>
                  </FormItem>
                  
                  <FormItem className="flex items-center space-x-3 space-y-0 p-4 border rounded-md opacity-60">
                    <FormControl>
                      <RadioGroupItem value="paypal" disabled />
                    </FormControl>
                    <div className="space-y-1 leading-none flex-1">
                      <FormLabel className="font-normal text-base">PayPal</FormLabel>
                    </div>
                    <Badge variant="outline">Coming Soon</Badge>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchPaymentMethod === "card" && (
          <>
            <FormField
              control={form.control}
              name="cardholderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cardholder Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Number</FormLabel>
                  <FormControl>
                    <Input placeholder="4242 4242 4242 4242" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <FormField
                  control={form.control}
                  name="expiryMonth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Month</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="MM" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => {
                            const month = i + 1;
                            return (
                              <SelectItem key={month} value={month.toString().padStart(2, '0')}>
                                {month.toString().padStart(2, '0')}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="col-span-1">
                <FormField
                  control={form.control}
                  name="expiryYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Year</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="YY" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => {
                            const year = new Date().getFullYear() + i;
                            return (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="col-span-1">
                <FormField
                  control={form.control}
                  name="cvv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVV</FormLabel>
                      <FormControl>
                        <Input placeholder="123" {...field} maxLength={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Billing Address</h3>
              
              <FormField
                control={form.control}
                name="billingAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="billingCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="New York" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="billingState"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="NY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="billingZip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip Code</FormLabel>
                      <FormControl>
                        <Input placeholder="10001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="billingCountry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="GB">United Kingdom</SelectItem>
                          <SelectItem value="AU">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </>
        )}
        
        {error && (
          <div className="text-destructive text-sm">{error}</div>
        )}
        
        <div className="flex items-center space-x-3 rounded-md bg-primary/5 p-4">
          <CheckCircle className="h-5 w-5 text-primary" />
          <div className="text-sm space-y-1">
            <p className="font-medium">Secure Checkout</p>
            <p className="text-muted-foreground">Your payment is secure. Your card details are encrypted with SSL.</p>
          </div>
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Processing..." : `Pay $${totalAmount}`}
        </Button>
      </form>
    </Form>
  );
};

export default PaymentForm;

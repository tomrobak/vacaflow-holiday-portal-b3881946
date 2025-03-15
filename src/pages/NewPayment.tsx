
import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, CreditCard, Calendar, DollarSign, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { PaymentMethod } from "@/types/payment";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define form schema with Zod
const paymentFormSchema = z.object({
  bookingId: z.string().min(1, "Booking is required"),
  customerId: z.string().min(1, "Customer is required"),
  propertyId: z.string().min(1, "Property is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  method: z.enum(["credit_card", "paypal", "bank_transfer", "cash"] as const),
  date: z.date(),
  transactionId: z.string().optional(),
  notes: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

// Mock data for select options
const mockBookings = [
  { id: "BOOK-2043", label: "BOOK-2043 - Beachfront Villa", customerId: "CUST-1012", propertyId: "PROP-524", amount: 150.00 },
  { id: "BOOK-2044", label: "BOOK-2044 - Mountain Cabin", customerId: "CUST-1013", propertyId: "PROP-525", amount: 320.50 },
  { id: "BOOK-2045", label: "BOOK-2045 - City Apartment", customerId: "CUST-1014", propertyId: "PROP-526", amount: 210.75 },
];

const mockCustomers = [
  { id: "CUST-1012", name: "Sarah Johnson" },
  { id: "CUST-1013", name: "Michael Brown" },
  { id: "CUST-1014", name: "Emma Davis" },
];

const mockProperties = [
  { id: "PROP-524", name: "Beachfront Villa in Miami" },
  { id: "PROP-525", name: "Mountain Cabin in Aspen" },
  { id: "PROP-526", name: "City Apartment in New York" },
];

const NewPayment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialBookingId = searchParams.get("bookingId") || "";
  
  // Find the matching booking
  const selectedBooking = initialBookingId 
    ? mockBookings.find(booking => booking.id === initialBookingId) 
    : undefined;
  
  // Form setup with default values
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      bookingId: initialBookingId,
      customerId: selectedBooking?.customerId || "",
      propertyId: selectedBooking?.propertyId || "",
      amount: selectedBooking?.amount || 0,
      method: "credit_card" as PaymentMethod,
      date: new Date(),
      transactionId: "",
      notes: "",
    },
  });
  
  // Watch the bookingId to update linked fields
  const watchedBookingId = form.watch("bookingId");
  
  // Update linked fields when booking changes
  const handleBookingChange = (bookingId: string) => {
    const booking = mockBookings.find(b => b.id === bookingId);
    if (booking) {
      form.setValue("customerId", booking.customerId);
      form.setValue("propertyId", booking.propertyId);
      form.setValue("amount", booking.amount);
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };
  
  // Handle form submission
  const onSubmit = (data: PaymentFormValues) => {
    console.log("Payment form submitted:", data);
    
    // In a real app, we would send this data to an API
    // For now, we'll just show a success message and navigate back
    toast.success("Payment recorded successfully!");
    navigate("/payments");
  };
  
  // Selected customer name
  const getSelectedCustomerName = () => {
    const customerId = form.getValues("customerId");
    return mockCustomers.find(c => c.id === customerId)?.name || "";
  };
  
  // Selected property name
  const getSelectedPropertyName = () => {
    const propertyId = form.getValues("propertyId");
    return mockProperties.find(p => p.id === propertyId)?.name || "";
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/payments")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Record Payment</h1>
          <p className="text-muted-foreground">
            Create a new payment record in the system
          </p>
        </div>
      </div>
      
      <Separator />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>Enter the payment information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="bookingId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Related Booking</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleBookingChange(value);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a booking" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockBookings.map((booking) => (
                          <SelectItem key={booking.id} value={booking.id}>
                            {booking.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the booking this payment is for
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={watchedBookingId !== ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a customer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockCustomers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {watchedBookingId && (
                        <FormDescription>
                          Auto-filled from booking: {getSelectedCustomerName()}
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="propertyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={watchedBookingId !== ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a property" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockProperties.map((property) => (
                            <SelectItem key={property.id} value={property.id}>
                              {property.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {watchedBookingId && (
                        <FormDescription>
                          Auto-filled from booking: {getSelectedPropertyName()}
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            className="pl-9" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                      </div>
                      {watchedBookingId && (
                        <FormDescription>
                          Suggested amount from booking: {formatCurrency(form.getValues("amount"))}
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="credit_card">Credit Card</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="cash">Cash</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Payment Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="transactionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transaction ID</FormLabel>
                      <div className="relative">
                        <FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <FormControl>
                          <Input className="pl-9" {...field} />
                        </FormControl>
                      </div>
                      <FormDescription>
                        Optional reference ID from payment processor
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Additional payment details or notes"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional notes about this payment
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate("/payments")}>
                Cancel
              </Button>
              <Button type="submit">
                Record Payment
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default NewPayment;

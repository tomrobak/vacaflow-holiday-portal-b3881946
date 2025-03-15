
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Calendar,
  User,
  Home,
  Users,
  MessageSquare,
  CalendarCheck,
  Send,
  Mail,
  Receipt,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { bookingFormSchema, BookingFormValues } from "@/types/booking";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { notifyGoogleCalendarSynced, notifyGoogleCalendarError } from "@/utils/property-notifications";
import { syncBookingWithGoogleCalendar } from "@/utils/google-calendar";

// Mock data for properties and customers
const mockProperties = [
  { id: "PROP-101", name: "Beachfront Villa", price: 250, googleCalendarId: "prop101@gmail.com" },
  { id: "PROP-102", name: "Mountain Cabin", price: 150, googleCalendarId: "prop102@gmail.com" },
  { id: "PROP-103", name: "Downtown Apartment", price: 120, googleCalendarId: null },
  { id: "PROP-104", name: "Lakeside Cottage", price: 180, googleCalendarId: "prop104@gmail.com" },
  { id: "PROP-105", name: "Countryside Farmhouse", price: 200, googleCalendarId: null },
];

const mockCustomers = [
  { id: "CUST-1001", name: "John Smith", email: "john.smith@example.com" },
  { id: "CUST-1002", name: "Jane Cooper", email: "jane.cooper@example.com" },
  { id: "CUST-1003", name: "Robert Johnson", email: "robert.johnson@example.com" },
  { id: "CUST-1004", name: "Emily Davis", email: "emily.davis@example.com" },
  { id: "CUST-1005", name: "Michael Wilson", email: "michael.wilson@example.com" },
];

const NewBooking = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [totalNights, setTotalNights] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
  
  // Initialize form with defaults
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      propertyId: "",
      customerId: "",
      startDate: undefined,
      endDate: undefined,
      guestCount: 1,
      status: "pending",
      notes: "",
    },
  });
  
  // Watch form values to calculate price
  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");
  const propertyId = form.watch("propertyId");
  const customerId = form.watch("customerId");

  // Update selections and calculate price
  useEffect(() => {
    if (propertyId) {
      const property = mockProperties.find(p => p.id === propertyId);
      setSelectedProperty(property);
    }
    
    if (customerId) {
      const customer = mockCustomers.find(c => c.id === customerId);
      setSelectedCustomer(customer);
    }
    
    if (startDate && endDate) {
      const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      setTotalNights(nights);
      
      if (selectedProperty) {
        setTotalAmount(nights * selectedProperty.price);
      }
    }
  }, [startDate, endDate, propertyId, customerId, selectedProperty]);
  
  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if property has calendar sync enabled
      if (selectedProperty?.googleCalendarId) {
        try {
          const success = await syncBookingWithGoogleCalendar(
            selectedProperty.googleCalendarId,
            {
              summary: `Booking: ${selectedProperty.name}`,
              description: `Guest: ${selectedCustomer?.name || 'Unknown'}\nGuests: ${data.guestCount}\nNotes: ${data.notes || 'None'}`,
              start: {
                dateTime: startDate.toISOString(),
                timeZone: 'UTC',
              },
              end: {
                dateTime: endDate.toISOString(),
                timeZone: 'UTC',
              },
              attendees: selectedCustomer?.email ? [{ email: selectedCustomer.email }] : undefined
            }
          );
          
          if (success) {
            notifyGoogleCalendarSynced({ name: selectedProperty.name });
          }
        } catch (error) {
          notifyGoogleCalendarError({ name: selectedProperty.name }, String(error));
        }
      }
      
      // Success toast
      toast.success("Booking created successfully");
      
      // Navigate back to bookings list
      navigate("/bookings");
    } catch (error) {
      toast.error("Failed to create booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendEmail = () => {
    toast.success("Booking confirmation sent to customer", {
      description: `Email sent to ${selectedCustomer?.email}`
    });
    setShowEmailDialog(false);
  };

  const handleSendInvoice = () => {
    toast.success("Invoice sent to customer", {
      description: `Invoice for $${totalAmount} sent to ${selectedCustomer?.email}`
    });
    setShowInvoiceDialog(false);
  };
  
  return (
    <div className="p-6 space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/bookings")}
        className="pl-0"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Bookings
      </Button>
      
      <div>
        <h1 className="text-3xl font-bold">New Booking</h1>
        <p className="text-muted-foreground">Create a new property booking</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
                <CardDescription>
                  Enter the essential details for this booking
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="propertyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          const property = mockProperties.find(p => p.id === value);
                          setSelectedProperty(property);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a property" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockProperties.map((property) => (
                            <SelectItem key={property.id} value={property.id}>
                              <div className="flex items-center">
                                <Home className="mr-2 h-4 w-4" />
                                {property.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          const customer = mockCustomers.find(c => c.id === value);
                          setSelectedCustomer(customer);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a customer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockCustomers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              <div className="flex items-center">
                                <User className="mr-2 h-4 w-4" />
                                {customer.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Check-in Date</FormLabel>
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
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <Calendar className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Check-out Date</FormLabel>
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
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <Calendar className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => {
                                const startDate = form.getValues("startDate");
                                return (
                                  date < new Date() || 
                                  (startDate && date <= startDate)
                                );
                              }}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="guestCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Guests</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            min={1}
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Booking Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
                <CardDescription>
                  Add any special requests or notes for this booking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes & Special Requests</FormLabel>
                      <FormControl>
                        <div className="flex items-start">
                          <MessageSquare className="mr-2 h-4 w-4 mt-2 text-muted-foreground" />
                          <Textarea
                            placeholder="Enter any special requests or notes from the guest"
                            className="min-h-[150px] resize-none"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="mt-6 p-4 bg-muted rounded-md">
                  <h3 className="text-sm font-medium mb-2">Price Calculation</h3>
                  {selectedProperty ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Nightly Rate:</span>
                        <span>${selectedProperty.price}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Number of Nights:</span>
                        <span>{totalNights || 0}</span>
                      </div>
                      <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                        <span>Total:</span>
                        <span>${totalAmount}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Select a property and dates to calculate the total price.
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-stretch gap-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  <CalendarCheck className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Creating Booking..." : "Create Booking"}
                </Button>
                
                <div className="grid grid-cols-3 gap-2">
                  <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
                    <DialogTrigger asChild>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full"
                        disabled={!selectedCustomer}
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Email Info
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Send Booking Information</DialogTitle>
                        <DialogDescription>
                          Send booking details to {selectedCustomer?.name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <FormLabel>Email</FormLabel>
                          <Input value={selectedCustomer?.email || ''} readOnly />
                        </div>
                        <div className="space-y-2">
                          <FormLabel>Subject</FormLabel>
                          <Input defaultValue="Your Booking Confirmation" />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="includeDetails" defaultChecked />
                          <label
                            htmlFor="includeDetails"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Include booking details
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="includePaymentLink" defaultChecked />
                          <label
                            htmlFor="includePaymentLink"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Include payment link
                          </label>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSendEmail}>
                          <Send className="mr-2 h-4 w-4" />
                          Send Email
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog open={showInvoiceDialog} onOpenChange={setShowInvoiceDialog}>
                    <DialogTrigger asChild>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full"
                        disabled={!selectedCustomer || !totalAmount}
                      >
                        <Receipt className="mr-2 h-4 w-4" />
                        Send Invoice
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Send Invoice</DialogTitle>
                        <DialogDescription>
                          Send an invoice to {selectedCustomer?.name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <FormLabel>Amount</FormLabel>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                            <Input value={totalAmount.toString()} readOnly />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <FormLabel>Due Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal"
                                )}
                              >
                                {startDate ? format(startDate, "PPP") : "Select date"}
                                <Calendar className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={startDate}
                                onSelect={() => {}}
                                initialFocus
                                className={cn("p-3 pointer-events-auto")}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2">
                          <FormLabel>Notes</FormLabel>
                          <Textarea placeholder="Additional invoice notes" />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="sendPaymentLink" defaultChecked />
                          <label
                            htmlFor="sendPaymentLink"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Include payment link
                          </label>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowInvoiceDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSendInvoice}>
                          <Send className="mr-2 h-4 w-4" />
                          Send Invoice
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/bookings")}
                  >
                    Cancel
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </form>
      </Form>
      
      {/* Google Calendar Sync Alert */}
      {selectedProperty && selectedProperty.googleCalendarId && (
        <div className="flex p-4 border border-blue-200 bg-blue-50 rounded-md text-blue-700 mt-4">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium">Google Calendar Sync Enabled</p>
            <p>This booking will be automatically added to Google Calendar.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewBooking;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { BookingFormValues } from "@/types/booking";
import { notifyGoogleCalendarSynced, notifyGoogleCalendarError } from "@/utils/property-notifications";
import { syncBookingWithGoogleCalendar } from "@/utils/google-calendar";
import BookingForm from "@/components/bookings/BookingForm";
import BookingActions from "@/components/bookings/BookingActions";
import GoogleCalendarAlert from "@/components/bookings/GoogleCalendarAlert";

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
  const [totalAmount, setTotalAmount] = useState(0);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);

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
                dateTime: data.startDate.toISOString(),
                timeZone: 'UTC',
              },
              end: {
                dateTime: data.endDate.toISOString(),
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

  const handleFormChange = (property: any, customer: any, amount: number, date: Date | undefined) => {
    setSelectedProperty(property);
    setSelectedCustomer(customer);
    setTotalAmount(amount);
    setStartDate(date);
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BookingForm
          properties={mockProperties}
          customers={mockCustomers}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
        <CardFooter className="flex flex-col items-stretch gap-4">
          <BookingActions
            isSubmitting={isSubmitting}
            selectedCustomer={selectedCustomer}
            selectedProperty={selectedProperty}
            totalAmount={totalAmount}
            startDate={startDate}
            showEmailDialog={showEmailDialog}
            setShowEmailDialog={setShowEmailDialog}
            showInvoiceDialog={showInvoiceDialog}
            setShowInvoiceDialog={setShowInvoiceDialog}
            handleSendEmail={handleSendEmail}
            handleSendInvoice={handleSendInvoice}
            onCancel={() => navigate("/bookings")}
          />
        </CardFooter>
      </div>
      
      {/* Google Calendar Sync Alert */}
      <GoogleCalendarAlert selectedProperty={selectedProperty} />
    </div>
  );
};

export default NewBooking;


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BookingFormValues } from "@/types/booking";
import { notifyGoogleCalendarSynced, notifyGoogleCalendarError } from "@/utils/property-notifications";
import { syncBookingWithGoogleCalendar } from "@/utils/google-calendar";
import BookingForm from "@/components/bookings/BookingForm";
import BookingActions from "@/components/bookings/BookingActions";
import GoogleCalendarAlert from "@/components/bookings/GoogleCalendarAlert";
import BookingPriceSummary from "@/components/bookings/BookingPriceSummary";

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
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [guestCount, setGuestCount] = useState(1);
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
      navigate("/admin/bookings");
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
      description: `Invoice for $${totalAmount.toFixed(2)} sent to ${selectedCustomer?.email}`
    });
    setShowInvoiceDialog(false);
  };

  const handleFormChange = (property: any, customer: any, amount: number, date: Date | undefined, end: Date | undefined, guests: number) => {
    setSelectedProperty(property);
    setSelectedCustomer(customer);
    setTotalAmount(amount);
    setStartDate(date);
    setEndDate(end);
    setGuestCount(guests);
  };
  
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin/bookings")}
          className="pl-0"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Bookings
        </Button>
        
        <span className="flex items-center text-muted-foreground text-sm">
          <CalendarRange className="mr-2 h-4 w-4" />
          New Reservation
        </span>
      </div>
      
      <div>
        <h1 className="text-3xl font-bold">Create New Booking</h1>
        <p className="text-muted-foreground">Fill out the details to create a new property booking</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BookingForm
            properties={mockProperties}
            customers={mockCustomers}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            onFormChange={handleFormChange}
          />
          
          {/* Google Calendar Sync Alert */}
          {selectedProperty && (
            <div className="mt-6">
              <GoogleCalendarAlert selectedProperty={selectedProperty} />
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <BookingPriceSummary 
            selectedProperty={selectedProperty}
            startDate={startDate}
            endDate={endDate}
            guestCount={guestCount}
          />
          
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
            onCancel={() => navigate("/admin/bookings")}
          />
        </div>
      </div>
    </div>
  );
};

export default NewBooking;

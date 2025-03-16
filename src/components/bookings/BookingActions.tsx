
import { CalendarCheck, Mail, Receipt, Send, DollarSign, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Customer, Property } from "@/types/bookingForm";

interface BookingActionsProps {
  isSubmitting: boolean;
  selectedCustomer: Customer | null;
  selectedProperty: Property | null;
  totalAmount: number;
  startDate: Date | undefined;
  showEmailDialog: boolean;
  setShowEmailDialog: (show: boolean) => void;
  showInvoiceDialog: boolean;
  setShowInvoiceDialog: (show: boolean) => void;
  handleSendEmail: () => void;
  handleSendInvoice: () => void;
  onCancel: () => void;
}

const BookingActions = ({
  isSubmitting,
  selectedCustomer,
  selectedProperty,
  totalAmount,
  startDate,
  showEmailDialog,
  setShowEmailDialog,
  showInvoiceDialog,
  setShowInvoiceDialog,
  handleSendEmail,
  handleSendInvoice,
  onCancel,
}: BookingActionsProps) => {
  return (
    <div className="space-y-4">
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
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default BookingActions;


import { useState } from "react";
import { format, addDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { BookingStatus } from "@/types/booking";

interface BookingForm {
  startDate: Date;
  endDate: Date;
  guestName: string;
  guestEmail: string;
  guestCount: number;
  status: BookingStatus;
}

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyName: string;
}

const BookingDialog = ({ open, onOpenChange, propertyName }: BookingDialogProps) => {
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    startDate: new Date(),
    endDate: addDays(new Date(), 3),
    guestName: "",
    guestEmail: "",
    guestCount: 2,
    status: "confirmed",
  });

  const handleNewBooking = () => {
    console.log("New booking:", bookingForm);
    
    toast.success("Booking created successfully", {
      description: `Booking for ${bookingForm.guestName} from ${format(bookingForm.startDate, 'PP')} to ${format(bookingForm.endDate, 'PP')}`,
    });
    
    onOpenChange(false);
    setBookingForm({
      startDate: new Date(),
      endDate: addDays(new Date(), 3),
      guestName: "",
      guestEmail: "",
      guestCount: 2,
      status: "confirmed",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Booking</DialogTitle>
          <DialogDescription>
            Create a new booking for {propertyName}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Check-in</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(bookingForm.startDate, "PP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={bookingForm.startDate}
                    onSelect={(date) => date && setBookingForm(prev => ({ 
                      ...prev, 
                      startDate: date 
                    }))}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Check-out</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(bookingForm.endDate, "PP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={bookingForm.endDate}
                    onSelect={(date) => date && setBookingForm(prev => ({
                      ...prev,
                      endDate: date
                    }))}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                    disabled={(date) => date < bookingForm.startDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="guestName">Guest Name</Label>
            <Input
              id="guestName"
              value={bookingForm.guestName}
              onChange={(e) => setBookingForm(prev => ({ ...prev, guestName: e.target.value }))}
              placeholder="John Smith"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guestEmail">Guest Email</Label>
            <Input
              id="guestEmail"
              type="email"
              value={bookingForm.guestEmail}
              onChange={(e) => setBookingForm(prev => ({ ...prev, guestEmail: e.target.value }))}
              placeholder="john@example.com"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guestCount">Number of Guests</Label>
              <Input
                id="guestCount"
                type="number"
                min={1}
                value={bookingForm.guestCount}
                onChange={(e) => setBookingForm(prev => ({ ...prev, guestCount: parseInt(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={bookingForm.status}
                onValueChange={(value: BookingStatus) => setBookingForm(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleNewBooking} disabled={!bookingForm.guestName || !bookingForm.guestEmail}>
            Create Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;

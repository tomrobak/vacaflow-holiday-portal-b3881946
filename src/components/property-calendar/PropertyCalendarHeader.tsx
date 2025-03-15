
import { Link } from "react-router-dom";
import { ChevronLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookingStatus } from "@/types/booking";

interface PropertyCalendarHeaderProps {
  propertyName: string;
  propertyLocation: string;
  statusFilter: BookingStatus | "all";
  setStatusFilter: (status: BookingStatus | "all") => void;
  setShowNewBookingDialog: (show: boolean) => void;
}

const PropertyCalendarHeader = ({
  propertyName,
  propertyLocation,
  statusFilter,
  setStatusFilter,
  setShowNewBookingDialog,
}: PropertyCalendarHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <div className="flex items-center mb-2">
          <Link
            to="/properties"
            className="text-sm text-muted-foreground flex items-center mr-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Properties
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">
            {propertyName} Calendar
          </h1>
        </div>
        <p className="text-muted-foreground">
          Manage bookings and availability for {propertyName}
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <Select
          value={statusFilter}
          onValueChange={(value: string) => setStatusFilter(value as BookingStatus | "all")}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Bookings</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="canceled">Canceled</SelectItem>
          </SelectContent>
        </Select>
        
        <Button onClick={() => setShowNewBookingDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Booking
        </Button>
      </div>
    </div>
  );
};

export default PropertyCalendarHeader;

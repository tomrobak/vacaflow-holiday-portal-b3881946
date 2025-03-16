
import { AlertCircle } from "lucide-react";
import { Property } from "@/types/bookingForm";

interface GoogleCalendarAlertProps {
  selectedProperty: Property | null;
}

const GoogleCalendarAlert = ({ selectedProperty }: GoogleCalendarAlertProps) => {
  if (!selectedProperty || !selectedProperty.googleCalendarId) {
    return null;
  }
  
  return (
    <div className="flex p-4 border border-blue-200 bg-blue-50 rounded-md text-blue-700 mt-4">
      <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
      <div className="text-sm">
        <p className="font-medium">Google Calendar Sync Enabled</p>
        <p>This booking will be automatically added to Google Calendar.</p>
      </div>
    </div>
  );
};

export default GoogleCalendarAlert;

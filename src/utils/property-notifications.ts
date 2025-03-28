
import { toast } from "sonner";
import { Property } from "@/types/property";

/**
 * Display a toast notification for property creation
 */
export function notifyPropertyCreated(property: Partial<Property>) {
  toast.success("Property Created", {
    description: `${property.name} has been successfully added to your properties.`,
  });
}

/**
 * Display a toast notification for property updates
 */
export function notifyPropertyUpdated(property: Partial<Property>) {
  toast.success("Property Updated", {
    description: `${property.name} has been successfully updated.`,
  });
}

/**
 * Display a toast notification for property status changes
 */
export function notifyPropertyStatusChange(property: Partial<Property>, status: string) {
  const statusMessages = {
    active: "activated",
    inactive: "deactivated",
    maintenance: "set to maintenance mode",
    booked: "marked as booked",
  };
  
  const action = statusMessages[status as keyof typeof statusMessages] || "updated";
  
  toast.info("Property Status Changed", {
    description: `${property.name} has been ${action}.`,
  });
}

/**
 * Display a toast notification for property deletion
 */
export function notifyPropertyDeleted(propertyName: string) {
  toast.success("Property Deleted", {
    description: `${propertyName} has been permanently removed from your properties.`,
  });
}

/**
 * Display a toast notification for property import/export actions
 */
export function notifyPropertyBulkAction(count: number, action: string) {
  toast.success(`${action} Complete`, {
    description: `${count} properties have been ${action.toLowerCase()} successfully.`,
  });
}

/**
 * Display a toast notification for Google Calendar connection
 */
export function notifyGoogleCalendarConnected(property: Partial<Property>) {
  toast.success("Google Calendar Connected", {
    description: `${property.name} is now synced with Google Calendar.`,
  });
}

/**
 * Display a toast notification for Google Calendar sync
 */
export function notifyGoogleCalendarSynced(property: Partial<Property>) {
  toast.success("Calendar Synced", {
    description: `${property.name}'s calendar has been successfully synced with Google Calendar.`,
  });
}

/**
 * Display a toast notification for Google Calendar sync error
 */
export function notifyGoogleCalendarError(property: Partial<Property>, error: string) {
  toast.error("Calendar Sync Error", {
    description: `Failed to sync ${property.name} with Google Calendar: ${error}`,
  });
}


import { toast } from "sonner";
import { Booking } from "@/types/booking";

/**
 * Display a toast notification for booking creation
 */
export function notifyBookingCreated(booking: Partial<Booking>) {
  toast.success("Booking Created", {
    description: `Booking for ${booking.customerName} has been successfully created.`,
  });
}

/**
 * Display a toast notification for booking updates
 */
export function notifyBookingUpdated(booking: Partial<Booking>) {
  toast.success("Booking Updated", {
    description: `Booking for ${booking.customerName} has been successfully updated.`,
  });
}

/**
 * Display a toast notification for booking status changes
 */
export function notifyBookingStatusChange(booking: Partial<Booking>, status: string) {
  const statusMessages = {
    confirmed: "confirmed",
    pending: "marked as pending",
    cancelled: "cancelled",
    completed: "marked as completed",
  };
  
  const action = statusMessages[status as keyof typeof statusMessages] || "updated";
  
  toast.info("Booking Status Changed", {
    description: `Booking for ${booking.customerName} has been ${action}.`,
  });
}

/**
 * Display a toast notification for booking deletion
 */
export function notifyBookingDeleted(customerName: string) {
  toast.success("Booking Deleted", {
    description: `Booking for ${customerName} has been permanently removed.`,
  });
}

/**
 * Display a toast notification for booking email sent
 */
export function notifyBookingEmailSent(customerName: string, email: string) {
  toast.success("Email Sent", {
    description: `Booking information has been sent to ${customerName} at ${email}.`,
  });
}

/**
 * Display a toast notification for booking invoice sent
 */
export function notifyBookingInvoiceSent(customerName: string, amount: number) {
  toast.success("Invoice Sent", {
    description: `Invoice for $${amount} has been sent to ${customerName}.`,
  });
}

/**
 * Display a toast notification for payment reminder sent
 */
export function notifyPaymentReminderSent(customerName: string) {
  toast.success("Payment Reminder Sent", {
    description: `Payment reminder has been sent to ${customerName}.`,
  });
}

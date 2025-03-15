
import { toast } from "sonner";
import { Payment, PaymentStatus } from "@/types/payment";

/**
 * Display a toast notification for payment status changes
 */
export function notifyPaymentStatus(payment: Payment | Partial<Payment>, status: PaymentStatus) {
  const amount = payment.amount ? formatCurrency(payment.amount) : "";
  
  switch (status) {
    case "successful":
      toast.success("Payment Successful", {
        description: `Payment of ${amount} has been successfully processed.`,
      });
      break;
    case "pending":
      toast.info("Payment Pending", {
        description: `Payment of ${amount} is awaiting processing.`,
      });
      break;
    case "failed":
      toast.error("Payment Failed", {
        description: `Payment of ${amount} could not be processed.`,
      });
      break;
    case "refunded":
      toast.info("Payment Refunded", {
        description: `Payment of ${amount} has been refunded.`,
      });
      break;
  }
}

/**
 * Display a toast notification for a new payment record
 */
export function notifyPaymentRecorded(payment: Payment | Partial<Payment>) {
  const amount = payment.amount ? formatCurrency(payment.amount) : "";
  
  toast.success("Payment Recorded", {
    description: `Payment of ${amount} has been recorded in the system.`,
  });
}

/**
 * Display a toast notification for payment updates
 */
export function notifyPaymentUpdated(payment: Payment | Partial<Payment>) {
  const amount = payment.amount ? formatCurrency(payment.amount) : "";
  
  toast.success("Payment Updated", {
    description: `Payment details for ${amount} have been updated.`,
  });
}

/**
 * Display a toast notification for payment exports
 */
export function notifyPaymentExported(count: number) {
  toast.success("Export Complete", {
    description: `${count} payment records have been exported successfully.`,
  });
}

/**
 * Format currency for display
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

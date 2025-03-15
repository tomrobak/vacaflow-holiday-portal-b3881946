
import { toast } from "sonner";

/**
 * Display a toast notification for viewing customer dashboard
 */
export function notifyCustomerDashboardViewed(customerName: string) {
  toast.info("Customer Dashboard", {
    description: `Viewing dashboard for ${customerName}.`,
  });
}

/**
 * Display a toast notification for customer data export
 */
export function notifyCustomerDataExported(customerName: string) {
  toast.success("Data Exported", {
    description: `Data for ${customerName} has been successfully exported.`,
  });
}

/**
 * Display a toast notification for sending report to customer
 */
export function notifyReportSentToCustomer(customerName: string, email: string) {
  toast.success("Report Sent", {
    description: `Report has been sent to ${customerName} at ${email}.`,
  });
}

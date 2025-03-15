
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FileText, Mail, Phone, MessageSquare, Calendar, Pencil, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { notifyCustomerDataExported, notifyReportSentToCustomer } from "@/utils/customer-notifications";

interface CustomerDashboardActionsProps {
  customerId: string;
  customerName: string;
  customerEmail: string;
}

const CustomerDashboardActions = ({ customerId, customerName, customerEmail }: CustomerDashboardActionsProps) => {
  const navigate = useNavigate();
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isSendReportDialogOpen, setIsSendReportDialogOpen] = useState(false);
  
  // Handle export data
  const handleExportData = () => {
    console.log(`Exporting data for customer: ${customerId}`);
    notifyCustomerDataExported(customerName);
    setIsExportDialogOpen(false);
  };
  
  // Handle send report
  const handleSendReport = () => {
    console.log(`Sending report to customer: ${customerId}`);
    notifyReportSentToCustomer(customerName, customerEmail);
    setIsSendReportDialogOpen(false);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button variant="outline" size="sm" className="flex items-center" asChild>
        <Link to={`/customers/${customerId}`}>
          <Pencil className="mr-2 h-4 w-4" />
          View Details
        </Link>
      </Button>
      
      <Button variant="outline" size="sm" className="flex items-center" asChild>
        <Link to={`/bookings/new?customerId=${customerId}`}>
          <Calendar className="mr-2 h-4 w-4" />
          New Booking
        </Link>
      </Button>
      
      <Button variant="outline" size="sm" className="flex items-center" asChild>
        <Link to={`/messages/new?customerId=${customerId}`}>
          <MessageSquare className="mr-2 h-4 w-4" />
          Send Message
        </Link>
      </Button>
      
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Customer Data</DialogTitle>
            <DialogDescription>
              Choose which data you want to export for {customerName}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="exportBookings"
                className="rounded border-gray-300"
                defaultChecked
              />
              <label htmlFor="exportBookings">Bookings</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="exportPayments"
                className="rounded border-gray-300"
                defaultChecked
              />
              <label htmlFor="exportPayments">Payments</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="exportInvoices"
                className="rounded border-gray-300"
                defaultChecked
              />
              <label htmlFor="exportInvoices">Invoices</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="exportMessages"
                className="rounded border-gray-300"
                defaultChecked
              />
              <label htmlFor="exportMessages">Messages</label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExportData}>
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isSendReportDialogOpen} onOpenChange={setIsSendReportDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="default" size="sm" className="flex items-center">
            <Share2 className="mr-2 h-4 w-4" />
            Send Report
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Customer Report</DialogTitle>
            <DialogDescription>
              Send a booking and payment report to {customerName}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="emailTo" className="text-right">
                To:
              </label>
              <input
                id="emailTo"
                value={customerEmail}
                className="col-span-3 rounded-md border p-2"
                readOnly
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="reportType" className="text-right">
                Report:
              </label>
              <select
                id="reportType"
                className="col-span-3 rounded-md border p-2"
                defaultValue="booking-summary"
              >
                <option value="booking-summary">Booking Summary</option>
                <option value="payment-history">Payment History</option>
                <option value="full-account">Full Account Statement</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="reportMessage" className="text-right">
                Message:
              </label>
              <textarea
                id="reportMessage"
                className="col-span-3 rounded-md border p-2"
                rows={3}
                placeholder="Add a personal message..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSendReportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendReport}>
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerDashboardActions;

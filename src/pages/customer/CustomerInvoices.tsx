
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileText, Download, CreditCard, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const CustomerInvoices = () => {
  const [activeTab, setActiveTab] = useState("all");

  // Mock data that would come from an API in a real application
  const invoices = [
    { 
      id: "INV-2001", 
      bookingId: "BK-1001",
      property: "Beachside Villa",
      amount: 1250.00, 
      date: "2023-07-15", 
      dueDate: "2023-07-30",
      status: "paid",
      paymentId: "PAY-2001"
    },
    { 
      id: "INV-2002", 
      bookingId: "BK-1002",
      property: "Mountain Cabin",
      amount: 450.00, 
      date: "2023-08-01", 
      dueDate: "2023-08-15",
      status: "unpaid",
      paymentId: null
    },
    { 
      id: "INV-1999", 
      bookingId: "BK-0999",
      property: "Lakeside Cottage",
      amount: 950.00, 
      date: "2023-06-01", 
      dueDate: "2023-06-15",
      status: "paid",
      paymentId: "PAY-1999"
    },
  ];

  const filteredInvoices = activeTab === "all" 
    ? invoices 
    : invoices.filter(invoice => invoice.status === activeTab);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "unpaid":
        return "bg-amber-100 text-amber-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast.success(`Invoice ${invoiceId} download started`);
    // In a real app, this would trigger an actual download of the invoice PDF
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">My Invoices</h1>
      
      <Tabs defaultValue="all" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unpaid">Unpaid</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          {filteredInvoices.length > 0 ? (
            <div className="space-y-4">
              {filteredInvoices.map((invoice) => (
                <Card key={invoice.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">Invoice #{invoice.id}</CardTitle>
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{invoice.property}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-lg font-bold">${invoice.amount.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">
                          Issued: {new Date(invoice.date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Due: {new Date(invoice.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadInvoice(invoice.id)}
                          className="flex items-center"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/customer/bookings/${invoice.bookingId}`}>
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Booking
                          </Link>
                        </Button>
                        
                        {invoice.status === "unpaid" && (
                          <Button variant="default" size="sm" asChild>
                            <Link to={`/customer/checkout/${invoice.id}`}>
                              <CreditCard className="h-4 w-4 mr-1" />
                              Pay Now
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No invoices found in this category.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerInvoices;

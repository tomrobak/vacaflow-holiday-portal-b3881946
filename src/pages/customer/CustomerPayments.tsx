
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
import { Link } from "react-router-dom";
import { Download, CreditCard } from "lucide-react";

const CustomerPayments = () => {
  const [activeTab, setActiveTab] = useState("paid");

  // Mock data that would come from an API in a real application
  const paidPayments = [
    { 
      id: "PAY-2001", 
      amount: 1250.00, 
      date: "2023-07-15", 
      status: "completed",
      method: "Credit Card",
      description: "Payment for Beachside Villa (Aug 12-19)" 
    },
    { 
      id: "PAY-1999", 
      amount: 950.00, 
      date: "2023-06-01", 
      status: "completed",
      method: "Bank Transfer",
      description: "Payment for Lakeside Cottage (Jun 10-15)" 
    },
    { 
      id: "PAY-1995", 
      amount: 450.00, 
      date: "2023-04-28", 
      status: "completed",
      method: "Credit Card",
      description: "Payment for Downtown Apartment (May 5-8)" 
    },
  ];

  const pendingPayments = [
    { 
      id: "PAY-2002", 
      amount: 450.00, 
      date: "2023-08-01", 
      status: "pending",
      method: "Pending",
      description: "Deposit for Mountain Cabin (Sep 20-25)" 
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderPaymentsList = (payments: any[]) => {
    return payments.length > 0 ? (
      <div className="space-y-4">
        {payments.map((payment) => (
          <Card key={payment.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-lg">${payment.amount.toFixed(2)}</CardTitle>
                <Badge className={getStatusColor(payment.status)}>
                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{payment.description}</p>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">
                    {payment.status === "pending" 
                      ? "Due date: " 
                      : "Payment date: "}{new Date(payment.date).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Method: {payment.method}
                  </div>
                </div>
                <div className="flex gap-2">
                  {payment.status === "completed" ? (
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Receipt
                    </Button>
                  ) : (
                    <Button variant="default" size="sm" asChild>
                      <Link to={`/customer/payments/make/${payment.id}`}>
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
        No payments found in this category.
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">My Payments</h1>
      
      <Tabs defaultValue="paid" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
        </TabsList>
        
        <TabsContent value="paid" className="space-y-4">
          {renderPaymentsList(paidPayments)}
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
          {renderPaymentsList(pendingPayments)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerPayments;

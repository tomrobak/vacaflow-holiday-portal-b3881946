
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Calendar, CreditCard, MessageSquare } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomerDetailHeader from "@/components/customer/CustomerDetailHeader";
import CustomerInfoCard from "@/components/customer/CustomerInfoCard";
import CustomerOverviewCard from "@/components/customer/CustomerOverviewCard";
import CustomerBookingsTab from "@/components/customer/CustomerBookingsTab";
import CustomerPaymentsTab from "@/components/customer/CustomerPaymentsTab";
import SmsHistory from "@/components/sms/SmsHistory";
import QuickSmsForm from "@/components/sms/QuickSmsForm";
import { Customer, mockCustomer, mockSmsMessages } from "@/types/customerDetail";
import { SmsMessage } from "@/types/sms";

const CustomerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [customer] = useState<Customer>(mockCustomer);
  const [smsMessages, setSmsMessages] = useState<SmsMessage[]>(mockSmsMessages);
  const [isQuickSmsOpen, setIsQuickSmsOpen] = useState(false);

  const handleSendSms = (message: string) => {
    const newMessage: SmsMessage = {
      id: `sms-${Date.now()}`,
      customerId: customer.id,
      content: message,
      sentAt: new Date(),
      status: "sent",
      twilioMessageId: `SM${Math.floor(Math.random() * 1000000000)}`,
    };
    
    setSmsMessages([newMessage, ...smsMessages]);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <CustomerDetailHeader 
        customer={customer} 
        onSendSms={() => setIsQuickSmsOpen(true)}
      />
      
      <Separator />
      
      <div className="grid gap-6 md:grid-cols-3">
        <CustomerInfoCard customer={customer} />
        <CustomerOverviewCard customer={customer} />
      </div>
      
      <Tabs defaultValue="bookings" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="bookings" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Bookings
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center">
            <CreditCard className="mr-2 h-4 w-4" />
            Payment History
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            SMS History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="bookings" className="mt-6">
          <CustomerBookingsTab bookings={customer.bookings} />
        </TabsContent>
        
        <TabsContent value="payments" className="mt-6">
          <CustomerPaymentsTab payments={customer.payments} />
        </TabsContent>
        
        <TabsContent value="messages" className="mt-6">
          <SmsHistory 
            messages={smsMessages} 
            customerId={customer.id} 
            onSendNew={() => setIsQuickSmsOpen(true)}
          />
        </TabsContent>
      </Tabs>
      
      <QuickSmsForm
        open={isQuickSmsOpen}
        onOpenChange={setIsQuickSmsOpen}
        customerName={customer.name}
        customerPhone={customer.phone}
        customerId={customer.id}
        onSend={handleSendSms}
      />
    </div>
  );
};

export default CustomerDetail;

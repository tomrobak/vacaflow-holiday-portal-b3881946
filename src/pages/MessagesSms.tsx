
import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SmsFilter } from "@/types/sms";
import SmsFilters from "@/components/sms/SmsFilters";
import SmsRecipientSelector from "@/components/sms/SmsRecipientSelector";
import SmsComposer from "@/components/sms/SmsComposer";
import { mockCustomers, mockProperties, mockTemplates, predefinedFilters } from "@/data/mockSmsData";

const MessagesSms = () => {
  const [messageText, setMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<SmsFilter>({ type: 'all', label: 'All Customers' });
  const [selectedPropertyFilter, setSelectedPropertyFilter] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState("customers");
  const [isSending, setIsSending] = useState(false);

  // Get all unique tags from customers
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    mockCustomers.forEach(customer => {
      customer.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [mockCustomers]);

  // Filter customers based on search and active filter
  const filteredCustomers = useMemo(() => {
    return mockCustomers.filter(customer => {
      // Apply search filter
      if (searchTerm && !customer.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !customer.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !customer.phone.includes(searchTerm)) {
        return false;
      }

      // Apply active filter
      switch (activeFilter.type) {
        case 'upcoming-bookings':
          return customer.upcomingBooking;
        case 'pending-payment':
          return customer.pendingPayment;
        case 'past-bookings':
          return customer.pastBookings;
        case 'property':
          return customer.properties.includes(selectedPropertyFilter);
        case 'tag':
          return customer.tags.includes(activeFilter.value || '');
        case 'all':
        default:
          return true;
      }
    });
  }, [searchTerm, activeFilter, selectedPropertyFilter, mockCustomers]);

  const handleSelectAllCustomers = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filteredCustomers.map(customer => customer.id));
    }
  };

  const toggleCustomerSelection = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId)
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleSendSms = () => {
    if (!messageText.trim()) {
      toast.error("Please enter a message to send");
      return;
    }

    if (selectedCustomers.length === 0) {
      toast.error("Please select at least one recipient");
      return;
    }

    setIsSending(true);

    // Simulate sending process
    setTimeout(() => {
      toast.success(`SMS sent to ${selectedCustomers.length} recipient(s)`);
      setIsSending(false);
      setMessageText("");
      setSelectedCustomers([]);
      setSelectedTab("customers");
    }, 2000);
  };

  const handleSetActiveFilter = (filter: SmsFilter) => {
    setActiveFilter(filter);
    setSelectedCustomers([]);
  };

  const handlePropertyFilterChange = (propertyId: string) => {
    setSelectedPropertyFilter(propertyId);
    setActiveFilter({ type: 'property', value: propertyId, label: 'Property' });
    setSelectedCustomers([]);
  };

  const handleTagFilterChange = (tag: string) => {
    setActiveFilter({ type: 'tag', value: tag, label: `Tag: ${tag}` });
    setSelectedCustomers([]);
  };

  const selectedCustomersData = useMemo(() => {
    return mockCustomers.filter(customer => selectedCustomers.includes(customer.id));
  }, [selectedCustomers]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">SMS Messages</h1>
          <p className="text-muted-foreground">Send SMS messages to your customers</p>
        </div>
        
        <Button variant="outline" asChild>
          <a href="/settings/sms">
            Configure SMS Settings
          </a>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Filters and customer selection */}
        <div className="lg:col-span-1 space-y-6">
          <SmsFilters
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            predefinedFilters={predefinedFilters}
            mockProperties={mockProperties}
            selectedPropertyFilter={selectedPropertyFilter}
            setSelectedPropertyFilter={setSelectedPropertyFilter}
            allTags={allTags}
            handlePropertyFilterChange={handlePropertyFilterChange}
            handleTagFilterChange={handleTagFilterChange}
            handleSetActiveFilter={handleSetActiveFilter}
          />
        </div>

        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="customers" className="flex-1">
                <Users className="mr-2 h-4 w-4" />
                Recipients
              </TabsTrigger>
              <TabsTrigger value="compose" className="flex-1">
                <MessageSquare className="mr-2 h-4 w-4" />
                Compose
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="customers" className="m-0">
              <SmsRecipientSelector
                filteredCustomers={filteredCustomers}
                selectedCustomers={selectedCustomers}
                activeFilter={activeFilter}
                handleSelectAllCustomers={handleSelectAllCustomers}
                toggleCustomerSelection={toggleCustomerSelection}
                onContinue={() => setSelectedTab("compose")}
              />
            </TabsContent>
            
            <TabsContent value="compose" className="m-0">
              <SmsComposer
                selectedCustomers={selectedCustomers}
                selectedCustomersData={selectedCustomersData}
                messageText={messageText}
                setMessageText={setMessageText}
                handleSendSms={handleSendSms}
                isSending={isSending}
                mockTemplates={mockTemplates}
                onBackToCustomers={() => setSelectedTab("customers")}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MessagesSms;

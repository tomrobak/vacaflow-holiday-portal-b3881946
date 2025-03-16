
import { useState, useMemo } from "react";
import { 
  Check, 
  Filter, 
  Home, 
  MessageSquare, 
  Plus, 
  Search, 
  SendHorizonal, 
  User, 
  Users, 
  Calendar, 
  CreditCard,
  Clock,
  Tag
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SmsFilter } from "@/types/sms";
import { Separator } from "@/components/ui/separator";

// Mock data
const mockCustomers = Array.from({ length: 50 }, (_, i) => ({
  id: `CUST-${1000 + i}`,
  name: [
    "John Smith", "Emma Johnson", "Michael Brown", "Olivia Davis", "William Wilson",
    "Sophia Martinez", "James Anderson", "Ava Taylor", "Benjamin Thomas", "Mia Hernandez"
  ][i % 10],
  email: `customer${i + 1}@example.com`,
  phone: `+1${Math.floor(Math.random() * 1000000000).toString().padStart(10, '0')}`,
  status: ["active", "inactive", "pending"][Math.floor(Math.random() * 3)],
  upcomingBooking: Math.random() > 0.6,
  pendingPayment: Math.random() > 0.7,
  pastBookings: Math.random() > 0.4,
  properties: Math.random() > 0.5 
    ? [`PROP-${500 + Math.floor(Math.random() * 10)}`] 
    : [],
  tags: ["VIP", "Frequent", "New", "Potential", "Returning"]
    .filter(() => Math.random() > 0.7)
}));

const mockProperties = Array.from({ length: 10 }, (_, i) => ({
  id: `PROP-${500 + i}`,
  name: [
    "Beach Villa", "Mountain Cabin", "Downtown Apartment", "Lakeside Retreat", 
    "Country Cottage", "Luxury Penthouse", "Seaside Bungalow", "Forest Lodge",
    "Desert Oasis", "City Loft"
  ][i % 10]
}));

const mockTemplates = [
  { id: "1", name: "Welcome Message", content: "Welcome to our property! We're excited to host you." },
  { id: "2", name: "Payment Reminder", content: "This is a friendly reminder that your payment is due soon." },
  { id: "3", name: "Booking Confirmation", content: "Your booking has been confirmed. We look forward to hosting you!" },
  { id: "4", name: "Check-in Instructions", content: "Here are the check-in instructions for your upcoming stay..." },
  { id: "5", name: "Check-out Reminder", content: "Just a reminder that check-out time is at 11:00 AM tomorrow." },
];

const predefinedFilters: SmsFilter[] = [
  { type: 'all', label: 'All Customers' },
  { type: 'upcoming-bookings', label: 'Upcoming Bookings' },
  { type: 'pending-payment', label: 'Pending Payment' },
  { type: 'past-bookings', label: 'Past Bookings' },
];

const MessagesSms = () => {
  const [messageText, setMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<SmsFilter>({ type: 'all', label: 'All Customers' });
  const [selectedPropertyFilter, setSelectedPropertyFilter] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState("customers");
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

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
    }, 2000);
  };

  const handleApplyTemplate = () => {
    if (selectedTemplate) {
      const template = mockTemplates.find(t => t.id === selectedTemplate);
      if (template) {
        setMessageText(template.content);
        setShowTemplateDialog(false);
        setSelectedTemplate(null);
      }
    }
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

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    mockCustomers.forEach(customer => {
      customer.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [mockCustomers]);

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
          <Card>
            <CardHeader>
              <CardTitle>Message Filters</CardTitle>
              <CardDescription>Select recipients based on filters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search customers..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Accordion type="single" collapsible defaultValue="predefined">
                <AccordionItem value="predefined">
                  <AccordionTrigger>Predefined Filters</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {predefinedFilters.map((filter) => (
                        <Button
                          key={filter.type}
                          variant={activeFilter.type === filter.type ? "default" : "outline"}
                          className="w-full justify-start text-left"
                          onClick={() => handleSetActiveFilter(filter)}
                        >
                          {filter.type === 'all' && <Users className="mr-2 h-4 w-4" />}
                          {filter.type === 'upcoming-bookings' && <Calendar className="mr-2 h-4 w-4" />}
                          {filter.type === 'pending-payment' && <CreditCard className="mr-2 h-4 w-4" />}
                          {filter.type === 'past-bookings' && <Clock className="mr-2 h-4 w-4" />}
                          {filter.label}
                        </Button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="properties">
                  <AccordionTrigger>Filter by Property</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {mockProperties.map((property) => (
                        <Button
                          key={property.id}
                          variant={activeFilter.type === 'property' && selectedPropertyFilter === property.id ? "default" : "outline"}
                          className="w-full justify-start text-left"
                          onClick={() => handlePropertyFilterChange(property.id)}
                        >
                          <Home className="mr-2 h-4 w-4" />
                          {property.name}
                        </Button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="tags">
                  <AccordionTrigger>Filter by Tag</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {allTags.map((tag) => (
                        <Button
                          key={tag}
                          variant={activeFilter.type === 'tag' && activeFilter.value === tag ? "default" : "outline"}
                          className="w-full justify-start text-left"
                          onClick={() => handleTagFilterChange(tag)}
                        >
                          <Tag className="mr-2 h-4 w-4" />
                          {tag}
                        </Button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleSetActiveFilter({ type: 'all', label: 'All Customers' })}
              >
                <Filter className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            </CardFooter>
          </Card>
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
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>Select Recipients</CardTitle>
                    <Badge variant="outline">
                      {filteredCustomers.length} customers found
                    </Badge>
                  </div>
                  <CardDescription>
                    Current filter: {activeFilter.label}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="border-b px-4 py-2 flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 mr-2"
                      checked={selectedCustomers.length > 0 && selectedCustomers.length === filteredCustomers.length}
                      onChange={handleSelectAllCustomers}
                    />
                    <span className="font-medium">Select All</span>
                    <span className="text-muted-foreground ml-2">
                      ({selectedCustomers.length} selected)
                    </span>
                  </div>
                  
                  <ScrollArea className="h-[400px]">
                    {filteredCustomers.length > 0 ? (
                      <div className="divide-y">
                        {filteredCustomers.map((customer) => (
                          <div 
                            key={customer.id}
                            className="flex items-center px-4 py-3 hover:bg-muted/50"
                          >
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 mr-3"
                              checked={selectedCustomers.includes(customer.id)}
                              onChange={() => toggleCustomerSelection(customer.id)}
                            />
                            <div className="flex flex-col">
                              <div className="font-medium">{customer.name}</div>
                              <div className="text-sm text-muted-foreground">{customer.phone}</div>
                              <div className="flex gap-1 mt-1">
                                {customer.upcomingBooking && (
                                  <Badge variant="outline" className="text-xs">
                                    <Calendar className="mr-1 h-3 w-3" />
                                    Upcoming
                                  </Badge>
                                )}
                                {customer.pendingPayment && (
                                  <Badge variant="outline" className="text-xs">
                                    <CreditCard className="mr-1 h-3 w-3" />
                                    Payment Due
                                  </Badge>
                                )}
                                {customer.tags.map(tag => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full py-12">
                        <Users className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No customers found</h3>
                        <p className="text-sm text-muted-foreground max-w-xs text-center mt-1">
                          Try adjusting your filters or search criteria
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
                <CardFooter className="border-t">
                  <Button 
                    variant="default" 
                    className="w-full"
                    disabled={selectedCustomers.length === 0}
                    onClick={() => setSelectedTab("compose")}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    {selectedCustomers.length > 0 
                      ? `Continue with ${selectedCustomers.length} recipient(s)` 
                      : "Select recipients to continue"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="compose" className="m-0">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Compose Message</CardTitle>
                  <CardDescription>
                    Create your SMS message
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedCustomers.length > 0 ? (
                    <>
                      <div className="bg-muted p-3 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Recipients ({selectedCustomers.length})</h4>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setSelectedTab("customers")}
                          >
                            Edit
                          </Button>
                        </div>
                        <ScrollArea className="h-20">
                          <div className="flex flex-wrap gap-2">
                            {selectedCustomersData.slice(0, 20).map(customer => (
                              <Badge key={customer.id} variant="secondary">
                                {customer.name}
                              </Badge>
                            ))}
                            {selectedCustomersData.length > 20 && (
                              <Badge variant="outline">
                                +{selectedCustomersData.length - 20} more
                              </Badge>
                            )}
                          </div>
                        </ScrollArea>
                      </div>

                      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Message</h4>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Plus className="mr-2 h-4 w-4" />
                              Use Template
                            </Button>
                          </DialogTrigger>
                        </div>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Select Message Template</DialogTitle>
                            <DialogDescription>
                              Choose a template to quickly create your message
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <Select
                              value={selectedTemplate || ""}
                              onValueChange={setSelectedTemplate}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a template" />
                              </SelectTrigger>
                              <SelectContent>
                                {mockTemplates.map(template => (
                                  <SelectItem key={template.id} value={template.id}>
                                    {template.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            {selectedTemplate && (
                              <div className="p-3 bg-muted rounded-md text-sm">
                                {mockTemplates.find(t => t.id === selectedTemplate)?.content}
                              </div>
                            )}
                          </div>
                          <DialogFooter>
                            <Button 
                              variant="outline" 
                              onClick={() => setShowTemplateDialog(false)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              onClick={handleApplyTemplate}
                              disabled={!selectedTemplate}
                            >
                              Apply Template
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Textarea
                        placeholder="Type your message here..."
                        className="min-h-[150px]"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                      />

                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>
                          Character count: {messageText.length} 
                          {messageText.length > 160 && ` (${Math.ceil(messageText.length / 160)} SMS)`}
                        </span>
                        <span>{selectedCustomers.length} recipient(s)</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Users className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No recipients selected</h3>
                      <p className="text-sm text-muted-foreground max-w-xs text-center mt-1">
                        Please select at least one recipient to send a message
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => setSelectedTab("customers")}
                      >
                        Select Recipients
                      </Button>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t">
                  <Button 
                    className="w-full"
                    disabled={!messageText.trim() || selectedCustomers.length === 0 || isSending}
                    onClick={handleSendSms}
                  >
                    {isSending ? "Sending..." : "Send SMS"}
                    {!isSending && <SendHorizonal className="ml-2 h-4 w-4" />}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MessagesSms;

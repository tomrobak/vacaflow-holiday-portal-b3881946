
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
} from "@/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { BasicInfoTab } from "@/components/customers/BasicInfoTab";
import { AddressTab } from "@/components/customers/AddressTab";
import { PreferencesTab } from "@/components/customers/PreferencesTab";
import { NotesAndTagsTab } from "@/components/customers/NotesAndTagsTab";
import { customerFormSchema, CustomerFormValues } from "@/types/customer";

// Define a proper customer type that includes the schema plus additional fields
interface Customer extends CustomerFormValues {
  id: string;
  totalBookings: number;
  totalSpent: number;
  lastBooking: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Mock customer data
const mockCustomer: Customer = {
  id: "CUST-1001",
  name: "John Smith",
  email: "john.smith@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main Street",
  addressLine2: "",
  city: "Miami",
  state: "Florida",
  zipCode: "33101",
  country: "United States",
  company: "",
  status: "active",
  type: "individual",
  notes: "Prefers beachfront properties. Allergic to pets. Often books for family vacations.",
  preferredContactMethod: "email",
  receiveMarketingEmails: false,
  receiveBookingUpdates: true,
  receivePaymentReminders: true,
  tags: [],
  totalBookings: 8,
  totalSpent: 6250.75,
  lastBooking: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365),
  updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
};

const EditCustomer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Explicitly type the state to match our Customer type
  const [customer, setCustomer] = useState<Customer>(mockCustomer);
  
  // Initialize form with customer data
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      company: customer.company,
      address: customer.address,
      addressLine2: customer.addressLine2,
      city: customer.city,
      state: customer.state,
      zipCode: customer.zipCode,
      country: customer.country,
      status: customer.status,
      type: customer.type,
      preferredContactMethod: customer.preferredContactMethod,
      receiveMarketingEmails: customer.receiveMarketingEmails,
      receiveBookingUpdates: customer.receiveBookingUpdates,
      receivePaymentReminders: customer.receivePaymentReminders,
      notes: customer.notes,
      tags: customer.tags,
    },
  });
  
  // Update form when customer data changes
  useEffect(() => {
    form.reset({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      company: customer.company,
      address: customer.address,
      addressLine2: customer.addressLine2,
      city: customer.city,
      state: customer.state,
      zipCode: customer.zipCode,
      country: customer.country,
      status: customer.status,
      type: customer.type,
      preferredContactMethod: customer.preferredContactMethod,
      receiveMarketingEmails: customer.receiveMarketingEmails,
      receiveBookingUpdates: customer.receiveBookingUpdates,
      receivePaymentReminders: customer.receivePaymentReminders,
      notes: customer.notes,
      tags: customer.tags,
    });
  }, [customer, form]);
  
  // Form submission handler
  const onSubmit = async (data: CustomerFormValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would call an API to update the customer
      console.log("Updating customer:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state - this is now properly typed
      setCustomer({
        ...customer,
        ...data,
        updatedAt: new Date(),
      });
      
      toast.success("Customer updated successfully!");
      navigate(`/customers/${id}`);
    } catch (error) {
      console.error("Error updating customer:", error);
      toast.error("Failed to update customer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={() => navigate(`/customers/${id}`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Customer</h1>
            <p className="text-muted-foreground">
              Update details for {customer.name} ({customer.id})
            </p>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="address">Address Details</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="notes">Notes & Tags</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-6">
              <BasicInfoTab control={form.control} />
            </TabsContent>
            
            <TabsContent value="address" className="space-y-6">
              <AddressTab control={form.control} />
            </TabsContent>
            
            <TabsContent value="preferences" className="space-y-6">
              <PreferencesTab control={form.control} />
            </TabsContent>
            
            <TabsContent value="notes" className="space-y-6">
              <NotesAndTagsTab 
                control={form.control} 
                watch={form.watch} 
                setValue={form.setValue} 
              />
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(`/customers/${id}`)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditCustomer;

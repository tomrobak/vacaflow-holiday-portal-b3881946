
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { toast } from "sonner";
import { BasicInfoTab } from "@/components/customers/BasicInfoTab";
import { AddressTab } from "@/components/customers/AddressTab";
import { PreferencesTab } from "@/components/customers/PreferencesTab";
import { NotesAndTagsTab } from "@/components/customers/NotesAndTagsTab";
import { customerFormSchema, CustomerFormValues } from "@/types/customer";

const NewCustomer = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with default values
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      address: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      status: "active",
      type: "individual",
      preferredContactMethod: "email",
      receiveMarketingEmails: false,
      receiveBookingUpdates: true,
      receivePaymentReminders: true,
      notes: "",
      tags: [],
    },
  });
  
  // Form submission handler
  const onSubmit = async (data: CustomerFormValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would call an API to create the customer
      console.log("Creating customer:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Customer created successfully!");
      navigate("/customers");
    } catch (error) {
      console.error("Error creating customer:", error);
      toast.error("Failed to create customer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/customers")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Add New Customer</h1>
            <p className="text-muted-foreground">
              Create a new customer account in your system
            </p>
          </div>
        </div>
      </div>
      
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
              onClick={() => navigate("/customers")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Creating..." : "Create Customer"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewCustomer;

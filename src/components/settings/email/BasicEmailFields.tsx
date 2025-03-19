
import React from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { EmailConfigForm } from "@/components/settings/email/emailTypes";

interface BasicEmailFieldsProps {
  form: UseFormReturn<EmailConfigForm>;
}

const BasicEmailFields = ({ form }: BasicEmailFieldsProps) => {
  return (
    <div className="grid gap-4 pt-4">
      <FormField
        control={form.control}
        name="fromEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>From Email</FormLabel>
            <FormControl>
              <Input {...field} type="email" placeholder="bookings@yourdomain.com" />
            </FormControl>
            <FormDescription>
              Email address that will appear in the From field
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="fromName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>From Name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Your Business Name" />
            </FormControl>
            <FormDescription>
              Name that will appear in the From field
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="replyToEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Reply-To Email</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                type="email" 
                placeholder="support@yourdomain.com" 
              />
            </FormControl>
            <FormDescription>
              Email address for replies (optional)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BasicEmailFields;

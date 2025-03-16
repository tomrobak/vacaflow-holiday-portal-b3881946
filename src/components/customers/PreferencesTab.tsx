
import React from "react";
import { Control } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomerFormValues } from "@/types/customer";

interface PreferencesTabProps {
  control: Control<CustomerFormValues>;
}

export const PreferencesTab: React.FC<PreferencesTabProps> = ({ control }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Communication Preferences</CardTitle>
        <CardDescription>
          Set how and when we can contact this customer
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="preferredContactMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Contact Method</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select contact method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                How would this customer prefer to be contacted?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-4">
          <FormField
            control={control}
            name="receiveMarketingEmails"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Marketing Emails</FormLabel>
                  <FormDescription>
                    Receive promotional offers and newsletters
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="receiveBookingUpdates"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Booking Updates</FormLabel>
                  <FormDescription>
                    Receive notifications about booking changes and confirmations
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="receivePaymentReminders"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Payment Reminders</FormLabel>
                  <FormDescription>
                    Receive payment due date reminders and receipts
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

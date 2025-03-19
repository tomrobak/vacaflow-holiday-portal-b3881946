
import React from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { EmailConfigForm } from "@/components/settings/email/emailTypes";

interface EmailProviderSelectProps {
  form: UseFormReturn<EmailConfigForm>;
}

const EmailProviderSelect = ({ form }: EmailProviderSelectProps) => {
  return (
    <FormField
      control={form.control}
      name="provider"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Email Provider</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="postmark" />
                </FormControl>
                <FormLabel className="font-normal">
                  Postmark (Recommended)
                </FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="smtp" />
                </FormControl>
                <FormLabel className="font-normal">
                  Custom SMTP Server
                </FormLabel>
              </FormItem>
            </RadioGroup>
          </FormControl>
          <FormDescription>
            Select how you want to send emails from your application
          </FormDescription>
        </FormItem>
      )}
    />
  );
};

export default EmailProviderSelect;

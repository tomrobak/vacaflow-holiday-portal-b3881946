
import React from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, LockKeyhole } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { EmailConfigForm } from "@/components/settings/email/emailTypes";

interface SmtpConfigProps {
  form: UseFormReturn<EmailConfigForm>;
}

const SmtpConfig = ({ form }: SmtpConfigProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>SMTP Configuration</CardTitle>
        <CardDescription>
          Configure your SMTP server connection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="smtpHost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SMTP Host</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="smtp.yourdomain.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="smtpPort"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SMTP Port</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="587" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="smtpUser"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SMTP Username</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="username" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="smtpPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SMTP Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      {...field} 
                      type="password" 
                      placeholder="password" 
                    />
                    <LockKeyhole className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="smtpSecure"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Use TLS/SSL
                </FormLabel>
                <FormDescription>
                  Enable secure connection with TLS/SSL
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default SmtpConfig;

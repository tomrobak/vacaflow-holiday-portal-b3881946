
import React from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, LockKeyhole } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { EmailConfigForm } from "@/components/settings/email/emailTypes";

interface PostmarkConfigProps {
  form: UseFormReturn<EmailConfigForm>;
}

const PostmarkConfig = ({ form }: PostmarkConfigProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Postmark Configuration</CardTitle>
        <CardDescription>
          Configure your Postmark API integration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            Your Postmark API key is sensitive. Never share it publicly or include it in client-side code.
          </AlertDescription>
        </Alert>
        
        <FormField
          control={form.control}
          name="postmarkApiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postmark API Key</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    {...field} 
                    type="password" 
                    placeholder="Postmark API Key" 
                  />
                  <LockKeyhole className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </FormControl>
              <FormDescription>
                Your Postmark server API key
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default PostmarkConfig;

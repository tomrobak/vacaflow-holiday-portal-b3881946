
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TwilioSettings } from "@/types/sms";

const twilioFormSchema = z.object({
  accountSid: z.string().min(1, "Account SID is required"),
  authToken: z.string().min(1, "Auth Token is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  enabled: z.boolean(),
  defaultMessage: z.string().optional(),
});

type TwilioFormValues = z.infer<typeof twilioFormSchema>;

const SmsSettings = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [testPhone, setTestPhone] = useState("");

  // Initial values - in a real app, these would come from an API or context
  const defaultValues: TwilioFormValues = {
    accountSid: "",
    authToken: "",
    phoneNumber: "",
    enabled: false,
    defaultMessage: "Thank you for choosing Vacaflow. If you have any questions, please reply to this message.",
  };

  const form = useForm<TwilioFormValues>({
    resolver: zodResolver(twilioFormSchema),
    defaultValues,
  });

  const onSubmit = (data: TwilioFormValues) => {
    // In a real app, this would save to an API or context
    console.log("Saving Twilio settings:", data);
    toast.success("Twilio settings saved successfully");
  };

  const handleTestSms = () => {
    if (!testPhone) {
      toast.error("Please enter a test phone number");
      return;
    }
    
    setIsTesting(true);
    // In a real app, this would call an API
    setTimeout(() => {
      toast.success(`Test SMS sent to ${testPhone}`);
      setIsTesting(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">SMS Settings</h2>
        <p className="text-muted-foreground">Configure your Twilio SMS integration</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Twilio Configuration</CardTitle>
              <CardDescription>
                Enter your Twilio credentials to enable SMS messaging
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="accountSid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account SID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your Twilio Account SID" {...field} />
                    </FormControl>
                    <FormDescription>
                      Find this in your Twilio account dashboard
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="authToken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Auth Token</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your Twilio Auth Token"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Keep this token secure
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twilio Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="+1xxxxxxxxxx" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      The phone number you've purchased from Twilio
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enable SMS</FormLabel>
                      <FormDescription>
                        Turn on SMS capabilities for your platform
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="defaultMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Message Footer</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a default message that will be appended to all SMS"
                        {...field}
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormDescription>
                      This will be appended to all outgoing messages
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Test phone number"
                  className="w-[200px]"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleTestSms}
                  disabled={isTesting}
                >
                  {isTesting ? "Sending..." : "Test SMS"}
                  {!isTesting && <Send className="ml-2 h-4 w-4" />}
                </Button>
              </div>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default SmsSettings;


import React, { useState } from "react";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  AlertCircle, CheckCircle2, Mail, Save, TestTube, 
  LockKeyhole, SendHorizonal, Loader2, Lock
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

const emailConfigSchema = z.object({
  provider: z.enum(["postmark", "smtp"]),
  fromEmail: z.string().email("Must be a valid email address"),
  fromName: z.string().min(1, "From name is required"),
  replyToEmail: z.string().email("Must be a valid email address").optional(),
  
  // Postmark specific fields
  postmarkApiKey: z.string().optional(),
  
  // SMTP specific fields
  smtpHost: z.string().optional(),
  smtpPort: z.string().optional(),
  smtpUser: z.string().optional(),
  smtpPassword: z.string().optional(),
  smtpSecure: z.boolean().optional(),
});

type EmailConfigForm = z.infer<typeof emailConfigSchema>;

const EmailSettings = () => {
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<null | 'success' | 'error'>(null);
  const [testEmailAddress, setTestEmailAddress] = useState("");
  const [sendingTestEmail, setSendingTestEmail] = useState(false);

  const form = useForm<EmailConfigForm>({
    resolver: zodResolver(emailConfigSchema),
    defaultValues: {
      provider: "postmark",
      fromEmail: "bookings@vacaflow.com",
      fromName: "Vacaflow Bookings",
      replyToEmail: "support@vacaflow.com",
      postmarkApiKey: "",
      smtpHost: "",
      smtpPort: "587",
      smtpUser: "",
      smtpPassword: "",
      smtpSecure: true,
    }
  });

  const onSubmit = (data: EmailConfigForm) => {
    console.log(data);
    toast.success("Email settings saved successfully");
  };

  const testConnection = () => {
    setTestingConnection(true);
    // Simulate API call
    setTimeout(() => {
      setTestingConnection(false);
      setConnectionStatus('success');
      toast.success("Email connection test successful");
    }, 2000);
  };

  const sendTestEmail = () => {
    if (!testEmailAddress) {
      toast.error("Please enter a test email address");
      return;
    }
    
    setSendingTestEmail(true);
    // Simulate API call
    setTimeout(() => {
      setSendingTestEmail(false);
      toast.success(`Test email sent to ${testEmailAddress}`);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Email Delivery Settings</h2>
        <p className="text-muted-foreground">Configure email delivery services for sending transactional emails</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Provider Configuration
              </CardTitle>
              <CardDescription>
                Configure how emails are sent from your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
            </CardContent>
          </Card>

          {form.watch("provider") === "postmark" && (
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
          )}

          {form.watch("provider") === "smtp" && (
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
          )}

          <Card>
            <CardHeader>
              <CardTitle>Test Email Configuration</CardTitle>
              <CardDescription>
                Test your email configuration by sending a test email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                <div className="w-full sm:w-96">
                  <Label htmlFor="test-email">Test Email Address</Label>
                  <Input 
                    id="test-email"
                    type="email" 
                    placeholder="your@email.com" 
                    value={testEmailAddress}
                    onChange={(e) => setTestEmailAddress(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="secondary"
                    onClick={sendTestEmail}
                    disabled={sendingTestEmail || !testEmailAddress}
                    className="flex gap-2"
                  >
                    {sendingTestEmail ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <SendHorizonal className="h-4 w-4" />
                        Send Test Email
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={testConnection}
                    disabled={testingConnection}
                    className="flex gap-2"
                  >
                    {testingConnection ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <TestTube className="h-4 w-4" />
                        Test Connection
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {connectionStatus === 'success' && (
                <div className="flex items-center gap-2 text-green-600 pt-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Connection verified</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Button type="submit" className="flex gap-2">
            <Save className="h-4 w-4" />
            Save Email Settings
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EmailSettings;

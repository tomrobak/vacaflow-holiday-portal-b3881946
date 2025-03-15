
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { CheckCircle2, Save, TestTube } from "lucide-react";
import { toast } from "sonner";

const MailSettings = () => {
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<null | 'success' | 'error'>(null);

  const form = useForm({
    defaultValues: {
      enabled: true,
      inboundEmail: "support@vacaflow.com",
      forwardTo: "team@vacaflow.com",
      autoReply: true,
      autoReplyTemplate: "Thank you for your message. We've received your inquiry and will get back to you within 24 hours.",
      signature: "Best regards,\nThe Vacaflow Team"
    }
  });

  const onSubmit = (data: any) => {
    console.log(data);
    toast.success("Mail settings saved successfully");
  };

  const testConnection = () => {
    setTestingConnection(true);
    // Simulate API call
    setTimeout(() => {
      setTestingConnection(false);
      setConnectionStatus('success');
      toast.success("Connection test successful");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Unified Mailbox</h2>
        <p className="text-muted-foreground">Configure your unified mailbox for customer communications</p>
      </div>

      <Tabs defaultValue="settings">
        <TabsList>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="filters">Filters & Rules</TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings" className="space-y-6 pt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mailbox Configuration</CardTitle>
                  <CardDescription>
                    Configure your unified mailbox for customer communications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="enabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Enable Unified Mailbox
                          </FormLabel>
                          <FormDescription>
                            Centralize all customer communications in one place
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
                  
                  <FormField
                    control={form.control}
                    name="inboundEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inbound Email Address</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormDescription>
                          Email address where customers will send their inquiries
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="forwardTo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Forward To</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormDescription>
                          Email address where messages will be forwarded (optional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-between items-center">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={testConnection}
                      disabled={testingConnection}
                      className="flex gap-2"
                    >
                      {testingConnection ? (
                        <>Testing...</>
                      ) : (
                        <>
                          <TestTube className="h-4 w-4" />
                          Test Connection
                        </>
                      )}
                    </Button>
                    
                    {connectionStatus === 'success' && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Connection successful</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Auto-Reply Settings</CardTitle>
                  <CardDescription>
                    Configure automatic replies to customer inquiries
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="autoReply"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Enable Auto-Reply
                          </FormLabel>
                          <FormDescription>
                            Automatically reply to new customer messages
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
                  
                  <FormField
                    control={form.control}
                    name="autoReplyTemplate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Auto-Reply Template</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={4} />
                        </FormControl>
                        <FormDescription>
                          Template message for automatic replies
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="signature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Signature</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} />
                        </FormControl>
                        <FormDescription>
                          Signature to append to all outgoing emails
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Button type="submit" className="flex gap-2">
                <Save className="h-4 w-4" />
                Save Settings
              </Button>
            </form>
          </Form>
        </TabsContent>
        
        <TabsContent value="templates" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>
                Manage your email templates for different scenarios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Configure different templates for various communication scenarios
              </p>
              
              {/* Placeholder for template management UI */}
              <div className="bg-muted/50 border border-dashed rounded-md p-8 text-center">
                <p className="text-muted-foreground">Template management coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="filters" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Filters & Rules</CardTitle>
              <CardDescription>
                Set up automated filtering and routing rules
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Create rules to automatically categorize and route incoming messages
              </p>
              
              {/* Placeholder for filtering rules UI */}
              <div className="bg-muted/50 border border-dashed rounded-md p-8 text-center">
                <p className="text-muted-foreground">Filtering rules coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MailSettings;

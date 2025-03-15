
import React, { useState } from "react";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  AlertCircle, CheckCircle2, CreditCard, Loader2, Save, 
  TestTube, LockKeyhole, DollarSign, Receipt
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

const stripeConfigSchema = z.object({
  enabled: z.boolean(),
  liveMode: z.boolean(),
  publicKey: z.string().min(1, "Public key is required"),
  secretKey: z.string().min(1, "Secret key is required"),
  webhookSecret: z.string().min(1, "Webhook secret is required"),
  autoCapture: z.boolean(),
  statementDescriptor: z.string().max(22, "Maximum 22 characters allowed"),
});

type StripeConfigForm = z.infer<typeof stripeConfigSchema>;

const PaymentSettings = () => {
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<null | 'success' | 'error'>(null);

  const form = useForm<StripeConfigForm>({
    resolver: zodResolver(stripeConfigSchema),
    defaultValues: {
      enabled: false,
      liveMode: false,
      publicKey: "",
      secretKey: "",
      webhookSecret: "",
      autoCapture: true,
      statementDescriptor: "Vacaflow Booking",
    }
  });

  const onSubmit = (data: StripeConfigForm) => {
    console.log(data);
    toast.success("Payment settings saved successfully");
  };

  const testConnection = () => {
    setTestingConnection(true);
    // Simulate API call
    setTimeout(() => {
      setTestingConnection(false);
      setConnectionStatus('success');
      toast.success("Stripe connection test successful");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Payment Settings</h2>
        <p className="text-muted-foreground">Configure Stripe integration for processing payments</p>
      </div>

      <Tabs defaultValue="stripe">
        <TabsList>
          <TabsTrigger value="stripe" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Stripe
          </TabsTrigger>
          <TabsTrigger value="invoicing" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Invoicing
          </TabsTrigger>
          <TabsTrigger value="tax" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Tax Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="stripe" className="space-y-6 pt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Stripe Configuration
                  </CardTitle>
                  <CardDescription>
                    Connect your Stripe account to process payments
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Important</AlertTitle>
                    <AlertDescription>
                      Your API keys are sensitive. Never share them publicly or include them in client-side code.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="enabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Enable Stripe Integration
                            </FormLabel>
                            <FormDescription>
                              Enable payment processing via Stripe
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
                      name="liveMode"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Live Mode
                            </FormLabel>
                            <FormDescription>
                              Switch between test and live mode
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
                  </div>
                  
                  <div className="grid gap-4 pt-4">
                    <FormField
                      control={form.control}
                      name="publicKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Publishable Key</FormLabel>
                          <FormControl>
                            <Input {...field} type="text" placeholder="pk_test_..." />
                          </FormControl>
                          <FormDescription>
                            {form.watch("liveMode") ? "Live publishable key" : "Test publishable key"}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="secretKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Secret Key</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                {...field} 
                                type="password" 
                                placeholder="sk_test_..." 
                              />
                              <LockKeyhole className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormDescription>
                            {form.watch("liveMode") ? "Live secret key" : "Test secret key"}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="webhookSecret"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Webhook Secret</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                {...field} 
                                type="password" 
                                placeholder="whsec_..." 
                              />
                              <LockKeyhole className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Webhook signing secret for verifying webhook events
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Preferences</CardTitle>
                  <CardDescription>
                    Configure payment handling options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="autoCapture"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Auto-Capture Payments
                          </FormLabel>
                          <FormDescription>
                            Automatically capture payments when authorized
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
                    name="statementDescriptor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Statement Descriptor</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            maxLength={22}
                          />
                        </FormControl>
                        <FormDescription>
                          Text that appears on customer credit card statements (max 22 characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-between items-center pt-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={testConnection}
                      disabled={testingConnection || !form.watch("publicKey") || !form.watch("secretKey")}
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
                    
                    {connectionStatus === 'success' && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Connection verified</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Button type="submit" className="flex gap-2">
                <Save className="h-4 w-4" />
                Save Payment Settings
              </Button>
            </form>
          </Form>
        </TabsContent>
        
        <TabsContent value="invoicing" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Settings</CardTitle>
              <CardDescription>
                Configure invoice generation and delivery options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Configure your invoice settings, templates, and automatic sending preferences
              </p>
              
              {/* Placeholder for invoice settings UI */}
              <div className="bg-muted/50 border border-dashed rounded-md p-8 text-center">
                <p className="text-muted-foreground">Invoice configuration coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tax" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tax Settings</CardTitle>
              <CardDescription>
                Configure tax rates and calculation methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Set up tax rates for different regions and configure automatic tax calculations
              </p>
              
              {/* Placeholder for tax settings UI */}
              <div className="bg-muted/50 border border-dashed rounded-md p-8 text-center">
                <p className="text-muted-foreground">Tax configuration coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentSettings;

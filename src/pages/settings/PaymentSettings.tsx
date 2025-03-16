
import React, { useState } from "react";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  AlertCircle, CheckCircle2, CreditCard, Loader2, Save, 
  TestTube, LockKeyhole, DollarSign, Receipt, FileText,
  FileSpreadsheet, Printer, Mail as MailIcon, BadgePercent,
  Globe, Building, FileCheck, CircleDollarSign
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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

const invoiceConfigSchema = z.object({
  enabled: z.boolean(),
  companyName: z.string().min(1, "Company name is required"),
  address: z.string().min(1, "Address is required"),
  vatNumber: z.string().optional(),
  autoSend: z.boolean(),
  dueDays: z.number().min(0).max(90),
  footerText: z.string().max(500),
  logoEnabled: z.boolean(),
  emailSubject: z.string(),
  emailBody: z.string(),
});

const taxConfigSchema = z.object({
  automaticTax: z.boolean(),
  defaultVatRate: z.number().min(0).max(100),
  displayPricesWithTax: z.boolean(),
  taxProvider: z.enum(["manual", "avalara", "taxjar"]),
  businessCountry: z.string(),
  taxIdCollection: z.boolean(),
});

type StripeConfigForm = z.infer<typeof stripeConfigSchema>;
type InvoiceConfigForm = z.infer<typeof invoiceConfigSchema>;
type TaxConfigForm = z.infer<typeof taxConfigSchema>;

const PaymentSettings = () => {
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<null | 'success' | 'error'>(null);
  const [activeSection, setActiveSection] = useState<'stripe' | 'invoicing' | 'tax'>('stripe');

  // Stripe form
  const stripeForm = useForm<StripeConfigForm>({
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

  // Invoice form
  const invoiceForm = useForm<InvoiceConfigForm>({
    resolver: zodResolver(invoiceConfigSchema),
    defaultValues: {
      enabled: false,
      companyName: "Vacaflow Inc.",
      address: "",
      vatNumber: "",
      autoSend: true,
      dueDays: 14,
      footerText: "Thank you for your business!",
      logoEnabled: true,
      emailSubject: "Your invoice for booking #{invoice_number}",
      emailBody: "Please find attached your invoice for your recent booking.",
    }
  });

  // Tax form
  const taxForm = useForm<TaxConfigForm>({
    resolver: zodResolver(taxConfigSchema),
    defaultValues: {
      automaticTax: false,
      defaultVatRate: 20,
      displayPricesWithTax: true,
      taxProvider: "manual",
      businessCountry: "US",
      taxIdCollection: false,
    }
  });

  const onSubmitStripe = (data: StripeConfigForm) => {
    console.log(data);
    toast.success("Stripe settings saved successfully");
  };

  const onSubmitInvoice = (data: InvoiceConfigForm) => {
    console.log(data);
    toast.success("Invoice settings saved successfully");
  };

  const onSubmitTax = (data: TaxConfigForm) => {
    console.log(data);
    toast.success("Tax settings saved successfully");
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
        <p className="text-muted-foreground">Configure payment processing, invoicing, and tax settings</p>
      </div>

      {/* Section Navigation */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={activeSection === 'stripe' ? "default" : "outline"}
          onClick={() => setActiveSection('stripe')}
          className="flex items-center gap-2"
        >
          <CreditCard className="h-4 w-4" />
          Payment Processing
        </Button>
        <Button 
          variant={activeSection === 'invoicing' ? "default" : "outline"}
          onClick={() => setActiveSection('invoicing')}
          className="flex items-center gap-2"
        >
          <Receipt className="h-4 w-4" />
          Invoicing
        </Button>
        <Button 
          variant={activeSection === 'tax' ? "default" : "outline"}
          onClick={() => setActiveSection('tax')}
          className="flex items-center gap-2"
        >
          <BadgePercent className="h-4 w-4" />
          Tax Settings
        </Button>
      </div>
      
      {/* Stripe Section */}
      {activeSection === 'stripe' && (
        <Form {...stripeForm}>
          <form onSubmit={stripeForm.handleSubmit(onSubmitStripe)} className="space-y-6">
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
                    control={stripeForm.control}
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
                    control={stripeForm.control}
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
                    control={stripeForm.control}
                    name="publicKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Publishable Key</FormLabel>
                        <FormControl>
                          <Input {...field} type="text" placeholder="pk_test_..." />
                        </FormControl>
                        <FormDescription>
                          {stripeForm.watch("liveMode") ? "Live publishable key" : "Test publishable key"}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={stripeForm.control}
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
                          {stripeForm.watch("liveMode") ? "Live secret key" : "Test secret key"}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={stripeForm.control}
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
                  control={stripeForm.control}
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
                  control={stripeForm.control}
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
                    disabled={testingConnection || !stripeForm.watch("publicKey") || !stripeForm.watch("secretKey")}
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
      )}
      
      {/* Invoicing Section */}
      {activeSection === 'invoicing' && (
        <Form {...invoiceForm}>
          <form onSubmit={invoiceForm.handleSubmit(onSubmitInvoice)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Invoice Configuration
                </CardTitle>
                <CardDescription>
                  Configure the generation and delivery of invoices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={invoiceForm.control}
                  name="enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Enable Automatic Invoicing
                        </FormLabel>
                        <FormDescription>
                          Automatically generate invoices for bookings
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
                
                <Separator className="my-4" />
                
                <div className="grid gap-4">
                  <h3 className="text-lg font-medium">Company Details</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={invoiceForm.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Your Company Name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={invoiceForm.control}
                      name="vatNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>VAT/Tax ID (Optional)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="VAT/Tax Identification Number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={invoiceForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Address</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Full company address" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Separator className="my-4" />
                
                <div className="grid gap-4">
                  <h3 className="text-lg font-medium">Invoice Settings</h3>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={invoiceForm.control}
                      name="logoEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Include Logo
                            </FormLabel>
                            <FormDescription>
                              Display your company logo on invoices
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
                      control={invoiceForm.control}
                      name="dueDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Due Days</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={0} 
                              max={90} 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormDescription>
                            Number of days before invoice is due
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={invoiceForm.control}
                    name="footerText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invoice Footer Text</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Text that appears at the bottom of each invoice
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Separator className="my-4" />
                
                <div className="grid gap-4">
                  <h3 className="text-lg font-medium">Email Delivery</h3>
                  
                  <FormField
                    control={invoiceForm.control}
                    name="autoSend"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Auto-send Invoices
                          </FormLabel>
                          <FormDescription>
                            Automatically email invoices to customers
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
                    control={invoiceForm.control}
                    name="emailSubject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Subject</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Use {'{invoice_number}'}, {'{booking_ref}'}, {'{customer_name}'} as variables
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={invoiceForm.control}
                    name="emailBody"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Body</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Short email message to include when sending invoices
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
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Invoice Templates
                </CardTitle>
                <CardDescription>
                  Manage document templates for different purposes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border border-dashed hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <Receipt className="h-8 w-8 mb-2 text-primary" />
                      <h3 className="font-medium">Standard Invoice</h3>
                      <p className="text-xs text-muted-foreground">Default template for all bookings</p>
                      <Button variant="ghost" size="sm" className="mt-2">Customize</Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-dashed hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <FileSpreadsheet className="h-8 w-8 mb-2 text-primary" />
                      <h3 className="font-medium">Detailed Receipt</h3>
                      <p className="text-xs text-muted-foreground">Itemized receipt with booking details</p>
                      <Button variant="ghost" size="sm" className="mt-2">Customize</Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-dashed hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <Printer className="h-8 w-8 mb-2 text-primary" />
                      <h3 className="font-medium">Proforma Invoice</h3>
                      <p className="text-xs text-muted-foreground">For advance payments and deposits</p>
                      <Button variant="ghost" size="sm" className="mt-2">Customize</Button>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <Button variant="outline" className="flex gap-2">
                    <FileText className="h-4 w-4" />
                    Preview Sample Invoice
                  </Button>
                  <Button variant="outline" className="flex gap-2">
                    <MailIcon className="h-4 w-4" />
                    Send Test Email
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Button type="submit" className="flex gap-2">
              <Save className="h-4 w-4" />
              Save Invoice Settings
            </Button>
          </form>
        </Form>
      )}
      
      {/* Tax Settings Section */}
      {activeSection === 'tax' && (
        <Form {...taxForm}>
          <form onSubmit={taxForm.handleSubmit(onSubmitTax)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BadgePercent className="h-5 w-5" />
                  Tax Configuration
                </CardTitle>
                <CardDescription>
                  Configure tax calculation and display settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <FormField
                    control={taxForm.control}
                    name="automaticTax"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Enable Automatic Tax Calculation
                          </FormLabel>
                          <FormDescription>
                            Automatically calculate applicable taxes based on location
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
                    control={taxForm.control}
                    name="displayPricesWithTax"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Display Prices Including Tax
                          </FormLabel>
                          <FormDescription>
                            Show prices with tax included by default
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
                
                <Separator className="my-4" />
                
                <div className="grid gap-4">
                  <h3 className="text-lg font-medium">Tax Provider</h3>
                  
                  <FormField
                    control={taxForm.control}
                    name="taxProvider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax Calculation Provider</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a tax provider" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="manual">Manual (Fixed Rates)</SelectItem>
                            <SelectItem value="avalara">Avalara</SelectItem>
                            <SelectItem value="taxjar">TaxJar</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose how tax rates should be calculated
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {taxForm.watch("taxProvider") === "manual" && (
                    <FormField
                      control={taxForm.control}
                      name="defaultVatRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default VAT/Tax Rate (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={0} 
                              max={100} 
                              {...field} 
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormDescription>
                            Default tax rate when no specific rate applies
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                
                <Separator className="my-4" />
                
                <div className="grid gap-4">
                  <h3 className="text-lg font-medium">Business Location</h3>
                  
                  <FormField
                    control={taxForm.control}
                    name="businessCountry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country of Business</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your business country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="US">United States</SelectItem>
                            <SelectItem value="CA">Canada</SelectItem>
                            <SelectItem value="GB">United Kingdom</SelectItem>
                            <SelectItem value="AU">Australia</SelectItem>
                            <SelectItem value="DE">Germany</SelectItem>
                            <SelectItem value="FR">France</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Your primary business location for tax purposes
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={taxForm.control}
                    name="taxIdCollection"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Collect Customer Tax IDs
                          </FormLabel>
                          <FormDescription>
                            Request VAT/Tax ID from customers during checkout
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
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Regional Tax Rates
                </CardTitle>
                <CardDescription>
                  Configure tax rates for specific regions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Collapsible className="border rounded-md">
                    <CollapsibleTrigger className="flex w-full items-center justify-between p-4 font-medium">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        <span>United States</span>
                      </div>
                      <DollarSign className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-4 pt-0 border-t">
                      <div className="grid gap-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">California</span>
                          <span>7.25% + local taxes</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">New York</span>
                          <span>4% + local taxes</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">Florida</span>
                          <span>6% + local taxes</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="mt-3">Add State</Button>
                    </CollapsibleContent>
                  </Collapsible>
                  
                  <Collapsible className="border rounded-md">
                    <CollapsibleTrigger className="flex w-full items-center justify-between p-4 font-medium">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        <span>European Union</span>
                      </div>
                      <CircleDollarSign className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-4 pt-0 border-t">
                      <div className="grid gap-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">Germany</span>
                          <span>19%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">France</span>
                          <span>20%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">Italy</span>
                          <span>22%</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="mt-3">Add Country</Button>
                    </CollapsibleContent>
                  </Collapsible>
                  
                  <Button variant="outline" className="w-full flex gap-2">
                    <FileCheck className="h-4 w-4" />
                    Add New Region
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Button type="submit" className="flex gap-2">
              <Save className="h-4 w-4" />
              Save Tax Settings
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default PaymentSettings;

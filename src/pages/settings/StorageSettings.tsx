
import React, { useState } from "react";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  AlertCircle, CheckCircle2, Cloud, Image, File, Save, 
  TestTube, LockKeyhole, Upload, Download, Loader2, Package,
  CloudUpload, CloudDownload, Globe, RefreshCw, Link, HardDrive
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Provider-specific schemas
const cloudflareConfigSchema = z.object({
  accountId: z.string().min(1, "Account ID is required"),
  accessKeyId: z.string().min(1, "Access Key ID is required"),
  secretAccessKey: z.string().min(1, "Secret Access Key is required"),
  bucket: z.string().min(1, "Bucket name is required"),
  region: z.string().min(1, "Region is required"),
});

const bunnyNetConfigSchema = z.object({
  storageZoneName: z.string().min(1, "Storage Zone Name is required"),
  apiKey: z.string().min(1, "API Key is required"),
  pullZoneId: z.string().optional(),
  region: z.enum(["NY", "LA", "SG", "SYD", "DE", "UK", "SE", "BR", "JH"]),
  enableOptimization: z.boolean(),
});

// Combined schema with shared fields
const storageConfigSchema = z.object({
  enabled: z.boolean(),
  provider: z.enum(["cloudflare", "bunnynet"]),
  useCustomDomain: z.boolean(),
  customDomain: z.string().optional(),
  cacheControl: z.string(),
  
  // Provider-specific nested objects
  cloudflare: cloudflareConfigSchema.optional(),
  bunnynet: bunnyNetConfigSchema.optional(),
});

type StorageConfigForm = z.infer<typeof storageConfigSchema>;

const StorageSettings = () => {
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<null | 'success' | 'error'>(null);
  const [activeProvider, setActiveProvider] = useState<"cloudflare" | "bunnynet">("cloudflare");

  const form = useForm<StorageConfigForm>({
    resolver: zodResolver(storageConfigSchema),
    defaultValues: {
      enabled: false,
      provider: "cloudflare",
      useCustomDomain: false,
      customDomain: "",
      cacheControl: "public, max-age=31536000",
      cloudflare: {
        accountId: "",
        accessKeyId: "",
        secretAccessKey: "",
        bucket: "",
        region: "auto",
      },
      bunnynet: {
        storageZoneName: "",
        apiKey: "",
        pullZoneId: "",
        region: "DE",
        enableOptimization: true,
      }
    }
  });

  const onSubmit = (data: StorageConfigForm) => {
    console.log(data);
    toast.success("Storage settings saved successfully");
  };

  const testConnection = () => {
    setTestingConnection(true);
    // Simulate API call
    setTimeout(() => {
      setTestingConnection(false);
      setConnectionStatus('success');
      toast.success("Storage connection test successful");
    }, 2000);
  };

  const handleProviderChange = (provider: "cloudflare" | "bunnynet") => {
    setActiveProvider(provider);
    form.setValue("provider", provider);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Storage Settings</h2>
        <p className="text-muted-foreground">Configure cloud storage for property images and documents</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5" />
                Storage Configuration
              </CardTitle>
              <CardDescription>
                Connect to cloud storage providers for property images and document storage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Your storage credentials are sensitive. Never share them publicly or include them in client-side code.
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
                          Enable Cloud Storage
                        </FormLabel>
                        <FormDescription>
                          Enable cloud storage for files and images
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
                
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={activeProvider === "cloudflare" ? "default" : "outline"}
                    className="flex flex-col items-center justify-center h-auto py-4 px-4"
                    onClick={() => handleProviderChange("cloudflare")}
                  >
                    <Cloud className="h-6 w-6 mb-2" />
                    <span className="font-medium">Cloudflare R2</span>
                    <span className="text-xs text-muted-foreground mt-1">S3-compatible storage</span>
                  </Button>
                  
                  <Button
                    type="button"
                    variant={activeProvider === "bunnynet" ? "default" : "outline"}
                    className="flex flex-col items-center justify-center h-auto py-4 px-4"
                    onClick={() => handleProviderChange("bunnynet")}
                  >
                    <Package className="h-6 w-6 mb-2" />
                    <span className="font-medium">Bunny.net</span>
                    <span className="text-xs text-muted-foreground mt-1">Global edge storage</span>
                  </Button>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              {/* Cloudflare R2 Settings */}
              {activeProvider === "cloudflare" && (
                <div className="grid gap-6">
                  <h3 className="text-lg font-medium">Cloudflare R2 Configuration</h3>
                  
                  <FormField
                    control={form.control}
                    name="cloudflare.accountId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cloudflare Account ID</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Account ID" />
                        </FormControl>
                        <FormDescription>
                          Your Cloudflare account identifier
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="cloudflare.accessKeyId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Access Key ID</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Access Key ID" />
                          </FormControl>
                          <FormDescription>
                            R2 access key identifier
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="cloudflare.secretAccessKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Secret Access Key</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                {...field} 
                                type="password" 
                                placeholder="Secret Access Key" 
                              />
                              <LockKeyhole className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormDescription>
                            R2 secret access key
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="cloudflare.bucket"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bucket Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="vacaflow-storage" />
                          </FormControl>
                          <FormDescription>
                            R2 bucket for storing files
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="cloudflare.region"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Region</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="auto" />
                          </FormControl>
                          <FormDescription>
                            R2 region (usually "auto")
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
              
              {/* Bunny.net Settings */}
              {activeProvider === "bunnynet" && (
                <div className="grid gap-6">
                  <h3 className="text-lg font-medium">Bunny.net Storage Configuration</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="bunnynet.storageZoneName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Storage Zone Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="vacaflow-zone" />
                          </FormControl>
                          <FormDescription>
                            Name of your Bunny.net storage zone
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="bunnynet.apiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>API Key</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                {...field} 
                                type="password" 
                                placeholder="Your Bunny.net API Key" 
                              />
                              <LockKeyhole className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Bunny.net Storage API key with access to the storage zone
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="bunnynet.region"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Storage Region</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a region" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="NY">New York</SelectItem>
                              <SelectItem value="LA">Los Angeles</SelectItem>
                              <SelectItem value="SG">Singapore</SelectItem>
                              <SelectItem value="SYD">Sydney</SelectItem>
                              <SelectItem value="DE">Frankfurt</SelectItem>
                              <SelectItem value="UK">London</SelectItem>
                              <SelectItem value="SE">Stockholm</SelectItem>
                              <SelectItem value="BR">São Paulo</SelectItem>
                              <SelectItem value="JH">Johannesburg</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Primary region where files will be stored
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="bunnynet.pullZoneId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pull Zone ID (Optional)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="12345" />
                          </FormControl>
                          <FormDescription>
                            Connect to an existing Pull Zone for CDN delivery
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="bunnynet.enableOptimization"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Enable Image Optimization
                          </FormLabel>
                          <FormDescription>
                            Optimize images for faster loading and reduced bandwidth
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
              )}
              
              <Separator className="my-6" />
              
              <div className="grid gap-4">
                <h3 className="text-lg font-medium">Domain & Caching Settings</h3>
                
                <FormField
                  control={form.control}
                  name="useCustomDomain"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Use Custom Domain
                        </FormLabel>
                        <FormDescription>
                          Serve files from a custom domain instead of the storage provider domain
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
                
                {form.watch("useCustomDomain") && (
                  <FormField
                    control={form.control}
                    name="customDomain"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custom Domain</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="assets.yourdomain.com" 
                          />
                        </FormControl>
                        <FormDescription>
                          Custom domain for serving files
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <FormField
                  control={form.control}
                  name="cacheControl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cache Control</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Cache-Control header for uploaded files
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-between items-center pt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={testConnection}
                  disabled={testingConnection || 
                    (activeProvider === "cloudflare" && 
                      (!form.watch("cloudflare.accessKeyId") || !form.watch("cloudflare.secretAccessKey") || !form.watch("cloudflare.bucket"))) ||
                    (activeProvider === "bunnynet" && 
                      (!form.watch("bunnynet.apiKey") || !form.watch("bunnynet.storageZoneName")))
                  }
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

          {/* Storage Features Card */}
          <Card>
            <CardHeader>
              <CardTitle>Storage Features</CardTitle>
              <CardDescription>
                Configure storage features and content policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Collapsible className="border rounded-lg overflow-hidden">
                  <CollapsibleTrigger className="flex w-full items-center justify-between p-4">
                    <div className="flex items-center gap-2">
                      <Image className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">Image Processing</h4>
                        <p className="text-xs text-muted-foreground">Resize and optimize images</p>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-4 pb-4 pt-0 border-t">
                    <div className="space-y-4 mt-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h5 className="text-sm font-medium">Auto Resize Images</h5>
                          <p className="text-xs text-muted-foreground">Automatically resize images on upload</p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h5 className="text-sm font-medium">WebP Conversion</h5>
                          <p className="text-xs text-muted-foreground">Convert images to WebP format</p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h5 className="text-sm font-medium">AVIF Support</h5>
                          <p className="text-xs text-muted-foreground">Enable AVIF image format</p>
                        </div>
                        <Switch defaultChecked={false} />
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible className="border rounded-lg overflow-hidden">
                  <CollapsibleTrigger className="flex w-full items-center justify-between p-4">
                    <div className="flex items-center gap-2">
                      <File className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">File Management</h4>
                        <p className="text-xs text-muted-foreground">Configure file types and limits</p>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-4 pb-4 pt-0 border-t">
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">Allowed File Types</h5>
                        <Input defaultValue="jpg, jpeg, png, gif, webp, pdf, doc, docx, xls, xlsx" />
                      </div>
                      
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">Max File Size</h5>
                        <Select defaultValue="10">
                          <SelectTrigger>
                            <SelectValue placeholder="Select max file size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 MB</SelectItem>
                            <SelectItem value="10">10 MB</SelectItem>
                            <SelectItem value="25">25 MB</SelectItem>
                            <SelectItem value="50">50 MB</SelectItem>
                            <SelectItem value="100">100 MB</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Collapsible className="border rounded-lg overflow-hidden">
                  <CollapsibleTrigger className="flex w-full items-center justify-between p-4">
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">Geographic Access</h4>
                        <p className="text-xs text-muted-foreground">Control file access by location</p>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-4 pb-4 pt-0 border-t">
                    <div className="space-y-4 mt-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h5 className="text-sm font-medium">Geo-Restriction</h5>
                          <p className="text-xs text-muted-foreground">Restrict access by country</p>
                        </div>
                        <Switch defaultChecked={false} />
                      </div>
                      
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">Allowed Countries</h5>
                        <Input defaultValue="US, CA, EU" disabled />
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible className="border rounded-lg overflow-hidden">
                  <CollapsibleTrigger className="flex w-full items-center justify-between p-4">
                    <div className="flex items-center gap-2">
                      <Link className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">Access Control</h4>
                        <p className="text-xs text-muted-foreground">Configure access permissions</p>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-4 pb-4 pt-0 border-t">
                    <div className="space-y-4 mt-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h5 className="text-sm font-medium">Signed URLs</h5>
                          <p className="text-xs text-muted-foreground">Generate expiring signed URLs</p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>
                      
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">Default URL Expiration</h5>
                        <Select defaultValue="24">
                          <SelectTrigger>
                            <SelectValue placeholder="Select expiration time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 hour</SelectItem>
                            <SelectItem value="6">6 hours</SelectItem>
                            <SelectItem value="24">24 hours</SelectItem>
                            <SelectItem value="168">7 days</SelectItem>
                            <SelectItem value="720">30 days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </CardContent>
          </Card>

          {/* Storage Usage Card */}
          <Card>
            <CardHeader>
              <CardTitle>Storage Usage</CardTitle>
              <CardDescription>
                View current storage usage and statistics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                  <Image className="h-8 w-8 text-primary mb-2" />
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Images</div>
                </div>
                
                <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                  <File className="h-8 w-8 text-primary mb-2" />
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Documents</div>
                </div>
                
                <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                  <HardDrive className="h-8 w-8 text-primary mb-2" />
                  <div className="text-2xl font-bold">0 MB</div>
                  <div className="text-sm text-muted-foreground">Total Storage</div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 pt-4">
                <Button variant="outline" className="flex gap-2" disabled={!form.watch("enabled")}>
                  <Upload className="h-4 w-4" />
                  Upload Test File
                </Button>
                
                <Button variant="outline" className="flex gap-2" disabled={!form.watch("enabled")}>
                  <Download className="h-4 w-4" />
                  Download Test File
                </Button>
                
                <Button variant="outline" className="flex gap-2" disabled={!form.watch("enabled")}>
                  <RefreshCw className="h-4 w-4" />
                  Refresh Stats
                </Button>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="flex gap-2">
            <Save className="h-4 w-4" />
            Save Storage Settings
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default StorageSettings;

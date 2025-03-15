
import React, { useState } from "react";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  AlertCircle, CheckCircle2, Cloud, Image, File, Save, 
  TestTube, LockKeyhole, Upload, Download, Loader2
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

const storageConfigSchema = z.object({
  enabled: z.boolean(),
  provider: z.enum(["cloudflare"]),
  accountId: z.string().min(1, "Account ID is required"),
  accessKeyId: z.string().min(1, "Access Key ID is required"),
  secretAccessKey: z.string().min(1, "Secret Access Key is required"),
  bucket: z.string().min(1, "Bucket name is required"),
  region: z.string().min(1, "Region is required"),
  useCustomDomain: z.boolean(),
  customDomain: z.string().optional(),
  cacheControl: z.string(),
});

type StorageConfigForm = z.infer<typeof storageConfigSchema>;

const StorageSettings = () => {
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<null | 'success' | 'error'>(null);

  const form = useForm<StorageConfigForm>({
    resolver: zodResolver(storageConfigSchema),
    defaultValues: {
      enabled: false,
      provider: "cloudflare",
      accountId: "",
      accessKeyId: "",
      secretAccessKey: "",
      bucket: "",
      region: "auto",
      useCustomDomain: false,
      customDomain: "",
      cacheControl: "public, max-age=31536000",
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Storage Settings</h2>
        <p className="text-muted-foreground">Configure Cloudflare R2 for file storage</p>
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
                Connect to Cloudflare R2 for property images and document storage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Your R2 credentials are sensitive. Never share them publicly or include them in client-side code.
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
                          Enable file storage via Cloudflare R2
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
                  name="provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Storage Provider</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a storage provider" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cloudflare">Cloudflare R2</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Currently only Cloudflare R2 is supported
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid gap-4 pt-4">
                <FormField
                  control={form.control}
                  name="accountId"
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
                    name="accessKeyId"
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
                    name="secretAccessKey"
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
                    name="bucket"
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
                    name="region"
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
              
              <div className="pt-4">
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
                          Serve files from a custom domain instead of the R2 endpoint
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
                      <FormItem className="mt-4">
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
              </div>
              
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
              
              <div className="flex justify-between items-center pt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={testConnection}
                  disabled={testingConnection || !form.watch("accessKeyId") || !form.watch("secretAccessKey") || !form.watch("bucket")}
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
                  <Cloud className="h-8 w-8 text-primary mb-2" />
                  <div className="text-2xl font-bold">0 MB</div>
                  <div className="text-sm text-muted-foreground">Total Storage</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <Button variant="outline" className="flex gap-2" disabled={!form.watch("enabled")}>
                  <Upload className="h-4 w-4" />
                  Upload Test File
                </Button>
                
                <Button variant="outline" className="flex gap-2" disabled={!form.watch("enabled")}>
                  <Download className="h-4 w-4" />
                  Download Test File
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

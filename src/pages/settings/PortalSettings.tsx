
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { portalSettingsSchema, PortalSettingsFormValues } from "@/types/customer";

// Default settings
const defaultSettings: PortalSettingsFormValues = {
  timezone: "America/New_York",
  dateFormat: "MM/DD/YYYY",
  timeFormat: "12h",
  currency: "USD",
  primaryColor: "#0f172a",
  secondaryColor: "#64748b",
  accentColor: "#2563eb",
  textColor: "#1e293b",
  backgroundColor: "#ffffff",
  borderRadius: "medium",
  cardStyle: "raised",
  sidebarStyle: "default",
  defaultLanguage: "en-US",
  pageSize: 10,
};

const PortalSettings = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PortalSettingsFormValues>({
    resolver: zodResolver(portalSettingsSchema),
    defaultValues: defaultSettings,
  });

  const onSubmit = async (data: PortalSettingsFormValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would save to an API
      console.log("Saving portal settings:", data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Portal settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save portal settings");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Portal Settings</h2>
        <p className="text-muted-foreground">Customize your portal's appearance and behavior</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="layout">Layout</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>
            
            {/* General Tab */}
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Regional Settings</CardTitle>
                  <CardDescription>
                    Configure timezone, date format, and currency
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timezone</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                            <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                            <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                            <SelectItem value="Europe/London">London (GMT)</SelectItem>
                            <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                            <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Determines how dates and times are displayed
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dateFormat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date Format</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select date format" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                            <SelectItem value="MMM DD, YYYY">MMM DD, YYYY</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Format for displaying dates
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="timeFormat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Format</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time format" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                            <SelectItem value="24h">24-hour</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Format for displaying times
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USD">US Dollar ($)</SelectItem>
                            <SelectItem value="EUR">Euro (€)</SelectItem>
                            <SelectItem value="GBP">British Pound (£)</SelectItem>
                            <SelectItem value="CAD">Canadian Dollar (C$)</SelectItem>
                            <SelectItem value="AUD">Australian Dollar (A$)</SelectItem>
                            <SelectItem value="JPY">Japanese Yen (¥)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Currency for displaying monetary values
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Appearance Tab */}
            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Theme Colors</CardTitle>
                  <CardDescription>
                    Customize the colors for your portal
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="primaryColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Color</FormLabel>
                          <div className="flex items-center gap-2">
                            <FormControl>
                              <Input {...field} type="text" />
                            </FormControl>
                            <Input 
                              type="color" 
                              value={field.value}
                              onChange={(e) => field.onChange(e.target.value)}
                              className="w-10 h-10 p-1 rounded-md"
                            />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="secondaryColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Secondary Color</FormLabel>
                          <div className="flex items-center gap-2">
                            <FormControl>
                              <Input {...field} type="text" />
                            </FormControl>
                            <Input 
                              type="color" 
                              value={field.value}
                              onChange={(e) => field.onChange(e.target.value)}
                              className="w-10 h-10 p-1 rounded-md"
                            />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="accentColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Accent Color</FormLabel>
                          <div className="flex items-center gap-2">
                            <FormControl>
                              <Input {...field} type="text" />
                            </FormControl>
                            <Input 
                              type="color" 
                              value={field.value}
                              onChange={(e) => field.onChange(e.target.value)}
                              className="w-10 h-10 p-1 rounded-md"
                            />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="textColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Text Color</FormLabel>
                          <div className="flex items-center gap-2">
                            <FormControl>
                              <Input {...field} type="text" />
                            </FormControl>
                            <Input 
                              type="color" 
                              value={field.value}
                              onChange={(e) => field.onChange(e.target.value)}
                              className="w-10 h-10 p-1 rounded-md"
                            />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="backgroundColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Background Color</FormLabel>
                          <div className="flex items-center gap-2">
                            <FormControl>
                              <Input {...field} type="text" />
                            </FormControl>
                            <Input 
                              type="color" 
                              value={field.value}
                              onChange={(e) => field.onChange(e.target.value)}
                              className="w-10 h-10 p-1 rounded-md"
                            />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="mt-6 p-4 rounded-md" style={{
                    background: form.watch('backgroundColor'),
                    color: form.watch('textColor'),
                    border: `1px solid ${form.watch('secondaryColor')}`,
                    borderRadius: '0.5rem'
                  }}>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: form.watch('primaryColor') }}>
                      Preview of Theme Colors
                    </h3>
                    <p className="mb-2">This is how your text will appear.</p>
                    <Button 
                      type="button" 
                      className="mr-2" 
                      style={{ 
                        backgroundColor: form.watch('primaryColor'),
                        color: '#ffffff'
                      }}
                    >
                      Primary Button
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      style={{ 
                        borderColor: form.watch('accentColor'),
                        color: form.watch('accentColor')
                      }}
                    >
                      Accent Button
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Layout Tab */}
            <TabsContent value="layout" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>UI Style Settings</CardTitle>
                  <CardDescription>
                    Configure the look and feel of UI elements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="borderRadius"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Border Radius</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select border radius" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None (0px)</SelectItem>
                            <SelectItem value="small">Small (4px)</SelectItem>
                            <SelectItem value="medium">Medium (8px)</SelectItem>
                            <SelectItem value="large">Large (12px)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Controls the roundness of UI elements
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cardStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Card Style</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select card style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="flat">Flat</SelectItem>
                            <SelectItem value="raised">Raised (with shadow)</SelectItem>
                            <SelectItem value="outlined">Outlined</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Style for card elements throughout the app
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="sidebarStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sidebar Style</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select sidebar style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="default">Default</SelectItem>
                            <SelectItem value="minimal">Minimal</SelectItem>
                            <SelectItem value="colored">Colored</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Appearance of the navigation sidebar
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-4 border rounded-${form.watch('borderRadius')} ${
                      form.watch('cardStyle') === 'flat' ? '' : 
                      form.watch('cardStyle') === 'raised' ? 'shadow-md' : 'border-2'
                    }`}>
                      <h4 className="font-medium mb-2">Card Preview</h4>
                      <p className="text-sm text-muted-foreground">This shows how cards will appear</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* System Tab */}
            <TabsContent value="system" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>
                    Configure global system settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="defaultLanguage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Language</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="en-US">English (US)</SelectItem>
                            <SelectItem value="en-GB">English (UK)</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                            <SelectItem value="pt">Portuguese</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Primary language for the portal
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="pageSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Page Size</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={5} 
                            max={100} 
                            {...field} 
                            onChange={e => field.onChange(Number(e.target.value))} 
                          />
                        </FormControl>
                        <FormDescription>
                          Number of items to show per page in lists
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PortalSettings;

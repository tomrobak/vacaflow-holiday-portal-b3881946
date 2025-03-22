
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, Send, FileText, SmartphoneIcon, Tag, Plus, Trash2, Edit, Copy, Search } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SmsTemplate, SmsTemplateFormValues, TwilioSettings } from "@/types/sms";

// Mock data for templates
const mockTemplates: SmsTemplate[] = [
  { 
    id: "1", 
    name: "Welcome Message", 
    content: "Welcome to our property! We're excited to host you.", 
    tags: ["welcome", "new-booking"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10)
  },
  { 
    id: "2", 
    name: "Payment Reminder", 
    content: "This is a friendly reminder that your payment is due soon.", 
    tags: ["payment", "reminder"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5)
  },
  { 
    id: "3", 
    name: "Booking Confirmation", 
    content: "Your booking has been confirmed. We look forward to hosting you!", 
    tags: ["booking", "confirmation"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
  },
  { 
    id: "4", 
    name: "Check-in Instructions", 
    content: "Here are the check-in instructions for your upcoming stay...", 
    tags: ["check-in", "instructions"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1)
  },
  { 
    id: "5", 
    name: "Check-out Reminder", 
    content: "Just a reminder that check-out time is at 11:00 AM tomorrow.", 
    tags: ["check-out", "reminder"],
    createdAt: new Date()
  },
];

const twilioFormSchema = z.object({
  accountSid: z.string().min(1, "Account SID is required"),
  authToken: z.string().min(1, "Auth Token is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  enabled: z.boolean(),
  defaultMessage: z.string().optional(),
});

const templateFormSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  content: z.string().min(1, "Template content is required"),
  tags: z.array(z.string()).optional().default([]),
});

type TwilioFormValues = z.infer<typeof twilioFormSchema>;

const SmsSettings = () => {
  // General state
  const [activeTab, setActiveTab] = useState("settings");
  const [isTesting, setIsTesting] = useState(false);
  const [testPhone, setTestPhone] = useState("");
  
  // Templates state
  const [templates, setTemplates] = useState<SmsTemplate[]>(mockTemplates);
  const [searchTerm, setSearchTerm] = useState("");
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<SmsTemplate | null>(null);
  const [newTag, setNewTag] = useState("");

  // Filter templates based on search
  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

  const templateForm = useForm<SmsTemplateFormValues>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      name: "",
      content: "",
      tags: [],
    },
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

  const resetTemplateForm = () => {
    templateForm.reset({
      name: "",
      content: "",
      tags: [],
    });
    setCurrentTemplate(null);
  };

  const openNewTemplateDialog = () => {
    resetTemplateForm();
    setShowTemplateDialog(true);
  };

  const editTemplate = (template: SmsTemplate) => {
    setCurrentTemplate(template);
    templateForm.reset({
      name: template.name,
      content: template.content,
      tags: template.tags,
    });
    setShowTemplateDialog(true);
  };

  const deleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId));
    toast.success("Template deleted successfully");
  };

  const addTag = () => {
    if (!newTag.trim()) return;
    
    const currentTags = templateForm.getValues("tags") || [];
    if (!currentTags.includes(newTag.trim())) {
      templateForm.setValue("tags", [...currentTags, newTag.trim()]);
    }
    setNewTag("");
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = templateForm.getValues("tags") || [];
    templateForm.setValue("tags", currentTags.filter(tag => tag !== tagToRemove));
  };

  const onTemplateSubmit = (data: SmsTemplateFormValues) => {
    if (currentTemplate) {
      // Update existing template
      setTemplates(templates.map(t => 
        t.id === currentTemplate.id 
          ? { ...t, ...data, tags: data.tags || [] } 
          : t
      ));
      toast.success("Template updated successfully");
    } else {
      // Create new template
      const newTemplate: SmsTemplate = {
        id: `template-${Date.now()}`,
        name: data.name,
        content: data.content,
        tags: data.tags || [],
        createdAt: new Date(),
      };
      setTemplates([...templates, newTemplate]);
      toast.success("Template created successfully");
    }
    
    setShowTemplateDialog(false);
    resetTemplateForm();
  };

  const duplicateTemplate = (template: SmsTemplate) => {
    const duplicatedTemplate: SmsTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} (Copy)`,
      createdAt: new Date(),
    };
    setTemplates([...templates, duplicatedTemplate]);
    toast.success("Template duplicated successfully");
  };

  // Format date helper
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">SMS Settings</h2>
        <p className="text-muted-foreground">Configure your Twilio SMS integration</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="settings" className="flex-1">
            General Settings
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex-1">
            Templates
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings" className="mt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Twilio Configuration</CardTitle>
                  <CardDescription>
                    Enter your Twilio credentials to enable SMS messaging
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  </div>

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
                <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between">
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <Input
                      placeholder="Test phone number"
                      className="w-full sm:w-[200px]"
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
                  <Button type="submit" className="w-full sm:w-auto">
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </TabsContent>
        
        <TabsContent value="templates" className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search templates..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={openNewTemplateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              New Template
            </Button>
          </div>

          {filteredTemplates.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="flex flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>
                      Created on {formatDate(template.createdAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="rounded-md bg-muted p-3 text-sm mb-3 max-h-[120px] overflow-auto">
                      {template.content}
                    </div>
                    {template.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {template.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            <Tag className="mr-1 h-3 w-3" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2 pt-0">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => duplicateTemplate(template)}
                      title="Duplicate"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => editTemplate(template)}
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => deleteTemplate(template.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="py-12">
              <div className="flex flex-col items-center justify-center text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No templates found</h3>
                <p className="text-sm text-muted-foreground max-w-xs mt-1">
                  {searchTerm ? "Try adjusting your search" : "Create your first template to get started"}
                </p>
                {!searchTerm && (
                  <Button className="mt-4" onClick={openNewTemplateDialog}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Template
                  </Button>
                )}
              </div>
            </Card>
          )}

          {/* Template Creation/Edit Dialog */}
          <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {currentTemplate ? "Edit Template" : "Create Template"}
                </DialogTitle>
                <DialogDescription>
                  {currentTemplate 
                    ? "Update your SMS template details" 
                    : "Create a new SMS template for quick messaging"}
                </DialogDescription>
              </DialogHeader>
              
              <Form {...templateForm}>
                <form onSubmit={templateForm.handleSubmit(onTemplateSubmit)} className="space-y-6">
                  <FormField
                    control={templateForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Template Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter template name" {...field} />
                        </FormControl>
                        <FormDescription>
                          A descriptive name to identify this template
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={templateForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message Content</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter the template content"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The content of your SMS message
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div>
                    <FormLabel>Tags</FormLabel>
                    <div className="flex mt-2 mb-2">
                      <Input
                        placeholder="Add a tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        className="mr-2"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={addTag}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormDescription>
                      Tags help you organize and filter templates
                    </FormDescription>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {templateForm.watch("tags")?.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {tag}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-3 w-3 rounded-full p-0 ml-1"
                            onClick={() => removeTag(tag)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowTemplateDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      {currentTemplate ? "Update Template" : "Create Template"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmsSettings;

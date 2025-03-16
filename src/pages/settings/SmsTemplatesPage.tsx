
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  FileText, 
  Plus, 
  Save, 
  Search, 
  Tag, 
  Trash2, 
  Edit,
  Copy
} from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SmsTemplate, SmsTemplateFormValues } from "@/types/sms";

// Zod schema for template form validation
const templateFormSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  content: z.string().min(1, "Template content is required"),
  tags: z.array(z.string()).optional().default([]),
});

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

const SmsTemplatesPage = () => {
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

  // Form for template creation/editing
  const form = useForm<SmsTemplateFormValues>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      name: "",
      content: "",
      tags: [],
    },
  });

  const resetForm = () => {
    form.reset({
      name: "",
      content: "",
      tags: [],
    });
    setCurrentTemplate(null);
  };

  const openNewTemplateDialog = () => {
    resetForm();
    setShowTemplateDialog(true);
  };

  const editTemplate = (template: SmsTemplate) => {
    setCurrentTemplate(template);
    form.reset({
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
    
    const currentTags = form.getValues("tags") || [];
    if (!currentTags.includes(newTag.trim())) {
      form.setValue("tags", [...currentTags, newTag.trim()]);
    }
    setNewTag("");
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue("tags", currentTags.filter(tag => tag !== tagToRemove));
  };

  const onSubmit = (data: SmsTemplateFormValues) => {
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
    resetForm();
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
        <h2 className="text-2xl font-bold">SMS Templates</h2>
        <p className="text-muted-foreground">Create and manage SMS message templates</p>
      </div>

      <div className="flex items-center justify-between">
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
        <div className="grid gap-4 md:grid-cols-2">
          {filteredTemplates.map((template) => (
            <Card key={template.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <CardDescription>
                  Created on {formatDate(template.createdAt)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md bg-muted p-3 text-sm mb-3">
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
              <CardFooter className="flex justify-end space-x-2">
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
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
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
                control={form.control}
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
                  {form.watch("tags")?.map((tag) => (
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
    </div>
  );
};

export default SmsTemplatesPage;

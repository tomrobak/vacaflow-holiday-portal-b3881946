
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SendHorizonal, X, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SmsTemplate } from "@/types/sms";

const smsFormSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

type SmsFormValues = z.infer<typeof smsFormSchema>;

interface QuickSmsFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerName: string;
  customerPhone: string;
  customerId: string;
  onSend: (message: string) => void;
}

// Mock templates - in a real app, these would come from an API or context
const mockTemplates: SmsTemplate[] = [
  { 
    id: "1", 
    name: "Welcome Message", 
    content: "Welcome to our property! We're excited to host you.", 
    tags: ["welcome", "new-booking"],
    createdAt: new Date()
  },
  { 
    id: "2", 
    name: "Payment Reminder", 
    content: "This is a friendly reminder that your payment is due soon.", 
    tags: ["payment", "reminder"],
    createdAt: new Date()
  },
  { 
    id: "3", 
    name: "Booking Confirmation", 
    content: "Your booking has been confirmed. We look forward to hosting you!", 
    tags: ["booking", "confirmation"],
    createdAt: new Date()
  },
];

const QuickSmsForm = ({ 
  open, 
  onOpenChange, 
  customerName, 
  customerPhone,
  customerId,
  onSend 
}: QuickSmsFormProps) => {
  const [isSending, setIsSending] = useState(false);
  
  const form = useForm<SmsFormValues>({
    resolver: zodResolver(smsFormSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = (data: SmsFormValues) => {
    setIsSending(true);
    
    // In a real app, this would call an API to send the SMS
    setTimeout(() => {
      onSend(data.message);
      form.reset();
      setIsSending(false);
      onOpenChange(false);
      toast.success(`SMS sent to ${customerName}`);
    }, 1500);
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = mockTemplates.find(t => t.id === templateId);
    if (template) {
      form.setValue("message", template.content);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send SMS to {customerName}</DialogTitle>
          <DialogDescription>
            Send a quick SMS message to {customerPhone}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Use Template</label>
                <Select onValueChange={handleTemplateSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTemplates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Type your message here..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="text-sm text-muted-foreground">
                Character count: {form.watch("message")?.length || 0}
                {form.watch("message")?.length > 160 && 
                  ` (${Math.ceil((form.watch("message")?.length || 0) / 160)} SMS)`
                }
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSending}
              >
                {isSending ? "Sending..." : "Send SMS"}
                {!isSending && <SendHorizonal className="ml-2 h-4 w-4" />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default QuickSmsForm;

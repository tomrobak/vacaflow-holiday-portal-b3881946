
import { useState } from "react";
import { SendHorizonal, Plus, Users } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Customer {
  id: string;
  name: string;
  phone: string;
  [key: string]: any;
}

interface SmsTemplate {
  id: string;
  name: string;
  content: string;
}

interface SmsComposerProps {
  selectedCustomers: string[];
  selectedCustomersData: Customer[];
  messageText: string;
  setMessageText: (text: string) => void;
  handleSendSms: () => void;
  isSending: boolean;
  mockTemplates: SmsTemplate[];
  onBackToCustomers: () => void;
}

const SmsComposer = ({
  selectedCustomers,
  selectedCustomersData,
  messageText,
  setMessageText,
  handleSendSms,
  isSending,
  mockTemplates,
  onBackToCustomers
}: SmsComposerProps) => {
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleApplyTemplate = () => {
    if (selectedTemplate) {
      const template = mockTemplates.find(t => t.id === selectedTemplate);
      if (template) {
        setMessageText(template.content);
        setShowTemplateDialog(false);
        setSelectedTemplate(null);
      }
    }
  };

  if (selectedCustomers.length === 0) {
    return (
      <Card className="h-full">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No recipients selected</h3>
          <p className="text-sm text-muted-foreground max-w-xs text-center mt-1">
            Please select at least one recipient to send a message
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={onBackToCustomers}
          >
            Select Recipients
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Compose Message</CardTitle>
        <CardDescription>
          Create your SMS message
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-3 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">Recipients ({selectedCustomers.length})</h4>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBackToCustomers}
            >
              Edit
            </Button>
          </div>
          <ScrollArea className="h-20">
            <div className="flex flex-wrap gap-2">
              {selectedCustomersData.slice(0, 20).map(customer => (
                <Badge key={customer.id} variant="secondary">
                  {customer.name}
                </Badge>
              ))}
              {selectedCustomersData.length > 20 && (
                <Badge variant="outline">
                  +{selectedCustomersData.length - 20} more
                </Badge>
              )}
            </div>
          </ScrollArea>
        </div>

        <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Message</h4>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Use Template
              </Button>
            </DialogTrigger>
          </div>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Message Template</DialogTitle>
              <DialogDescription>
                Choose a template to quickly create your message
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Select
                value={selectedTemplate || ""}
                onValueChange={setSelectedTemplate}
              >
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

              {selectedTemplate && (
                <div className="p-3 bg-muted rounded-md text-sm">
                  {mockTemplates.find(t => t.id === selectedTemplate)?.content}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowTemplateDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleApplyTemplate}
                disabled={!selectedTemplate}
              >
                Apply Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Textarea
          placeholder="Type your message here..."
          className="min-h-[150px]"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />

        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>
            Character count: {messageText.length} 
            {messageText.length > 160 && ` (${Math.ceil(messageText.length / 160)} SMS)`}
          </span>
          <span>{selectedCustomers.length} recipient(s)</span>
        </div>
      </CardContent>
      <CardFooter className="border-t">
        <Button 
          className="w-full"
          disabled={!messageText.trim() || selectedCustomers.length === 0 || isSending}
          onClick={handleSendSms}
        >
          {isSending ? "Sending..." : "Send SMS"}
          {!isSending && <SendHorizonal className="ml-2 h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SmsComposer;

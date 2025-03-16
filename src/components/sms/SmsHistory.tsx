
import { useState } from "react";
import { SmsMessage } from "@/types/sms";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Copy
} from "lucide-react";
import { toast } from "sonner";

interface SmsHistoryProps {
  messages: SmsMessage[];
  customerId: string;
  onSendNew: () => void;
}

const SmsHistory = ({ messages, customerId, onSendNew }: SmsHistoryProps) => {
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);

  // Format date helper
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  const getStatusBadge = (status: 'sent' | 'delivered' | 'failed') => {
    switch (status) {
      case 'delivered':
        return (
          <Badge variant="default" className="bg-green-500 flex items-center">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Delivered
          </Badge>
        );
      case 'sent':
        return (
          <Badge variant="outline" className="flex items-center">
            <Clock className="mr-1 h-3 w-3" />
            Sent
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive" className="flex items-center">
            <XCircle className="mr-1 h-3 w-3" />
            Failed
          </Badge>
        );
      default:
        return null;
    }
  };

  const toggleMessage = (messageId: string) => {
    if (expandedMessage === messageId) {
      setExpandedMessage(null);
    } else {
      setExpandedMessage(messageId);
    }
  };

  const copyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Message copied to clipboard");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">SMS History</CardTitle>
            <CardDescription>
              Previous messages sent to this customer
            </CardDescription>
          </div>
          <Button onClick={onSendNew}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Send New Message
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {messages.length > 0 ? (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className="rounded-lg border overflow-hidden"
                >
                  <div 
                    className="p-4 flex justify-between items-center cursor-pointer hover:bg-muted/50"
                    onClick={() => toggleMessage(message.id)}
                  >
                    <div className="flex flex-col">
                      <div className="font-medium">
                        {formatDate(message.sentAt)}
                      </div>
                      <div className="text-sm text-muted-foreground truncate max-w-[400px]">
                        {message.content.substring(0, 60)}
                        {message.content.length > 60 && "..."}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(message.status)}
                      {expandedMessage === message.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                  
                  {expandedMessage === message.id && (
                    <div className="p-4 bg-muted/50 border-t relative">
                      <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                      <div className="flex justify-end mt-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => copyContent(message.content)}
                        >
                          <Copy className="mr-2 h-3 w-3" />
                          Copy
                        </Button>
                      </div>
                      {message.twilioMessageId && (
                        <div className="text-xs text-muted-foreground mt-2">
                          Message ID: {message.twilioMessageId}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No messages yet</h3>
            <p className="text-sm text-muted-foreground max-w-xs text-center mt-1">
              No SMS messages have been sent to this customer yet
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmsHistory;

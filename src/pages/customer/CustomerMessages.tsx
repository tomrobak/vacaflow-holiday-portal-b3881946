
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";

const CustomerMessages = () => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "msg-001",
      from: "system",
      name: "Vacaflow Support",
      message: "Welcome to Vacaflow! How can we help you today?",
      date: "2023-07-20T10:30:00",
      read: true
    },
    {
      id: "msg-002",
      from: "user",
      name: "Me",
      message: "I have a question about my upcoming booking at Beachside Villa.",
      date: "2023-07-20T10:35:00",
      read: true
    },
    {
      id: "msg-003",
      from: "system",
      name: "Vacaflow Support",
      message: "Of course! I can help you with that. What would you like to know about your booking?",
      date: "2023-07-20T10:37:00",
      read: false
    }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsg = {
      id: `msg-${messages.length + 1}`,
      from: "user",
      name: "Me",
      message: newMessage.trim(),
      date: new Date().toISOString(),
      read: true
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");
    toast.success("Message sent", {
      description: "Your message has been sent successfully.",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Messages</h1>
      </div>

      <Card className="h-[calc(100vh-12rem)]">
        <CardHeader>
          <CardTitle>Conversation</CardTitle>
          <CardDescription>Your conversation with Vacaflow Support</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4 h-[calc(100vh-20rem)] overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  msg.from === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {msg.from === "user" ? "ME" : "VS"}
                  </AvatarFallback>
                </Avatar>
                
                <div
                  className={`relative group max-w-[80%] ${
                    msg.from === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg ${
                      msg.from === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                  </div>
                  <div
                    className={`flex items-center gap-2 mt-1 text-xs text-muted-foreground ${
                      msg.from === "user" ? "justify-end" : ""
                    }`}
                  >
                    <span>{new Date(msg.date).toLocaleTimeString()}</span>
                    {!msg.read && msg.from === "system" && (
                      <Badge variant="secondary" className="h-5">New</Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter>
          <form onSubmit={handleSendMessage} className="flex w-full gap-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={!newMessage.trim()}>
              <Send className="h-4 w-4 mr-1" />
              Send
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CustomerMessages;


import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Loader2, SendHorizonal, TestTube } from "lucide-react";
import { toast } from "sonner";

const EmailConnectionTester = () => {
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<null | 'success' | 'error'>(null);
  const [testEmailAddress, setTestEmailAddress] = useState("");
  const [sendingTestEmail, setSendingTestEmail] = useState(false);

  const testConnection = () => {
    setTestingConnection(true);
    // Simulate API call
    setTimeout(() => {
      setTestingConnection(false);
      setConnectionStatus('success');
      toast.success("Email connection test successful");
    }, 2000);
  };

  const sendTestEmail = () => {
    if (!testEmailAddress) {
      toast.error("Please enter a test email address");
      return;
    }
    
    setSendingTestEmail(true);
    // Simulate API call
    setTimeout(() => {
      setSendingTestEmail(false);
      toast.success(`Test email sent to ${testEmailAddress}`);
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Email Configuration</CardTitle>
        <CardDescription>
          Test your email configuration by sending a test email
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="w-full sm:w-96">
            <Label htmlFor="test-email">Test Email Address</Label>
            <Input 
              id="test-email"
              type="email" 
              placeholder="your@email.com" 
              value={testEmailAddress}
              onChange={(e) => setTestEmailAddress(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="secondary"
              onClick={sendTestEmail}
              disabled={sendingTestEmail || !testEmailAddress}
              className="flex gap-2"
            >
              {sendingTestEmail ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <SendHorizonal className="h-4 w-4" />
                  Send Test Email
                </>
              )}
            </Button>
            
            <Button 
              type="button" 
              variant="outline"
              onClick={testConnection}
              disabled={testingConnection}
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
          </div>
        </div>
        
        {connectionStatus === 'success' && (
          <div className="flex items-center gap-2 text-green-600 pt-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>Connection verified</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailConnectionTester;

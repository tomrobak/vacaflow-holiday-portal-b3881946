
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Mail } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Import refactored components
import EmailProviderSelect from "@/components/settings/email/EmailProviderSelect";
import BasicEmailFields from "@/components/settings/email/BasicEmailFields";
import PostmarkConfig from "@/components/settings/email/PostmarkConfig";
import SmtpConfig from "@/components/settings/email/SmtpConfig";
import EmailConnectionTester from "@/components/settings/email/EmailConnectionTester";
import { emailConfigSchema, EmailConfigForm } from "@/components/settings/email/emailTypes";

const EmailSettings = () => {
  const form = useForm<EmailConfigForm>({
    resolver: zodResolver(emailConfigSchema),
    defaultValues: {
      provider: "postmark",
      fromEmail: "bookings@vacaflow.com",
      fromName: "Vacaflow Bookings",
      replyToEmail: "support@vacaflow.com",
      postmarkApiKey: "",
      smtpHost: "",
      smtpPort: "587",
      smtpUser: "",
      smtpPassword: "",
      smtpSecure: true,
    }
  });

  const onSubmit = (data: EmailConfigForm) => {
    console.log(data);
    toast.success("Email settings saved successfully");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Email Delivery Settings</h2>
        <p className="text-muted-foreground">Configure email delivery services for sending transactional emails</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Provider Configuration
              </CardTitle>
              <CardDescription>
                Configure how emails are sent from your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <EmailProviderSelect form={form} />
              <BasicEmailFields form={form} />
            </CardContent>
          </Card>

          {form.watch("provider") === "postmark" && (
            <PostmarkConfig form={form} />
          )}

          {form.watch("provider") === "smtp" && (
            <SmtpConfig form={form} />
          )}

          <EmailConnectionTester />

          <Button type="submit" className="flex gap-2">
            <Save className="h-4 w-4" />
            Save Email Settings
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EmailSettings;

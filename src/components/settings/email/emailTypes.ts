
import { z } from "zod";

export const emailConfigSchema = z.object({
  provider: z.enum(["postmark", "smtp"]),
  fromEmail: z.string().email("Must be a valid email address"),
  fromName: z.string().min(1, "From name is required"),
  replyToEmail: z.string().email("Must be a valid email address").optional(),
  
  // Postmark specific fields
  postmarkApiKey: z.string().optional(),
  
  // SMTP specific fields
  smtpHost: z.string().optional(),
  smtpPort: z.string().optional(),
  smtpUser: z.string().optional(),
  smtpPassword: z.string().optional(),
  smtpSecure: z.boolean().optional(),
});

export type EmailConfigForm = z.infer<typeof emailConfigSchema>;

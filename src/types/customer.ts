
import { z } from "zod";

// Customer form schema
export const customerFormSchema = z.object({
  // Basic Information
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  status: z.enum(["active", "inactive", "pending"]),
  type: z.enum(["individual", "business", "agent"]),
  
  // Address Information
  address: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  
  // Preferences
  preferredContactMethod: z.enum(["email", "phone", "sms"]).optional(),
  receiveMarketingEmails: z.boolean().default(false),
  receiveBookingUpdates: z.boolean().default(true),
  receivePaymentReminders: z.boolean().default(true),
  
  // Notes
  notes: z.string().optional(),
  
  // Custom Fields
  tags: z.array(z.string()).default([]),
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;

export interface Customer extends CustomerFormValues {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

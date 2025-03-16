
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

// Admin user schema
export const adminProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  confirmPassword: z.string().optional(),
  avatar: z.string().optional(),
}).refine((data) => {
  if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type AdminProfileFormValues = z.infer<typeof adminProfileSchema>;

// Portal settings schema
export const portalSettingsSchema = z.object({
  // General
  timezone: z.string(),
  dateFormat: z.string(),
  timeFormat: z.enum(["12h", "24h"]),
  currency: z.string(),
  
  // Theme
  primaryColor: z.string(),
  secondaryColor: z.string(),
  accentColor: z.string(),
  textColor: z.string(),
  backgroundColor: z.string(),
  
  // Layout
  borderRadius: z.enum(["none", "small", "medium", "large"]),
  cardStyle: z.enum(["flat", "raised", "outlined"]),
  sidebarStyle: z.enum(["default", "minimal", "colored"]),
  
  // System
  defaultLanguage: z.string(),
  pageSize: z.number().min(5).max(100),
});

export type PortalSettingsFormValues = z.infer<typeof portalSettingsSchema>;

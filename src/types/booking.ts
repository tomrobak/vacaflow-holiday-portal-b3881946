
import { z } from "zod";

export type BookingStatus = "confirmed" | "pending" | "cancelled" | "completed";

export interface Booking {
  id: string;
  propertyId: string;
  propertyName: string;
  customerId: string;
  customerName: string;
  startDate: Date;
  endDate: Date;
  totalAmount: number;
  amountPaid: number;
  status: BookingStatus;
  guestCount: number;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export const bookingFormSchema = z.object({
  propertyId: z.string().min(1, "Property is required"),
  customerId: z.string().min(1, "Customer is required"),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }).refine(date => date > new Date(), {
    message: "End date must be in the future",
  }),
  guestCount: z.number().min(1, "At least one guest is required"),
  status: z.enum(["confirmed", "pending", "cancelled", "completed"]),
  notes: z.string().optional(),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

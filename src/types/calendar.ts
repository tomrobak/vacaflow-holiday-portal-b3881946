
import { BookingStatus } from "@/types/booking";

export interface Property {
  id: string;
  name: string;
  location: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
}

export interface BookingEvent {
  id: string;
  propertyId: string;
  propertyName: string;
  customerId: string;
  customerName: string;
  startDate: Date;
  endDate: Date;
  status: BookingStatus;
  guestCount: number;
  totalAmount: number;
}


import { SmsMessage } from "@/types/sms";

export type CustomerStatus = "active" | "inactive" | "pending";

export interface CustomerBooking {
  id: string;
  propertyName: string;
  checkIn: Date;
  checkOut: Date;
  totalAmount: number;
  status: 'confirmed' | 'cancelled' | 'completed' | 'upcoming';
}

export interface CustomerPayment {
  id: string;
  date: Date;
  amount: number;
  method: string;
  status: 'successful' | 'pending' | 'failed';
  bookingId: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  status: CustomerStatus;
  totalBookings: number;
  totalSpent: number;
  lastBooking: Date | null;
  createdAt: Date;
  notes?: string;
  bookings: CustomerBooking[];
  payments: CustomerPayment[];
}

export const mockCustomer: Customer = {
  id: "CUST-1001",
  name: "John Smith",
  email: "john.smith@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main Street",
  city: "Miami",
  state: "Florida",
  zipCode: "33101",
  country: "United States",
  status: "active",
  totalBookings: 8,
  totalSpent: 6250.75,
  lastBooking: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365),
  notes: "Prefers beachfront properties. Allergic to pets. Often books for family vacations.",
  bookings: Array.from({ length: 8 }, (_, i) => ({
    id: `BOOK-${2000 + i}`,
    propertyName: `Beach Villa ${i + 1}`,
    checkIn: new Date(Date.now() - 1000 * 60 * 60 * 24 * (365 - i * 45)),
    checkOut: new Date(Date.now() - 1000 * 60 * 60 * 24 * (358 - i * 45)),
    totalAmount: 500 + Math.floor(Math.random() * 1000),
    status: ['confirmed', 'cancelled', 'completed', 'upcoming'][Math.floor(Math.random() * 4)] as 'confirmed' | 'cancelled' | 'completed' | 'upcoming',
  })),
  payments: Array.from({ length: 10 }, (_, i) => ({
    id: `PAY-${3000 + i}`,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * (365 - i * 36)),
    amount: 200 + Math.floor(Math.random() * 800),
    method: ['Credit Card', 'PayPal', 'Bank Transfer'][Math.floor(Math.random() * 3)],
    status: ['successful', 'pending', 'failed'][Math.floor(Math.random() * 3)] as 'successful' | 'pending' | 'failed',
    bookingId: `BOOK-${2000 + Math.floor(i / 2)}`,
  })),
};

export const mockSmsMessages: SmsMessage[] = [
  {
    id: "sms-1",
    customerId: "CUST-1001",
    content: "Your booking #BOOK-2005 has been confirmed for Beach Villa 6. Check-in date: May 15, 2023. We look forward to welcoming you!",
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    status: "delivered",
    twilioMessageId: "SM123456789",
  },
  {
    id: "sms-2",
    customerId: "CUST-1001",
    content: "Just a reminder that your payment of $750 for booking #BOOK-2006 is due tomorrow. Please let us know if you have any questions.",
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
    status: "delivered",
    twilioMessageId: "SM987654321",
  },
  {
    id: "sms-3",
    customerId: "CUST-1001",
    content: "Thanks for your stay at Beach Villa 7! We hope you enjoyed your visit. We'd appreciate it if you could leave a review of your experience.",
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    status: "sent",
    twilioMessageId: "SM567891234",
  },
  {
    id: "sms-4",
    customerId: "CUST-1001",
    content: "We noticed you have an upcoming booking (#BOOK-2007) at Beach Villa 8. Check-in instructions: Access code is 4321, park in space #8.",
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    status: "failed",
    twilioMessageId: "SM321654987",
  },
];

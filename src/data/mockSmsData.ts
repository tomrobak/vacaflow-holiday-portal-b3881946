
import { SmsFilter } from "@/types/sms";

export const mockCustomers = Array.from({ length: 50 }, (_, i) => ({
  id: `CUST-${1000 + i}`,
  name: [
    "John Smith", "Emma Johnson", "Michael Brown", "Olivia Davis", "William Wilson",
    "Sophia Martinez", "James Anderson", "Ava Taylor", "Benjamin Thomas", "Mia Hernandez"
  ][i % 10],
  email: `customer${i + 1}@example.com`,
  phone: `+1${Math.floor(Math.random() * 1000000000).toString().padStart(10, '0')}`,
  status: ["active", "inactive", "pending"][Math.floor(Math.random() * 3)],
  upcomingBooking: Math.random() > 0.6,
  pendingPayment: Math.random() > 0.7,
  pastBookings: Math.random() > 0.4,
  properties: Math.random() > 0.5 
    ? [`PROP-${500 + Math.floor(Math.random() * 10)}`] 
    : [],
  tags: ["VIP", "Frequent", "New", "Potential", "Returning"]
    .filter(() => Math.random() > 0.7)
}));

export const mockProperties = Array.from({ length: 10 }, (_, i) => ({
  id: `PROP-${500 + i}`,
  name: [
    "Beach Villa", "Mountain Cabin", "Downtown Apartment", "Lakeside Retreat", 
    "Country Cottage", "Luxury Penthouse", "Seaside Bungalow", "Forest Lodge",
    "Desert Oasis", "City Loft"
  ][i % 10]
}));

export const mockTemplates = [
  { id: "1", name: "Welcome Message", content: "Welcome to our property! We're excited to host you." },
  { id: "2", name: "Payment Reminder", content: "This is a friendly reminder that your payment is due soon." },
  { id: "3", name: "Booking Confirmation", content: "Your booking has been confirmed. We look forward to hosting you!" },
  { id: "4", name: "Check-in Instructions", content: "Here are the check-in instructions for your upcoming stay..." },
  { id: "5", name: "Check-out Reminder", content: "Just a reminder that check-out time is at 11:00 AM tomorrow." },
];

export const predefinedFilters: SmsFilter[] = [
  { type: 'all', label: 'All Customers' },
  { type: 'upcoming-bookings', label: 'Upcoming Bookings' },
  { type: 'pending-payment', label: 'Pending Payment' },
  { type: 'past-bookings', label: 'Past Bookings' },
];

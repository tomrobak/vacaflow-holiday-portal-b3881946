
export type PaymentStatus = 'successful' | 'pending' | 'failed' | 'refunded';
export type PaymentMethod = 'credit_card' | 'paypal' | 'bank_transfer' | 'cash';

export interface Payment {
  id: string;
  bookingId: string;
  customerId: string;
  propertyId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  date: Date;
  dueDate?: Date;
  transactionId?: string;
  receiptUrl?: string;
  notes?: string;
  refundAmount?: number;
  refundDate?: Date;
  refundReason?: string;
}

export interface PaymentFilter {
  status?: PaymentStatus;
  method?: PaymentMethod;
  startDate?: Date;
  endDate?: Date;
  customerId?: string;
  propertyId?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface PaymentStats {
  totalReceived: number;
  totalPending: number;
  totalRefunded: number;
  totalFailed: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  percentChange: number;
}

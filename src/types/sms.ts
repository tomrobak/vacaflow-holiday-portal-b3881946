
export interface TwilioSettings {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
  enabled: boolean;
  defaultMessage: string;
}

export interface SmsTemplate {
  id: string;
  name: string;
  content: string;
  tags: string[];
  createdAt: Date;
}

export interface SmsMessage {
  id: string;
  customerId: string;
  content: string;
  sentAt: Date;
  status: 'sent' | 'delivered' | 'failed';
  twilioMessageId?: string;
}

export interface SmsFilter {
  type: 'upcoming-bookings' | 'pending-payment' | 'past-bookings' | 'property' | 'tag' | 'all';
  value?: string;
  label: string;
}

export interface SmsTemplateFormValues {
  name: string;
  content: string;
  tags: string[];
}

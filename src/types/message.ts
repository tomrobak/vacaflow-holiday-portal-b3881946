
export type MessageStatus = 'read' | 'unread';
export type MessagePriority = 'low' | 'medium' | 'high';

export interface Message {
  id: string;
  customerId: string;
  propertyId?: string;
  bookingId?: string;
  subject: string;
  content: string;
  date: Date;
  status: MessageStatus;
  priority: MessagePriority;
  attachments?: string[];
  isArchived: boolean;
}

export interface MessageStats {
  totalMessages: number;
  unreadMessages: number;
  todayMessages: number;
  archivedMessages: number;
}

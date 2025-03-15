
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Archive,
  ArrowDown,
  ArrowUp,
  CheckCircle,
  Circle,
  Filter,
  Flag,
  Home,
  MessageCircle,
  MessageSquare,
  Plus,
  Search,
  Trash2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Message, MessagePriority, MessageStatus, MessageStats } from "@/types/message";
import { toast } from "sonner";

// Mock data - would be replaced with actual API calls in a real application
const mockMessages: Message[] = Array.from({ length: 20 }, (_, i) => ({
  id: `MSG-${5000 + i}`,
  customerId: `CUST-${1000 + Math.floor(Math.random() * 100)}`,
  propertyId: Math.random() > 0.3 ? `PROP-${500 + Math.floor(Math.random() * 50)}` : undefined,
  bookingId: Math.random() > 0.4 ? `BOOK-${2000 + Math.floor(Math.random() * 100)}` : undefined,
  subject: [
    "Question about booking",
    "Maintenance request",
    "Booking confirmation",
    "Payment inquiry",
    "Cancellation request",
    "Amenities question",
    "Early check-in request",
    "Late check-out request",
    "Special accommodation",
    "Feedback",
  ][Math.floor(Math.random() * 10)],
  content: [
    "I'm wondering if early check-in is possible for our stay next week.",
    "The shower in the master bathroom isn't draining properly.",
    "Could you confirm our booking details for the upcoming stay?",
    "I haven't received a receipt for my recent payment.",
    "Due to a change in plans, we need to cancel our reservation.",
    "Does the property have a pool or hot tub?",
    "Our flight arrives early. Is it possible to check in before the standard time?",
    "We have a late flight. Is late check-out an option?",
    "We'll be traveling with an infant. Do you provide a crib?",
    "We had a wonderful stay at your property. The views were amazing!",
  ][Math.floor(Math.random() * 10)],
  date: new Date(Date.now() - 1000 * 60 * 60 * 24 * Math.floor(Math.random() * 30)),
  status: Math.random() > 0.5 ? 'read' : 'unread',
  priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as MessagePriority,
  attachments: Math.random() > 0.7 ? [`file${i + 1}.pdf`] : undefined,
  isArchived: Math.random() > 0.8,
}));

const mockStats: MessageStats = {
  totalMessages: 187,
  unreadMessages: 26,
  todayMessages: 8,
  archivedMessages: 43,
};

const customerNames: Record<string, string> = {};
mockMessages.forEach(message => {
  const customerId = message.customerId;
  if (!customerNames[customerId]) {
    const firstNames = ["John", "Sarah", "Michael", "Emma", "David", "Olivia", "James", "Sophia"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia"];
    customerNames[customerId] = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  }
});

const propertyNames: Record<string, string> = {};
mockMessages.forEach(message => {
  if (message.propertyId) {
    const propertyId = message.propertyId;
    if (!propertyNames[propertyId]) {
      const propertyTypes = ["Beach House", "Mountain Cabin", "City Apartment", "Lakeside Villa", "Country Cottage"];
      const locations = ["Miami", "Aspen", "New York", "Lake Tahoe", "Napa Valley"];
      propertyNames[propertyId] = `${propertyTypes[Math.floor(Math.random() * propertyTypes.length)]} in ${locations[Math.floor(Math.random() * locations.length)]}`;
    }
  }
});

const Messages = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<keyof Message>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [showMessageDetail, setShowMessageDetail] = useState<string | null>(null);

  const handleSort = (field: keyof Message) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const getMessagePriorityBadge = (priority: MessagePriority) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive" className="ml-2">High</Badge>;
      case "medium":
        return <Badge variant="secondary" className="ml-2">Medium</Badge>;
      case "low":
        return <Badge variant="outline" className="ml-2">Low</Badge>;
      default:
        return null;
    }
  };

  const notifyMessageAction = (action: string, count: number = 1) => {
    const message = count === 1 
      ? `Message ${action} successfully` 
      : `${count} messages ${action} successfully`;
      
    toast.success(message);
  };

  const toggleSelectMessage = (id: string) => {
    setSelectedMessages(prev => 
      prev.includes(id) 
        ? prev.filter(messageId => messageId !== id)
        : [...prev, id]
    );
  };

  const selectAllMessages = () => {
    if (selectedMessages.length === filteredMessages.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(filteredMessages.map(message => message.id));
    }
  };

  const handleBulkAction = (action: 'mark-read' | 'mark-unread' | 'archive' | 'delete') => {
    if (selectedMessages.length === 0) return;
    
    const actionMap = {
      'mark-read': 'marked as read',
      'mark-unread': 'marked as unread',
      'archive': 'archived',
      'delete': 'deleted'
    };
    
    notifyMessageAction(actionMap[action], selectedMessages.length);
    // In a real app, we would update the messages in the database
    setSelectedMessages([]);
  };

  const handleViewMessage = (id: string) => {
    setShowMessageDetail(id);
    // In a real app, we would mark the message as read here
    const message = mockMessages.find(m => m.id === id);
    if (message && message.status === 'unread') {
      notifyMessageAction('marked as read');
    }
  };

  const handleMarkAsRead = (id: string) => {
    // In a real app, we would update the message in the database
    notifyMessageAction('marked as read');
  };

  const handleMarkAsUnread = (id: string) => {
    // In a real app, we would update the message in the database
    notifyMessageAction('marked as unread');
  };

  const handleArchive = (id: string) => {
    // In a real app, we would update the message in the database
    notifyMessageAction('archived');
  };

  const handleDelete = (id: string) => {
    // In a real app, we would update the message in the database
    notifyMessageAction('deleted');
  };

  const filteredMessages = useMemo(() => {
    return mockMessages
      .filter(message => {
        // Filter by status (all, read, unread, archived)
        if (statusFilter === 'read' && message.status !== 'read') return false;
        if (statusFilter === 'unread' && message.status !== 'unread') return false;
        if (statusFilter === 'archived' && !message.isArchived) return false;
        if (statusFilter === 'all' && message.isArchived) return false;
        
        // Filter by search term
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          const customerName = customerNames[message.customerId]?.toLowerCase() || '';
          const propertyName = message.propertyId ? propertyNames[message.propertyId]?.toLowerCase() || '' : '';
          
          if (
            !message.subject.toLowerCase().includes(searchLower) &&
            !message.content.toLowerCase().includes(searchLower) &&
            !customerName.includes(searchLower) &&
            !propertyName.includes(searchLower) &&
            !message.id.toLowerCase().includes(searchLower)
          ) {
            return false;
          }
        }
        
        return true;
      })
      .sort((a, b) => {
        const fieldA = a[sortField];
        const fieldB = b[sortField];
        
        if (fieldA === undefined) return sortDirection === 'asc' ? -1 : 1;
        if (fieldB === undefined) return sortDirection === 'asc' ? 1 : -1;
        
        if (fieldA instanceof Date && fieldB instanceof Date) {
          return sortDirection === 'asc' 
            ? fieldA.getTime() - fieldB.getTime() 
            : fieldB.getTime() - fieldA.getTime();
        }
        
        const strA = String(fieldA).toLowerCase();
        const strB = String(fieldB).toLowerCase();
        
        return sortDirection === 'asc' 
          ? strA.localeCompare(strB) 
          : strB.localeCompare(strA);
      });
  }, [mockMessages, searchTerm, statusFilter, sortField, sortDirection]);

  // Get the details of the selected message
  const selectedMessageDetails = useMemo(() => {
    if (!showMessageDetail) return null;
    return mockMessages.find(message => message.id === showMessageDetail);
  }, [showMessageDetail]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">Manage all customer communications</p>
        </div>
        
        <div className="flex flex-wrap md:flex-nowrap gap-2">
          <Button asChild>
            <Link to="/messages/new">
              <Plus className="mr-2 h-4 w-4" />
              New Message
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalMessages}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All messages in the system
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.unreadMessages}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Messages awaiting response
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.todayMessages}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Messages received today
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Archived</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.archivedMessages}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Messages stored in archive
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Messages List */}
        <div className={`flex-1 ${showMessageDetail ? 'lg:w-1/2' : 'w-full'}`}>
          <Tabs defaultValue="all" onValueChange={value => setStatusFilter(value)}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <TabsList className="flex-shrink-0">
                <TabsTrigger value="all">Inbox</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
                <TabsTrigger value="read">Read</TabsTrigger>
                <TabsTrigger value="archived">Archived</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <div className="relative flex-grow max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search messages..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Priorities</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSearchTerm('')}>Clear Filters</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <TabsContent value={statusFilter} className="m-0">
              <Card>
                <CardContent className="p-0">
                  {filteredMessages.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[30px]">
                              <input 
                                type="checkbox" 
                                className="h-4 w-4 rounded border-gray-300"
                                checked={filteredMessages.length > 0 && selectedMessages.length === filteredMessages.length}
                                onChange={selectAllMessages}
                              />
                            </TableHead>
                            <TableHead className="w-[80px]">Status</TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort('subject')}>
                              <div className="flex items-center">
                                Subject
                                {sortField === 'subject' && (
                                  sortDirection === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
                                )}
                              </div>
                            </TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort('date')}>
                              <div className="flex items-center">
                                Date
                                {sortField === 'date' && (
                                  sortDirection === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
                                )}
                              </div>
                            </TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredMessages.map((message) => (
                            <TableRow 
                              key={message.id} 
                              className={`cursor-pointer ${message.status === 'unread' ? 'font-medium' : ''}`}
                              onClick={() => handleViewMessage(message.id)}
                            >
                              <TableCell className="p-2" onClick={(e) => e.stopPropagation()}>
                                <input 
                                  type="checkbox" 
                                  className="h-4 w-4 rounded border-gray-300"
                                  checked={selectedMessages.includes(message.id)}
                                  onChange={() => toggleSelectMessage(message.id)}
                                />
                              </TableCell>
                              <TableCell>
                                {message.status === 'unread' ? (
                                  <Circle className="h-4 w-4 text-blue-500 fill-blue-500" />
                                ) : (
                                  <CheckCircle className="h-4 w-4 text-gray-400" />
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <span className="font-medium">{message.subject}</span>
                                  {getMessagePriorityBadge(message.priority)}
                                </div>
                                <p className="text-sm text-muted-foreground truncate max-w-[250px]">{message.content}</p>
                              </TableCell>
                              <TableCell>
                                <Button variant="link" className="p-0 h-auto" asChild>
                                  <Link 
                                    to={`/customers/${message.customerId}`} 
                                    className="flex items-center"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <User className="h-4 w-4 mr-1" />
                                    {customerNames[message.customerId]}
                                  </Link>
                                </Button>
                                {message.propertyId && (
                                  <div className="text-sm text-muted-foreground mt-1">
                                    <Button variant="link" className="p-0 h-auto text-sm" asChild>
                                      <Link 
                                        to={`/properties/${message.propertyId}`}
                                        className="flex items-center"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <Home className="h-3 w-3 mr-1" />
                                        {propertyNames[message.propertyId]}
                                      </Link>
                                    </Button>
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>{formatDate(message.date)}</TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <Button variant="ghost" size="icon">
                                      <MessageCircle className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {message.status === 'unread' ? (
                                      <DropdownMenuItem onClick={() => handleMarkAsRead(message.id)}>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Mark as Read
                                      </DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem onClick={() => handleMarkAsUnread(message.id)}>
                                        <Circle className="mr-2 h-4 w-4" />
                                        Mark as Unread
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={() => handleArchive(message.id)}>
                                      <Archive className="mr-2 h-4 w-4" />
                                      Archive
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      onClick={() => handleDelete(message.id)}
                                      className="text-red-500 focus:text-red-500"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="py-24 text-center">
                      <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">No messages found</h3>
                      <p className="text-muted-foreground">
                        {statusFilter === 'archived' 
                          ? "There are no archived messages"
                          : "No messages match your search criteria"}
                      </p>
                    </div>
                  )}
                  
                  {selectedMessages.length > 0 && (
                    <div className="p-4 bg-muted border-t flex items-center gap-2">
                      <span className="text-sm">{selectedMessages.length} selected</span>
                      <div className="flex items-center gap-2 ml-auto">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleBulkAction('mark-read')}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark Read
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleBulkAction('archive')}
                        >
                          <Archive className="mr-2 h-4 w-4" />
                          Archive
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleBulkAction('delete')}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Message Details Panel */}
        {showMessageDetail && selectedMessageDetails && (
          <div className="flex-1 lg:w-1/2">
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-xl">{selectedMessageDetails.subject}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    From: {customerNames[selectedMessageDetails.customerId]} • {formatDate(selectedMessageDetails.date)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setShowMessageDetail(null)}
                    className="h-8 w-8"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-medium">{customerNames[selectedMessageDetails.customerId]}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {selectedMessageDetails.priority === 'high' && (
                        <div className="flex items-center text-red-500">
                          <Flag className="h-3 w-3 mr-1" />
                          High Priority
                        </div>
                      )}
                      {selectedMessageDetails.propertyId && (
                        <div className="flex items-center">
                          <Home className="h-3 w-3 mr-1" />
                          {propertyNames[selectedMessageDetails.propertyId]}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="min-h-[300px]">
                  <p className="whitespace-pre-line">{selectedMessageDetails.content}</p>
                  
                  {selectedMessageDetails.attachments && selectedMessageDetails.attachments.length > 0 && (
                    <div className="mt-4 p-4 border rounded-md">
                      <h4 className="text-sm font-medium mb-2">Attachments:</h4>
                      <div className="flex gap-2">
                        {selectedMessageDetails.attachments.map(attachment => (
                          <div key={attachment} className="p-2 bg-secondary rounded text-sm flex items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                            {attachment}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="pt-4 border-t flex flex-wrap justify-between gap-2">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/customers/${selectedMessageDetails.customerId}`}>
                        <User className="mr-2 h-4 w-4" />
                        View Customer
                      </Link>
                    </Button>
                    {selectedMessageDetails.propertyId && (
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/properties/${selectedMessageDetails.propertyId}`}>
                          <Home className="mr-2 h-4 w-4" />
                          View Property
                        </Link>
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Reply
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;


import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import type { DateRange } from "react-day-picker";
import { 
  CreditCard, 
  Filter, 
  Plus, 
  Search, 
  ArrowUpDown, 
  ArrowDown, 
  ArrowUp,
  Download,
  DollarSign,
  Calendar,
  User,
  Home,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import { Payment, PaymentStatus, PaymentStats } from "@/types/payment";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { notifyPaymentExported, notifyPaymentStatus } from "@/utils/payment-notifications";

// Enhanced mock data with more realistic payments (100 items)
const mockPayments: Payment[] = (() => {
  const properties = [
    { id: "PROP-501", name: "Beachside Villa", location: "Miami" },
    { id: "PROP-502", name: "Mountain Cabin", location: "Aspen" },
    { id: "PROP-503", name: "City Apartment", location: "New York" },
    { id: "PROP-504", name: "Lakeside Cottage", location: "Lake Tahoe" },
    { id: "PROP-505", name: "Desert Oasis", location: "Phoenix" },
    { id: "PROP-506", name: "Country Farmhouse", location: "Vermont" },
    { id: "PROP-507", name: "Ski Chalet", location: "Colorado" },
    { id: "PROP-508", name: "Seaside Bungalow", location: "San Diego" },
    { id: "PROP-509", name: "Urban Loft", location: "Chicago" },
    { id: "PROP-510", name: "Historic Townhouse", location: "Boston" },
  ];

  const customers = [
    { id: "CUST-1001", name: "John Smith", email: "john.smith@example.com" },
    { id: "CUST-1002", name: "Sarah Johnson", email: "sarah.j@example.com" },
    { id: "CUST-1003", name: "Michael Brown", email: "m.brown@example.com" },
    { id: "CUST-1004", name: "Emma Wilson", email: "emma.w@example.com" },
    { id: "CUST-1005", name: "David Lee", email: "david.lee@example.com" },
    { id: "CUST-1006", name: "Olivia Martinez", email: "o.martinez@example.com" },
    { id: "CUST-1007", name: "James Garcia", email: "j.garcia@example.com" },
    { id: "CUST-1008", name: "Sophia Rodriguez", email: "s.rodriguez@example.com" },
    { id: "CUST-1009", name: "William Thompson", email: "w.thompson@example.com" },
    { id: "CUST-1010", name: "Ava Davis", email: "ava.davis@example.com" },
    { id: "CUST-1011", name: "Benjamin Clark", email: "b.clark@example.com" },
    { id: "CUST-1012", name: "Mia Lewis", email: "mia.l@example.com" },
    { id: "CUST-1013", name: "Alexander Hall", email: "alex.h@example.com" },
    { id: "CUST-1014", name: "Charlotte King", email: "charlotte.k@example.com" },
    { id: "CUST-1015", name: "Ethan Green", email: "e.green@example.com" },
  ];

  const bookings = Array.from({ length: 25 }, (_, i) => `BOOK-${2000 + i}`);
  const methods = ['credit_card', 'paypal', 'bank_transfer', 'cash'];
  const statuses: PaymentStatus[] = ['successful', 'pending', 'failed', 'refunded'];

  // Distribution of payment statuses (60% successful, 20% pending, 10% failed, 10% refunded)
  const getWeightedStatus = () => {
    const rand = Math.random();
    if (rand < 0.6) return statuses[0];
    if (rand < 0.8) return statuses[1];
    if (rand < 0.9) return statuses[2];
    return statuses[3];
  };

  return Array.from({ length: 100 }, (_, i) => {
    const status = getWeightedStatus();
    const date = new Date(Date.now() - 1000 * 60 * 60 * 24 * Math.floor(Math.random() * 180));
    const isRefunded = status === 'refunded';
    const property = properties[Math.floor(Math.random() * properties.length)];
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const amount = 200 + Math.floor(Math.random() * 1800);
    
    return {
      id: `PAY-${3000 + i}`,
      bookingId: bookings[Math.floor(Math.random() * bookings.length)],
      customerId: customer.id,
      propertyId: property.id,
      amount,
      currency: "USD",
      method: methods[Math.floor(Math.random() * methods.length)] as any,
      status,
      date,
      dueDate: status === 'pending' ? new Date(Date.now() + 1000 * 60 * 60 * 24 * Math.floor(Math.random() * 14 + 1)) : undefined,
      transactionId: status === 'successful' ? `TXN-${Math.floor(Math.random() * 10000000)}` : undefined,
      receiptUrl: status === 'successful' ? `https://receipts.example.com/${Math.floor(Math.random() * 100000)}` : undefined,
      notes: Math.random() > 0.7 ? `${["Regular payment", "High season rate", "Discount applied", "Includes cleaning fee", "Includes pet fee"][Math.floor(Math.random() * 5)]}` : undefined,
      refundAmount: isRefunded ? amount * (Math.random() * 0.3 + 0.7) : undefined,
      refundDate: isRefunded ? new Date(date.getTime() + 1000 * 60 * 60 * 24 * Math.floor(Math.random() * 14 + 1)) : undefined,
      refundReason: isRefunded ? ["Customer requested cancellation", "Service issue", "Double booking", "Property maintenance", "Weather conditions"][Math.floor(Math.random() * 5)] : undefined,
    };
  });
})();

// Build maps for customer and property names
const customerNames: Record<string, string> = {};
const propertyNames: Record<string, string> = {};

mockPayments.forEach(payment => {
  if (!customerNames[payment.customerId]) {
    const customerId = payment.customerId;
    customerNames[customerId] = mockPayments.find(p => p.customerId === customerId)?.customerId.includes("CUST-10") 
      ? ["John Smith", "Sarah Johnson", "Michael Brown", "Emma Wilson", "David Lee", 
         "Olivia Martinez", "James Garcia", "Sophia Rodriguez", "William Thompson", 
         "Ava Davis", "Benjamin Clark", "Mia Lewis", "Alexander Hall", "Charlotte King", 
         "Ethan Green"][parseInt(customerId.split("CUST-10")[1]) - 1] 
      : `Customer ${customerId.split("-")[1]}`;
  }
  
  if (!propertyNames[payment.propertyId]) {
    const propertyId = payment.propertyId;
    propertyNames[propertyId] = mockPayments.find(p => p.propertyId === propertyId)?.propertyId.includes("PROP-5") 
      ? ["Beachside Villa in Miami", "Mountain Cabin in Aspen", "City Apartment in New York", 
         "Lakeside Cottage in Lake Tahoe", "Desert Oasis in Phoenix", "Country Farmhouse in Vermont", 
         "Ski Chalet in Colorado", "Seaside Bungalow in San Diego", "Urban Loft in Chicago", 
         "Historic Townhouse in Boston"][parseInt(propertyId.split("PROP-5")[1]) - 1]
      : `Property ${propertyId.split("-")[1]}`;
  }
});

// Calculate enhanced statistics based on the data
const mockStats: PaymentStats = (() => {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;
  
  const paymentsThisMonth = mockPayments.filter(p => {
    const paymentDate = new Date(p.date);
    return paymentDate.getMonth() === thisMonth && paymentDate.getFullYear() === thisYear;
  });
  
  const paymentsLastMonth = mockPayments.filter(p => {
    const paymentDate = new Date(p.date);
    return paymentDate.getMonth() === lastMonth && paymentDate.getFullYear() === lastMonthYear;
  });

  const successfulPayments = mockPayments.filter(p => p.status === 'successful');
  const pendingPayments = mockPayments.filter(p => p.status === 'pending');
  const refundedPayments = mockPayments.filter(p => p.status === 'refunded');
  const failedPayments = mockPayments.filter(p => p.status === 'failed');

  const totalReceived = successfulPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalRefunded = refundedPayments.reduce((sum, p) => sum + (p.refundAmount || 0), 0);
  const totalFailed = failedPayments.reduce((sum, p) => sum + p.amount, 0);
  
  const revenueThisMonth = paymentsThisMonth
    .filter(p => p.status === 'successful')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const revenueLastMonth = paymentsLastMonth
    .filter(p => p.status === 'successful')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const percentChange = revenueLastMonth ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100 : 0;

  return {
    totalReceived,
    totalPending,
    totalRefunded,
    totalFailed,
    revenueThisMonth,
    revenueLastMonth,
    percentChange,
  };
})();

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<keyof Payment>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [dateRange, setDateRange] = useState<DateRange>({ from: new Date(), to: undefined });

  const handleSort = (field: keyof Payment) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getPaymentStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case "successful":
        return <Badge variant="default" className="bg-green-500">Successful</Badge>;
      case "pending":
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Pending</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "refunded":
        return <Badge variant="secondary">Refunded</Badge>;
      default:
        return null;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "credit_card":
        return <CreditCard className="h-4 w-4 mr-2" />;
      case "paypal":
        return <DollarSign className="h-4 w-4 mr-2" />;
      case "bank_transfer":
        return <ArrowUpDown className="h-4 w-4 mr-2" />;
      case "cash":
        return <DollarSign className="h-4 w-4 mr-2" />;
      default:
        return <CreditCard className="h-4 w-4 mr-2" />;
    }
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case "credit_card":
        return "Credit Card";
      case "paypal":
        return "PayPal";
      case "bank_transfer":
        return "Bank Transfer";
      case "cash":
        return "Cash";
      default:
        return method;
    }
  };

  const filteredPayments = useMemo(() => {
    return mockPayments
      .filter(payment => {
        if (statusFilter !== "all" && payment.status !== statusFilter) {
          return false;
        }
        
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          const customerName = customerNames[payment.customerId]?.toLowerCase() || '';
          const propertyName = propertyNames[payment.propertyId]?.toLowerCase() || '';
          if (
            !payment.id.toLowerCase().includes(searchLower) &&
            !payment.bookingId.toLowerCase().includes(searchLower) &&
            !customerName.includes(searchLower) &&
            !propertyName.includes(searchLower) &&
            !(payment.amount.toString().includes(searchLower))
          ) {
            return false;
          }
        }
        
        if (dateRange.from && payment.date < dateRange.from) {
          return false;
        }
        if (dateRange.to) {
          const toDateEnd = new Date(dateRange.to);
          toDateEnd.setHours(23, 59, 59, 999);
          if (payment.date > toDateEnd) {
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
        
        if (typeof fieldA === 'number' && typeof fieldB === 'number') {
          return sortDirection === 'asc' ? fieldA - fieldB : fieldB - fieldA;
        }
        
        const strA = String(fieldA).toLowerCase();
        const strB = String(fieldB).toLowerCase();
        
        return sortDirection === 'asc' 
          ? strA.localeCompare(strB) 
          : strB.localeCompare(strA);
      });
  }, [mockPayments, searchTerm, statusFilter, sortField, sortDirection, dateRange]);

  const formatPercentChange = (value: number) => {
    const formatted = Math.abs(value).toFixed(1) + '%';
    if (value > 0) {
      return (
        <div className="flex items-center text-green-500">
          <ArrowUp className="h-4 w-4 mr-1" />
          {formatted}
        </div>
      );
    } else if (value < 0) {
      return (
        <div className="flex items-center text-red-500">
          <ArrowDown className="h-4 w-4 mr-1" />
          {formatted}
        </div>
      );
    } else {
      return <span>{formatted}</span>;
    }
  };

  const handleExport = () => {
    notifyPaymentExported(filteredPayments.length);
  };

  const handleStatusChange = (payment: Payment, newStatus: PaymentStatus) => {
    notifyPaymentStatus({...payment, status: newStatus}, newStatus);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-muted-foreground">Manage and track all payment transactions</p>
        </div>
        
        <div className="flex flex-wrap md:flex-nowrap gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button asChild>
            <Link to="/payments/new">
              <Plus className="mr-2 h-4 w-4" />
              Record Payment
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Received</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockStats.totalReceived)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              From all successful payments
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockStats.totalPending)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting payment processing
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockStats.revenueThisMonth)}</div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center">
              vs {formatCurrency(mockStats.revenueLastMonth)} last month
              <span className="ml-1">{formatPercentChange(mockStats.percentChange)}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Refunded</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockStats.totalRefunded)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total amount refunded to customers
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" onValueChange={value => setStatusFilter(value)}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <TabsList className="flex-shrink-0">
            <TabsTrigger value="all">All Payments</TabsTrigger>
            <TabsTrigger value="successful">Successful</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
            <TabsTrigger value="refunded">Refunded</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="relative flex-grow max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search payments..."
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
                <div className="p-2">
                  <p className="text-sm font-medium mb-2">Date Range</p>
                  <DateRangePicker date={dateRange} onDateChange={setDateRange} />
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setDateRange({ from: undefined, to: undefined })}>Clear Filters</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <TabsContent value="all" className="m-0">
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('id')}>
                        <div className="flex items-center">
                          ID
                          {sortField === 'id' && (
                            sortDirection === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('date')}>
                        <div className="flex items-center">
                          Date
                          {sortField === 'date' && (
                            sortDirection === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('amount')}>
                        <div className="flex items-center">
                          Amount
                          {sortField === 'amount' && (
                            sortDirection === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.length > 0 ? (
                      filteredPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">{payment.id}</TableCell>
                          <TableCell>{formatDate(payment.date)}</TableCell>
                          <TableCell>
                            <Button variant="link" className="p-0 h-auto" asChild>
                              <Link to={`/customers/${payment.customerId}`} className="flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                {customerNames[payment.customerId]}
                              </Link>
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button variant="link" className="p-0 h-auto" asChild>
                              <Link to={`/properties/${payment.propertyId}`} className="flex items-center">
                                <Home className="h-4 w-4 mr-1" />
                                {propertyNames[payment.propertyId]}
                              </Link>
                            </Button>
                          </TableCell>
                          <TableCell>{formatCurrency(payment.amount)}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getPaymentMethodIcon(payment.method)}
                              {getPaymentMethodName(payment.method)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-auto p-0">
                                  {getPaymentStatusBadge(payment.status)}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleStatusChange(payment, "successful")}>
                                  Mark as Successful
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(payment, "pending")}>
                                  Mark as Pending
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(payment, "failed")}>
                                  Mark as Failed
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(payment, "refunded")}>
                                  Mark as Refunded
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" asChild>
                              <Link to={`/payments/${payment.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No payments found matching your filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payments;

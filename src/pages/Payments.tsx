
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
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
import { DateRange } from "@/components/ui/date-range-picker";

// Mock data for payments
const mockPayments: Payment[] = Array.from({ length: 20 }, (_, i) => ({
  id: `PAY-${3000 + i}`,
  bookingId: `BOOK-${2000 + Math.floor(Math.random() * 100)}`,
  customerId: `CUST-${1000 + Math.floor(Math.random() * 100)}`,
  propertyId: `PROP-${500 + Math.floor(Math.random() * 50)}`,
  amount: 200 + Math.floor(Math.random() * 800),
  currency: "USD",
  method: ['credit_card', 'paypal', 'bank_transfer', 'cash'][Math.floor(Math.random() * 4)] as any,
  status: ['successful', 'pending', 'failed', 'refunded'][Math.floor(Math.random() * 4)] as PaymentStatus,
  date: new Date(Date.now() - 1000 * 60 * 60 * 24 * Math.floor(Math.random() * 90)),
  dueDate: Math.random() > 0.5 ? new Date(Date.now() + 1000 * 60 * 60 * 24 * Math.floor(Math.random() * 30)) : undefined,
  transactionId: Math.random() > 0.3 ? `TXN-${Math.floor(Math.random() * 1000000)}` : undefined,
  receiptUrl: Math.random() > 0.5 ? `https://receipts.example.com/${Math.floor(Math.random() * 10000)}` : undefined,
  notes: Math.random() > 0.7 ? `Payment note ${i + 1}` : undefined,
  refundAmount: Math.random() > 0.8 ? Math.floor(Math.random() * 200) : undefined,
  refundDate: Math.random() > 0.8 ? new Date(Date.now() - 1000 * 60 * 60 * 24 * Math.floor(Math.random() * 30)) : undefined,
  refundReason: Math.random() > 0.8 ? "Customer requested refund" : undefined,
}));

// Mock data for stats
const mockStats: PaymentStats = {
  totalReceived: 42500.75,
  totalPending: 3750.25,
  totalRefunded: 1250.50,
  totalFailed: 750.00,
  revenueThisMonth: 12500.50,
  revenueLastMonth: 10750.25,
  percentChange: 16.28,
};

// Customer names for display
const customerNames: Record<string, string> = {};
mockPayments.forEach(payment => {
  const customerId = payment.customerId;
  if (!customerNames[customerId]) {
    const firstNames = ["John", "Sarah", "Michael", "Emma", "David", "Olivia", "James", "Sophia"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia"];
    customerNames[customerId] = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  }
});

// Property names for display
const propertyNames: Record<string, string> = {};
mockPayments.forEach(payment => {
  const propertyId = payment.propertyId;
  if (!propertyNames[propertyId]) {
    const propertyTypes = ["Beach House", "Mountain Cabin", "City Apartment", "Lakeside Villa", "Country Cottage"];
    const locations = ["Miami", "Aspen", "New York", "Lake Tahoe", "Napa Valley"];
    propertyNames[propertyId] = `${propertyTypes[Math.floor(Math.random() * propertyTypes.length)]} in ${locations[Math.floor(Math.random() * locations.length)]}`;
  }
});

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<keyof Payment>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  // Handle sorting
  const handleSort = (field: keyof Payment) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Format date
  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  // Payment status badge
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

  // Payment method icon
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

  // Get payment method display name
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

  // Filter and sort payments
  const filteredPayments = useMemo(() => {
    return mockPayments
      .filter(payment => {
        // Status filter
        if (statusFilter !== "all" && payment.status !== statusFilter) {
          return false;
        }
        
        // Text search
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
        
        // Date range filter
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

  // Format percentage change with arrow
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

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-muted-foreground">Manage and track all payment transactions</p>
        </div>
        
        <div className="flex flex-wrap md:flex-nowrap gap-2">
          <Button variant="outline" asChild>
            <Link to="/payments/reports">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Link>
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
                  <DateRange date={dateRange} onDateChange={setDateRange} />
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setDateRange({})}>Clear Filters</DropdownMenuItem>
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
                          <TableCell>{getPaymentStatusBadge(payment.status)}</TableCell>
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

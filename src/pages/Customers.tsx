
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  UserPlus,
  Filter, 
  MoreHorizontal,
  Mail,
  Phone,
  Eye,
  Edit,
  Calendar,
  CreditCard,
  Clock,
  Trash2,
  Download,
  Upload,
  CheckCircle2,
  XCircle,
  Clock2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Customer type definition with expanded fields
type CustomerStatus = "active" | "inactive" | "pending";
type CustomerType = "individual" | "business" | "agent";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  status: CustomerStatus;
  type: CustomerType;
  totalBookings: number;
  totalSpent: number;
  lastBooking: Date | null;
  nextBooking: Date | null;
  createdAt: Date;
  tags: string[];
  profileImageUrl?: string;
  outstandingPayments: number;
}

// Improved sample customer data
const generateCustomers = (count: number): Customer[] => {
  const tags = ['Frequent', 'VIP', 'Corporate', 'New', 'Late Payer', 'Group Bookings', 'Long-term', 'International'];
  
  return Array.from({ length: count }, (_, i) => {
    const randomTags = tags
      .filter(() => Math.random() > 0.7)
      .slice(0, Math.floor(Math.random() * 3));
      
    const type: CustomerType = Math.random() > 0.8 
      ? 'business' 
      : (Math.random() > 0.7 ? 'agent' : 'individual');
      
    const company = type !== 'individual' 
      ? `Company ${i + 1} ${type === 'agent' ? 'Travel' : 'Inc'}` 
      : undefined;
    
    return {
      id: `CUST-${1000 + i}`,
      name: `Customer ${i + 1}`,
      email: `customer${i + 1}@example.com`,
      phone: `+1 (555) ${100 + i}-${1000 + i}`,
      company,
      status: ["active", "inactive", "pending"][Math.floor(Math.random() * 3)] as CustomerStatus,
      type,
      totalBookings: Math.floor(Math.random() * 20),
      totalSpent: Math.floor(Math.random() * 10000),
      lastBooking: Math.random() > 0.2 ? new Date(Date.now() - Math.floor(Math.random() * 10000000000)) : null,
      nextBooking: Math.random() > 0.6 ? new Date(Date.now() + Math.floor(Math.random() * 10000000000)) : null,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
      tags: randomTags,
      outstandingPayments: Math.random() > 0.7 ? Math.floor(Math.random() * 1000) : 0,
    };
  });
};

const customers = generateCustomers(50);

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedStatus, setSelectedStatus] = useState<CustomerStatus | "all">("all");
  const [selectedType, setSelectedType] = useState<CustomerType | "all">("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isTagFilterOpen, setIsTagFilterOpen] = useState(false);
  const [sortField, setSortField] = useState<keyof Customer>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  const itemsPerPage = viewMode === "grid" ? 12 : 10;
  
  // All available tags from customers
  const allTags = Array.from(new Set(
    customers.flatMap(customer => customer.tags)
  )).sort();
  
  // Stats for dashboard view
  const customerStats = {
    total: customers.length,
    active: customers.filter(c => c.status === "active").length,
    inactive: customers.filter(c => c.status === "inactive").length,
    pending: customers.filter(c => c.status === "pending").length,
    individual: customers.filter(c => c.type === "individual").length,
    business: customers.filter(c => c.type === "business").length,
    agent: customers.filter(c => c.type === "agent").length,
    withUpcomingBookings: customers.filter(c => c.nextBooking !== null).length,
    withOutstandingPayments: customers.filter(c => c.outstandingPayments > 0).length,
  };
  
  // Filter customers based on all criteria
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.company && customer.company.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = selectedStatus === "all" || customer.status === selectedStatus;
    const matchesType = selectedType === "all" || customer.type === selectedType;
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => customer.tags.includes(tag));
    
    return matchesSearch && matchesStatus && matchesType && matchesTags;
  });
  
  // Sort customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    // Handle specific field types
    if (sortField === "lastBooking" || sortField === "nextBooking") {
      // Handle null dates
      if (!a[sortField] && !b[sortField]) return 0;
      if (!a[sortField]) return sortDirection === "asc" ? -1 : 1;
      if (!b[sortField]) return sortDirection === "asc" ? 1 : -1;
      
      // Compare dates
      return sortDirection === "asc" 
        ? (a[sortField] as Date).getTime() - (b[sortField] as Date).getTime()
        : (b[sortField] as Date).getTime() - (a[sortField] as Date).getTime();
    }
    
    // Handle string fields
    if (typeof a[sortField] === "string") {
      return sortDirection === "asc"
        ? (a[sortField] as string).localeCompare(b[sortField] as string)
        : (b[sortField] as string).localeCompare(a[sortField] as string);
    }
    
    // Handle number fields
    return sortDirection === "asc"
      ? (a[sortField] as number) - (b[sortField] as number)
      : (b[sortField] as number) - (a[sortField] as number);
  });
  
  // Paginate customers
  const paginatedCustomers = sortedCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const totalPages = Math.ceil(sortedCustomers.length / itemsPerPage);
  
  // Toggle customer selection
  const toggleCustomerSelection = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId)
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };
  
  // Toggle all customers on current page
  const toggleAllCustomers = () => {
    if (selectedCustomers.length === paginatedCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(paginatedCustomers.map(customer => customer.id));
    }
  };
  
  // Delete selected customers
  const deleteSelectedCustomers = () => {
    console.log(`Deleting customers: ${selectedCustomers.join(", ")}`);
    setSelectedCustomers([]);
    setIsDeleteDialogOpen(false);
  };
  
  // Export selected customers
  const exportSelectedCustomers = () => {
    console.log(`Exporting customers: ${selectedCustomers.join(", ")}`);
    // Implementation would generate CSV/Excel file for download
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Format date
  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  // Status badge
  const getStatusBadge = (status: CustomerStatus) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 hover:bg-green-600 flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" /> Active
        </Badge>;
      case "inactive":
        return <Badge variant="secondary" className="bg-gray-500 hover:bg-gray-600 flex items-center gap-1">
          <XCircle className="h-3 w-3" /> Inactive
        </Badge>;
      case "pending":
        return <Badge variant="outline" className="border-amber-500 text-amber-500 flex items-center gap-1">
          <Clock2 className="h-3 w-3" /> Pending
        </Badge>;
      default:
        return null;
    }
  };
  
  // Customer type badge
  const getTypeBadge = (type: CustomerType) => {
    switch (type) {
      case "individual":
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Individual</Badge>;
      case "business":
        return <Badge variant="outline" className="border-purple-500 text-purple-500">Business</Badge>;
      case "agent":
        return <Badge variant="outline" className="border-teal-500 text-teal-500">Travel Agent</Badge>;
      default:
        return null;
    }
  };
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Toggle sort
  const toggleSort = (field: keyof Customer) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  // Get sort indicator
  const getSortIndicator = (field: keyof Customer) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? " ↑" : " ↓";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">
            Manage your customer accounts and bookings
          </p>
        </div>
        <div className="flex space-x-2">
          <Button className="flex-shrink-0" asChild>
            <Link to="/customers/new">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Customer
            </Link>
          </Button>
          {selectedCustomers.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Bulk Actions ({selectedCustomers.length})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={exportSelectedCustomers}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Selected
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      
      <Separator />
      
      <Tabs defaultValue="customers" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="customers">All Customers</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        </TabsList>
        
        <TabsContent value="customers" className="space-y-6">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers by name, email, or ID..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-shrink-0">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Filter Customers</DialogTitle>
                    <DialogDescription>
                      Set filters to narrow down your customer list
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="col-span-2">
                        <label className="text-sm font-medium">Status</label>
                        <Select 
                          value={selectedStatus} 
                          onValueChange={(value) => setSelectedStatus(value as CustomerStatus | "all")}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="col-span-2">
                        <label className="text-sm font-medium">Type</label>
                        <Select 
                          value={selectedType} 
                          onValueChange={(value) => setSelectedType(value as CustomerType | "all")}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="individual">Individual</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="agent">Travel Agent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Tags</label>
                      <Popover open={isTagFilterOpen} onOpenChange={setIsTagFilterOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                          >
                            {selectedTags.length > 0
                              ? `${selectedTags.length} tag${selectedTags.length > 1 ? 's' : ''} selected`
                              : "Select tags"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Search tags..." />
                            <CommandList>
                              <CommandEmpty>No tags found</CommandEmpty>
                              <CommandGroup>
                                {allTags.map((tag) => (
                                  <CommandItem
                                    key={tag}
                                    onSelect={() => {
                                      setSelectedTags(prev =>
                                        prev.includes(tag)
                                          ? prev.filter(t => t !== tag)
                                          : [...prev, tag]
                                      );
                                    }}
                                  >
                                    <Checkbox
                                      checked={selectedTags.includes(tag)}
                                      className="mr-2"
                                    />
                                    {tag}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSelectedStatus("all");
                        setSelectedType("all");
                        setSelectedTags([]);
                      }}
                    >
                      Reset All
                    </Button>
                    <Button onClick={() => setIsFilterOpen(false)}>
                      Apply Filters
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <div className="flex border rounded-md overflow-hidden">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-none"
                  onClick={() => setViewMode("list")}
                >
                  List
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-none"
                  onClick={() => setViewMode("grid")}
                >
                  Grid
                </Button>
              </div>
              
              <Select
                value={`${sortField}-${sortDirection}`}
                onValueChange={(value) => {
                  const [field, direction] = value.split('-');
                  setSortField(field as keyof Customer);
                  setSortDirection(direction as 'asc' | 'desc');
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name A-Z</SelectItem>
                  <SelectItem value="name-desc">Name Z-A</SelectItem>
                  <SelectItem value="createdAt-desc">Newest First</SelectItem>
                  <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                  <SelectItem value="totalBookings-desc">Most Bookings</SelectItem>
                  <SelectItem value="totalSpent-desc">Highest Spend</SelectItem>
                  <SelectItem value="lastBooking-desc">Recent Bookings</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Filter pills */}
          {(selectedStatus !== "all" || selectedType !== "all" || selectedTags.length > 0) && (
            <div className="flex flex-wrap gap-2">
              {selectedStatus !== "all" && (
                <Badge variant="outline" className="flex items-center gap-1">
                  Status: {selectedStatus}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1"
                    onClick={() => setSelectedStatus("all")}
                  >
                    <XCircle className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              
              {selectedType !== "all" && (
                <Badge variant="outline" className="flex items-center gap-1">
                  Type: {selectedType}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1"
                    onClick={() => setSelectedType("all")}
                  >
                    <XCircle className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              
              {selectedTags.map(tag => (
                <Badge key={tag} variant="outline" className="flex items-center gap-1">
                  Tag: {tag}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1"
                    onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))}
                  >
                    <XCircle className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              
              <Button
                variant="ghost"
                size="sm"
                className="h-6"
                onClick={() => {
                  setSelectedStatus("all");
                  setSelectedType("all");
                  setSelectedTags([]);
                }}
              >
                Clear All
              </Button>
            </div>
          )}
          
          {/* List View */}
          {viewMode === "list" && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={
                          paginatedCustomers.length > 0 && 
                          selectedCustomers.length === paginatedCustomers.length
                        }
                        onCheckedChange={toggleAllCustomers}
                      />
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => toggleSort("name")}>
                      Customer {getSortIndicator("name")}
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => toggleSort("totalBookings")}>
                      Bookings {getSortIndicator("totalBookings")}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => toggleSort("totalSpent")}>
                      Spent {getSortIndicator("totalSpent")}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => toggleSort("lastBooking")}>
                      Last Activity {getSortIndicator("lastBooking")}
                    </TableHead>
                    <TableHead>Next Booking</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCustomers.length > 0 ? (
                    paginatedCustomers.map(customer => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedCustomers.includes(customer.id)}
                            onCheckedChange={() => toggleCustomerSelection(customer.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{customer.name}</div>
                              <div className="text-sm text-muted-foreground truncate w-36">{customer.email}</div>
                              {customer.company && (
                                <div className="text-sm text-muted-foreground">{customer.company}</div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(customer.status)}</TableCell>
                        <TableCell>{getTypeBadge(customer.type)}</TableCell>
                        <TableCell>{customer.totalBookings}</TableCell>
                        <TableCell>{formatCurrency(customer.totalSpent)}</TableCell>
                        <TableCell>{formatDate(customer.lastBooking)}</TableCell>
                        <TableCell>
                          {customer.nextBooking ? (
                            <div className="flex flex-col">
                              <span>{formatDate(customer.nextBooking)}</span>
                              {customer.outstandingPayments > 0 && (
                                <Badge variant="destructive" className="mt-1 w-fit">
                                  Outstanding: {formatCurrency(customer.outstandingPayments)}
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">None scheduled</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-48">
                            {customer.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link to={`/customers/${customer.id}`} className="cursor-pointer flex items-center">
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={`/customers/${customer.id}/edit`} className="cursor-pointer flex items-center">
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link to={`/customers/dashboard/${customer.id}`} className="cursor-pointer flex items-center">
                                  <CreditCard className="mr-2 h-4 w-4" />
                                  Customer Dashboard
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={`/bookings/new?customer=${customer.id}`} className="cursor-pointer flex items-center">
                                  <Calendar className="mr-2 h-4 w-4" />
                                  New Booking
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <a href={`mailto:${customer.email}`} className="cursor-pointer flex items-center">
                                  <Mail className="mr-2 h-4 w-4" />
                                  Email
                                </a>
                              </DropdownMenuItem>
                              {customer.phone && (
                                <DropdownMenuItem asChild>
                                  <a href={`tel:${customer.phone}`} className="cursor-pointer flex items-center">
                                    <Phone className="mr-2 h-4 w-4" />
                                    Call
                                  </a>
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                        No customers found. Try adjusting your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          
          {/* Grid View */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedCustomers.length > 0 ? (
                paginatedCustomers.map(customer => (
                  <Card key={customer.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                          <Checkbox 
                            checked={selectedCustomers.includes(customer.id)}
                            onCheckedChange={() => toggleCustomerSelection(customer.id)}
                            className="absolute top-2 left-2"
                          />
                          <Avatar className="ml-4">
                            <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{customer.name}</CardTitle>
                            <CardDescription>{customer.email}</CardDescription>
                            {customer.company && (
                              <p className="text-sm mt-1">{customer.company}</p>
                            )}
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/customers/${customer.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/customers/${customer.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <a href={`mailto:${customer.email}`}>
                                <Mail className="mr-2 h-4 w-4" />
                                Email
                              </a>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-1">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {getStatusBadge(customer.status)}
                        {getTypeBadge(customer.type)}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm mt-4">
                        <div>
                          <p className="text-muted-foreground">Total Bookings</p>
                          <p className="font-medium">{customer.totalBookings}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total Spent</p>
                          <p className="font-medium">{formatCurrency(customer.totalSpent)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Last Activity</p>
                          <p className="font-medium">{formatDate(customer.lastBooking)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Next Booking</p>
                          <p className="font-medium">{formatDate(customer.nextBooking)}</p>
                        </div>
                      </div>
                      
                      {customer.tags.length > 0 && (
                        <div className="mt-4">
                          <p className="text-muted-foreground text-sm mb-1">Tags</p>
                          <div className="flex flex-wrap gap-1">
                            {customer.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                    
                    <CardFooter className="flex justify-between bg-muted/30 border-t">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/customers/${customer.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Details
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/bookings/new?customer=${customer.id}`}>
                          <Calendar className="mr-2 h-4 w-4" />
                          New Booking
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 text-center py-12 text-muted-foreground border rounded-md">
                  No customers found. Try adjusting your filters.
                </div>
              )}
            </div>
          )}
          
          {filteredCustomers.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} results
              </div>
              
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum = i + 1;
                    
                    // Adjust page numbers for pagination with many pages
                    if (totalPages > 5) {
                      if (currentPage <= 3) {
                        // Show first 5 pages
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        // Show last 5 pages
                        pageNum = totalPages - 4 + i;
                      } else {
                        // Show current page and 2 pages on each side
                        pageNum = currentPage - 2 + i;
                      }
                    }
                    
                    if (pageNum > totalPages) return null;
                    
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          isActive={currentPage === pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink onClick={() => setCurrentPage(totalPages)}>
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{customerStats.total}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Active Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-500">{customerStats.active}</div>
                <p className="text-sm text-muted-foreground">
                  {Math.round((customerStats.active / customerStats.total) * 100)}% of total
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">With Upcoming Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-500">{customerStats.withUpcomingBookings}</div>
                <p className="text-sm text-muted-foreground">
                  {Math.round((customerStats.withUpcomingBookings / customerStats.total) * 100)}% of total
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Outstanding Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-500">{customerStats.withOutstandingPayments}</div>
                <p className="text-sm text-muted-foreground">
                  {Math.round((customerStats.withOutstandingPayments / customerStats.total) * 100)}% of total
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Status</CardTitle>
                <CardDescription>Overview of customer account statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 rounded-full bg-green-500"></div>
                      <span>Active</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{customerStats.active}</span>
                      <span className="text-muted-foreground">
                        ({Math.round((customerStats.active / customerStats.total) * 100)}%)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 rounded-full bg-gray-500"></div>
                      <span>Inactive</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{customerStats.inactive}</span>
                      <span className="text-muted-foreground">
                        ({Math.round((customerStats.inactive / customerStats.total) * 100)}%)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 rounded-full bg-amber-500"></div>
                      <span>Pending</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{customerStats.pending}</span>
                      <span className="text-muted-foreground">
                        ({Math.round((customerStats.pending / customerStats.total) * 100)}%)
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div className="flex h-full">
                    <div 
                      className="bg-green-500 h-full" 
                      style={{ width: `${(customerStats.active / customerStats.total) * 100}%` }}
                    ></div>
                    <div 
                      className="bg-gray-500 h-full" 
                      style={{ width: `${(customerStats.inactive / customerStats.total) * 100}%` }}
                    ></div>
                    <div 
                      className="bg-amber-500 h-full" 
                      style={{ width: `${(customerStats.pending / customerStats.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Customer Types</CardTitle>
                <CardDescription>Distribution of customer types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                      <span>Individual</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{customerStats.individual}</span>
                      <span className="text-muted-foreground">
                        ({Math.round((customerStats.individual / customerStats.total) * 100)}%)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 rounded-full bg-purple-500"></div>
                      <span>Business</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{customerStats.business}</span>
                      <span className="text-muted-foreground">
                        ({Math.round((customerStats.business / customerStats.total) * 100)}%)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 rounded-full bg-teal-500"></div>
                      <span>Travel Agent</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{customerStats.agent}</span>
                      <span className="text-muted-foreground">
                        ({Math.round((customerStats.agent / customerStats.total) * 100)}%)
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div className="flex h-full">
                    <div 
                      className="bg-blue-500 h-full" 
                      style={{ width: `${(customerStats.individual / customerStats.total) * 100}%` }}
                    ></div>
                    <div 
                      className="bg-purple-500 h-full" 
                      style={{ width: `${(customerStats.business / customerStats.total) * 100}%` }}
                    ></div>
                    <div 
                      className="bg-teal-500 h-full" 
                      style={{ width: `${(customerStats.agent / customerStats.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Customers</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedCustomers.length} selected customers? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteSelectedCustomers}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;

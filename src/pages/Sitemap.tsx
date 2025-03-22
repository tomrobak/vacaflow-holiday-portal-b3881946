
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Home, 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Plus, 
  Edit, 
  Trash, 
  Search, 
  ArrowRight, 
  CalendarDays,
  Users,
  CreditCard,
  Settings,
  Building,
  Package,
  Mail,
  Image,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";

const SitemapSection = ({ 
  title, 
  description,
  children 
}: { 
  title: string; 
  description?: string;
  children: React.ReactNode 
}) => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      {description && <CardDescription>{description}</CardDescription>}
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const SitemapLink = ({ 
  href, 
  icon: Icon, 
  children 
}: { 
  href: string; 
  icon: React.ElementType;
  children: React.ReactNode 
}) => (
  <div className="flex items-center py-1.5">
    <Icon className="h-4 w-4 mr-2 text-muted-foreground" />
    <Link to={href} className="text-primary hover:underline">{children}</Link>
  </div>
);

const SitemapCategory = ({ 
  title, 
  children 
}: { 
  title: string; 
  children: React.ReactNode 
}) => (
  <div className="mb-4">
    <h3 className="text-lg font-medium mb-2">{title}</h3>
    <div className="ml-4">{children}</div>
  </div>
);

const Sitemap = () => {
  // Sample property ID for demonstration
  const samplePropertyId = "sample-property-id";
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Site Map</h1>
        <p className="text-muted-foreground">
          Complete overview of all pages in our vacation property rental management application
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* General Pages */}
          <SitemapSection title="General Pages" description="Main public pages">
            <SitemapLink href="/" icon={Home}>Home</SitemapLink>
            <SitemapLink href="/login" icon={FileText}>Login/Register</SitemapLink>
            <SitemapLink href="/property/:id" icon={Building}>Property Listing</SitemapLink>
            <SitemapLink href="/checkout" icon={CreditCard}>Checkout</SitemapLink>
            <SitemapLink href="/confirmation" icon={FileText}>Booking Confirmation</SitemapLink>
          </SitemapSection>

          {/* Customer Dashboard */}
          <SitemapSection title="Customer Dashboard" description="Customer portal pages">
            <SitemapLink href="/customer/dashboard" icon={LayoutDashboard}>Dashboard</SitemapLink>
            <SitemapLink href="/customer/bookings" icon={CalendarDays}>Bookings</SitemapLink>
            <SitemapLink href="/customer/bookings/:id" icon={FileText}>Booking Details</SitemapLink>
            <SitemapLink href="/customer/payments" icon={CreditCard}>Payments</SitemapLink>
            <SitemapLink href="/customer/invoices" icon={FileText}>Invoices</SitemapLink>
            <SitemapLink href="/customer/checkout/:id" icon={CreditCard}>Payment Checkout</SitemapLink>
            <SitemapLink href="/customer/messages" icon={MessageSquare}>Messages</SitemapLink>
          </SitemapSection>
          
          {/* Property Reviews Section */}
          <SitemapSection 
            title="Property Reviews" 
            description="Comprehensive review management for properties"
          >
            <SitemapCategory title="Public Reviews">
              <SitemapLink href={`/property/${samplePropertyId}#reviews`} icon={MessageSquare}>
                View Property Reviews
              </SitemapLink>
              <SitemapLink href={`/property/${samplePropertyId}/reviews`} icon={Search}>
                All Reviews
              </SitemapLink>
            </SitemapCategory>
            
            <SitemapCategory title="Customer Review Management">
              <SitemapLink href={`/customer/reviews`} icon={MessageSquare}>
                My Reviews
              </SitemapLink>
              <SitemapLink href={`/customer/bookings/:id/add-review`} icon={Plus}>
                Add Review
              </SitemapLink>
              <SitemapLink href={`/customer/reviews/:id/edit`} icon={Edit}>
                Edit Review
              </SitemapLink>
              <SitemapLink href={`/customer/reviews/:id/delete`} icon={Trash}>
                Delete Review
              </SitemapLink>
            </SitemapCategory>
            
            <SitemapCategory title="Admin Review Management">
              <SitemapLink href={`/admin/properties/:id/reviews`} icon={MessageSquare}>
                Manage Property Reviews
              </SitemapLink>
              <SitemapLink href={`/admin/reviews/pending`} icon={Search}>
                Pending Reviews
              </SitemapLink>
              <SitemapLink href={`/admin/reviews/:id/edit`} icon={Edit}>
                Edit Review
              </SitemapLink>
              <SitemapLink href={`/admin/reviews/:id/approve`} icon={FileText}>
                Approve Review
              </SitemapLink>
              <SitemapLink href={`/admin/reviews/:id/reject`} icon={Trash}>
                Reject Review
              </SitemapLink>
            </SitemapCategory>
          </SitemapSection>
        </div>
        
        <div className="space-y-6">
          {/* Admin Dashboard */}
          <SitemapSection title="Admin Dashboard" description="Property management system">
            <SitemapCategory title="Main Admin Pages">
              <SitemapLink href="/admin/dashboard" icon={LayoutDashboard}>Dashboard</SitemapLink>
              <SitemapLink href="/admin/properties" icon={Building}>Properties</SitemapLink>
              <SitemapLink href="/admin/properties/:id" icon={Building}>Property Details</SitemapLink>
              <SitemapLink href="/admin/properties/:id/edit" icon={Edit}>Edit Property</SitemapLink>
              <SitemapLink href="/admin/properties/:id/calendar" icon={CalendarDays}>Property Calendar</SitemapLink>
              <SitemapLink href="/admin/new-property" icon={Plus}>New Property</SitemapLink>
            </SitemapCategory>
            
            <SitemapCategory title="Bookings & Calendar">
              <SitemapLink href="/admin/addons" icon={Package}>Add-ons</SitemapLink>
              <SitemapLink href="/admin/bookings" icon={CalendarDays}>Bookings</SitemapLink>
              <SitemapLink href="/admin/bookings/:id" icon={FileText}>Booking Details</SitemapLink>
              <SitemapLink href="/admin/bookings/:id/edit" icon={Edit}>Edit Booking</SitemapLink>
              <SitemapLink href="/admin/new-booking" icon={Plus}>New Booking</SitemapLink>
              <SitemapLink href="/admin/calendar" icon={CalendarDays}>Calendar</SitemapLink>
            </SitemapCategory>
            
            <SitemapCategory title="Customers & Payments">
              <SitemapLink href="/admin/customers" icon={Users}>Customers</SitemapLink>
              <SitemapLink href="/admin/customers/:id" icon={Users}>Customer Details</SitemapLink>
              <SitemapLink href="/admin/customers/:id/edit" icon={Edit}>Edit Customer</SitemapLink>
              <SitemapLink href="/admin/new-customer" icon={Plus}>New Customer</SitemapLink>
              <SitemapLink href="/admin/payments" icon={CreditCard}>Payments</SitemapLink>
              <SitemapLink href="/admin/payments/:id" icon={CreditCard}>Payment Details</SitemapLink>
              <SitemapLink href="/admin/new-payment" icon={Plus}>New Payment</SitemapLink>
            </SitemapCategory>
            
            <SitemapCategory title="Communication">
              <SitemapLink href="/admin/messages" icon={MessageSquare}>Messages</SitemapLink>
              <SitemapLink href="/admin/messages/sms" icon={MessageSquare}>SMS</SitemapLink>
            </SitemapCategory>
            
            <SitemapCategory title="Settings">
              <SitemapLink href="/admin/settings" icon={Settings}>General Settings</SitemapLink>
              <SitemapLink href="/admin/settings/addons" icon={Package}>Add-ons Settings</SitemapLink>
              <SitemapLink href="/admin/settings/admin" icon={Users}>Admin Profile</SitemapLink>
              <SitemapLink href="/admin/settings/email" icon={Mail}>Email Settings</SitemapLink>
              <SitemapLink href="/admin/settings/payment" icon={CreditCard}>Payment Settings</SitemapLink>
              <SitemapLink href="/admin/settings/sms" icon={MessageSquare}>SMS Settings</SitemapLink>
              <SitemapLink href="/admin/settings/portal" icon={Users}>Customer Portal</SitemapLink>
              <SitemapLink href="/admin/settings/mail" icon={Mail}>Mail Server</SitemapLink>
              <SitemapLink href="/admin/settings/storage" icon={FileText}>Storage</SitemapLink>
              <SitemapLink href="/admin/settings/images" icon={Image}>Image Settings</SitemapLink>
            </SitemapCategory>
          </SitemapSection>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <Button asChild>
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default Sitemap;


import { Mail, Phone, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatters";
import { Customer, CustomerStatus } from "@/types/customerDetail";

interface CustomerInfoCardProps {
  customer: Customer;
}

const CustomerInfoCard = ({ customer }: CustomerInfoCardProps) => {
  const getStatusBadge = (status: CustomerStatus) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary" className="bg-gray-500">Inactive</Badge>;
      case "pending":
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Pending</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Information</CardTitle>
        <CardDescription>Personal details and contact information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Status</div>
          <div>{getStatusBadge(customer.status)}</div>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Contact</div>
          <div className="flex items-start space-x-2">
            <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <a href={`mailto:${customer.email}`} className="text-primary hover:underline">
              {customer.email}
            </a>
          </div>
          {customer.phone && (
            <div className="flex items-start space-x-2">
              <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <a href={`tel:${customer.phone}`} className="hover:underline">
                {customer.phone}
              </a>
            </div>
          )}
        </div>
        
        {(customer.address || customer.city || customer.state || customer.zipCode || customer.country) && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Address</div>
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                {customer.address && <div>{customer.address}</div>}
                {(customer.city || customer.state || customer.zipCode) && (
                  <div>
                    {customer.city && `${customer.city}, `}
                    {customer.state && `${customer.state} `}
                    {customer.zipCode && customer.zipCode}
                  </div>
                )}
                {customer.country && <div>{customer.country}</div>}
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Dates</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground">Created</div>
              <div>{formatDate(customer.createdAt)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Last Booking</div>
              <div>{formatDate(customer.lastBooking)}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerInfoCard;

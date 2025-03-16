
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatters";
import { Customer } from "@/types/customerDetail";

interface CustomerOverviewCardProps {
  customer: Customer;
}

const CustomerOverviewCard = ({ customer }: CustomerOverviewCardProps) => {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Overview</CardTitle>
        <CardDescription>Booking history and payment stats</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border p-4">
            <div className="text-xs text-muted-foreground uppercase">Total Bookings</div>
            <div className="mt-1 flex items-baseline">
              <div className="text-3xl font-semibold">{customer.totalBookings}</div>
            </div>
          </div>
          
          <div className="rounded-lg border p-4">
            <div className="text-xs text-muted-foreground uppercase">Total Spent</div>
            <div className="mt-1 flex items-baseline">
              <div className="text-3xl font-semibold">{formatCurrency(customer.totalSpent)}</div>
            </div>
          </div>
          
          <div className="rounded-lg border p-4">
            <div className="text-xs text-muted-foreground uppercase">Avg. Booking Value</div>
            <div className="mt-1 flex items-baseline">
              <div className="text-3xl font-semibold">
                {customer.totalBookings > 0
                  ? formatCurrency(customer.totalSpent / customer.totalBookings)
                  : formatCurrency(0)}
              </div>
            </div>
          </div>
        </div>
        
        {customer.notes && (
          <div className="rounded-lg border p-4">
            <div className="text-sm font-medium">Notes</div>
            <div className="mt-1 text-sm text-muted-foreground">{customer.notes}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerOverviewCard;

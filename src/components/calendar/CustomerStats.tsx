
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Customer, BookingEvent } from "@/types/calendar";

interface CustomerStatsProps {
  customers: Customer[];
  filteredBookings: BookingEvent[];
  goToCustomerDetails: (customerId: string) => void;
}

const CustomerStats = ({ customers, filteredBookings, goToCustomerDetails }: CustomerStatsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Customers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {customers.slice(0, 5).map((customer, index) => {
            const customerBookings = filteredBookings.filter(b => b.customerId === customer.id);
            const totalSpent = customerBookings.reduce((sum, b) => sum + b.totalAmount, 0);
            
            return (
              <div key={customer.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-muted-foreground">{index + 1}</span>
                  <div>
                    <div 
                      className="font-medium hover:underline cursor-pointer"
                      onClick={() => goToCustomerDetails(customer.id)}
                    >
                      {customer.name}
                    </div>
                    <div className="text-sm text-muted-foreground">{customer.email}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${totalSpent}</div>
                  <div className="text-sm text-muted-foreground">{customerBookings.length} bookings</div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerStats;

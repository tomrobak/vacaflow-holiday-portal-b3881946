
import { Users, Calendar, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SmsFilter } from "@/types/sms";
import { Check } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  upcomingBooking: boolean;
  pendingPayment: boolean;
  pastBookings: boolean;
  properties: string[];
  tags: string[];
}

interface SmsRecipientSelectorProps {
  filteredCustomers: Customer[];
  selectedCustomers: string[];
  activeFilter: SmsFilter;
  handleSelectAllCustomers: () => void;
  toggleCustomerSelection: (customerId: string) => void;
  onContinue: () => void;
}

const SmsRecipientSelector = ({
  filteredCustomers,
  selectedCustomers,
  activeFilter,
  handleSelectAllCustomers,
  toggleCustomerSelection,
  onContinue
}: SmsRecipientSelectorProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Select Recipients</CardTitle>
          <Badge variant="outline">
            {filteredCustomers.length} customers found
          </Badge>
        </div>
        <CardDescription>
          Current filter: {activeFilter.label}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="border-b px-4 py-2 flex items-center">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 mr-2"
            checked={selectedCustomers.length > 0 && selectedCustomers.length === filteredCustomers.length}
            onChange={handleSelectAllCustomers}
          />
          <span className="font-medium">Select All</span>
          <span className="text-muted-foreground ml-2">
            ({selectedCustomers.length} selected)
          </span>
        </div>
        
        <ScrollArea className="h-[400px]">
          {filteredCustomers.length > 0 ? (
            <div className="divide-y">
              {filteredCustomers.map((customer) => (
                <div 
                  key={customer.id}
                  className="flex items-center px-4 py-3 hover:bg-muted/50"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 mr-3"
                    checked={selectedCustomers.includes(customer.id)}
                    onChange={() => toggleCustomerSelection(customer.id)}
                  />
                  <div className="flex flex-col">
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-sm text-muted-foreground">{customer.phone}</div>
                    <div className="flex gap-1 mt-1">
                      {customer.upcomingBooking && (
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="mr-1 h-3 w-3" />
                          Upcoming
                        </Badge>
                      )}
                      {customer.pendingPayment && (
                        <Badge variant="outline" className="text-xs">
                          <CreditCard className="mr-1 h-3 w-3" />
                          Payment Due
                        </Badge>
                      )}
                      {customer.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No customers found</h3>
              <p className="text-sm text-muted-foreground max-w-xs text-center mt-1">
                Try adjusting your filters or search criteria
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t">
        <Button 
          variant="default" 
          className="w-full"
          disabled={selectedCustomers.length === 0}
          onClick={onContinue}
        >
          <Check className="mr-2 h-4 w-4" />
          {selectedCustomers.length > 0 
            ? `Continue with ${selectedCustomers.length} recipient(s)` 
            : "Select recipients to continue"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SmsRecipientSelector;

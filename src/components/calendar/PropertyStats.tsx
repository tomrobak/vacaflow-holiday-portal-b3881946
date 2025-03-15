
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Property, BookingEvent } from "@/types/calendar";

interface PropertyStatsProps {
  properties: Property[];
  filteredBookings: BookingEvent[];
  goToPropertyDetails: (propertyId: string) => void;
}

const PropertyStats = ({ properties, filteredBookings, goToPropertyDetails }: PropertyStatsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Properties with Most Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {properties.slice(0, 5).map((property, index) => {
            const propertyBookings = filteredBookings.filter(b => b.propertyId === property.id);
            return (
              <div key={property.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-muted-foreground">{index + 1}</span>
                  <div>
                    <div 
                      className="font-medium hover:underline cursor-pointer" 
                      onClick={() => goToPropertyDetails(property.id)}
                    >
                      {property.name}
                    </div>
                    <div className="text-sm text-muted-foreground">{property.location}</div>
                  </div>
                </div>
                <Badge variant="outline">{propertyBookings.length} bookings</Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyStats;

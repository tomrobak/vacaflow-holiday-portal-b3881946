
import { Property } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface PropertyLocationMapProps {
  property: Property;
}

const PropertyLocationMap = ({ property }: PropertyLocationMapProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Location</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-ratio-1 relative rounded-md overflow-hidden bg-muted">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <p className="font-medium">{property.location}</p>
              <p className="text-sm text-muted-foreground mt-1">{property.address}</p>
            </div>
          </div>
          <div className="text-xs text-muted-foreground text-center absolute bottom-2 w-full">
            Full address will be provided after booking
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyLocationMap;

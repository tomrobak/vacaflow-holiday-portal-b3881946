
import { Property } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import GoogleMap from "./GoogleMap";

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
        <div className="flex flex-col gap-4">
          <div className="aspect-video relative rounded-md overflow-hidden bg-muted">
            <GoogleMap 
              location={property.location} 
              address={property.address}
            />
          </div>
          
          <div className="flex items-start gap-3">
            <div className="mt-0.5 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium">{property.location}</p>
              <p className="text-sm text-muted-foreground mt-1">{property.address || "Full address will be provided after booking"}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyLocationMap;

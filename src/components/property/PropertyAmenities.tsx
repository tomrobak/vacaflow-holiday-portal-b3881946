
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PropertyAmenity } from "@/types/property";

interface PropertyAmenitiesProps {
  amenities: string[];
  customAmenities?: PropertyAmenity[];
  amenityLabels?: Record<string, string>;
}

const PropertyAmenities = ({ 
  amenities, 
  customAmenities = [], 
  amenityLabels = {} 
}: PropertyAmenitiesProps) => {
  const totalAmenitiesCount = amenities.length + customAmenities.length;
  const visibleCount = 8;
  
  // Combine standard and custom amenities for display
  const visibleAmenities = amenities.slice(0, visibleCount);
  const visibleCustomAmenities = customAmenities.slice(0, Math.max(0, visibleCount - amenities.length));
  
  const hasMoreAmenities = totalAmenitiesCount > visibleCount;
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">What this place offers</h3>
      
      <div className="flex flex-wrap gap-2 mb-2">
        {visibleAmenities.map((amenity) => (
          <Badge key={amenity} variant="secondary" className="py-1.5">
            {amenityLabels[amenity] || amenity}
          </Badge>
        ))}
        
        {visibleCustomAmenities.map((amenity) => (
          <Badge key={amenity.id} variant="success" className="py-1.5">
            {amenity.name}
          </Badge>
        ))}
      </div>
      
      {hasMoreAmenities && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="mt-2">
              Show all {totalAmenitiesCount} amenities
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Amenities</DialogTitle>
            </DialogHeader>
            <div className="flex flex-wrap gap-2 py-4">
              {amenities.map((amenity) => (
                <Badge key={amenity} variant="secondary" className="py-1.5">
                  {amenityLabels[amenity] || amenity}
                </Badge>
              ))}
              
              {customAmenities.map((amenity) => (
                <Badge key={amenity.id} variant="success" className="py-1.5">
                  {amenity.name}
                </Badge>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PropertyAmenities;


import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface PropertyAmenitiesProps {
  amenities: string[];
}

const PropertyAmenities = ({ amenities }: PropertyAmenitiesProps) => {
  const visibleAmenities = amenities.slice(0, 6);
  const remainingAmenities = amenities.slice(6);
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">What this place offers</h3>
      
      <div className="flex flex-wrap gap-2 mb-2">
        {visibleAmenities.map((amenity) => (
          <Badge key={amenity} variant="secondary" className="py-1.5">
            {amenity}
          </Badge>
        ))}
      </div>
      
      {remainingAmenities.length > 0 && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="mt-2">
              Show all {amenities.length} amenities
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Amenities</DialogTitle>
            </DialogHeader>
            <div className="flex flex-wrap gap-2 py-4">
              {amenities.map((amenity) => (
                <Badge key={amenity} variant="secondary" className="py-1.5">
                  {amenity}
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

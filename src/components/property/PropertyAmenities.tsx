
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
        {visibleAmenities.map((amenity) => (
          <div key={amenity} className="flex items-center py-1">
            <Check className="h-4 w-4 mr-2 text-primary" />
            <span>{amenity}</span>
          </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 py-4">
              {amenities.map((amenity) => (
                <div key={amenity} className="flex items-center py-1">
                  <Check className="h-4 w-4 mr-2 text-primary" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PropertyAmenities;

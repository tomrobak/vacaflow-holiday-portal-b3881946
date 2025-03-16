
import { useState } from "react";
import { Property } from "@/types/property";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Grid2X2, Maximize2 } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger 
} from "@/components/ui/dialog";

interface PropertyGalleryProps {
  property: Property;
}

const PropertyGallery = ({ property }: PropertyGalleryProps) => {
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  
  const allImages = [
    property.heroImage || property.images[0],
    ...property.images.slice(0, 4)
  ].filter(Boolean);

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-xl overflow-hidden">
        <div className="md:col-span-2 md:row-span-2">
          <AspectRatio ratio={1} className="bg-muted h-full">
            <img
              src={allImages[0] || "/placeholder.svg"}
              alt={property.name}
              className="object-cover w-full h-full"
            />
          </AspectRatio>
        </div>
        
        {allImages.slice(1, 5).map((image, index) => (
          <div key={index} className="hidden md:block">
            <AspectRatio ratio={1} className="bg-muted h-full">
              <img
                src={image || "/placeholder.svg"}
                alt={`${property.name} - Image ${index + 2}`}
                className="object-cover w-full h-full"
              />
            </AspectRatio>
          </div>
        ))}
      </div>
      
      <div className="absolute bottom-4 right-4 flex space-x-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" size="sm" className="rounded-full">
              <Grid2X2 className="h-4 w-4 mr-2" />
              Show all photos
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              {allImages.map((image, index) => (
                <div key={index} className="rounded-md overflow-hidden">
                  <AspectRatio ratio={4/3} className="bg-muted">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${property.name} - Image ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PropertyGallery;

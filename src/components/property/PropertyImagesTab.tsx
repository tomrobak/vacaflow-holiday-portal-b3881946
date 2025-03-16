
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image, ImageIcon, Upload, X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { PropertyFormData } from "@/types/property";

interface PropertyImagesTabProps {
  form: UseFormReturn<PropertyFormData>;
  uploadedImages: Array<{ name: string; url: string }>;
  heroImage: string | null;
  galleryImages: string[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  setAsHeroImage: (url: string) => void;
  addToGallery: (url: string) => void;
  removeFromGallery: (url: string) => void;
  removeHeroImage: () => void;
}

const PropertyImagesTab = ({
  form,
  uploadedImages,
  heroImage,
  galleryImages,
  onImageUpload,
  removeImage,
  setAsHeroImage,
  addToGallery,
  removeFromGallery,
  removeHeroImage,
}: PropertyImagesTabProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Hero Image</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This image will be displayed prominently at the top of your property listing
                </p>
              </div>
              
              {heroImage ? (
                <div className="relative rounded-md overflow-hidden h-60 bg-gray-100">
                  <img 
                    src={heroImage} 
                    alt="Hero" 
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeHeroImage}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-md border-muted-foreground/25 flex flex-col items-center justify-center p-4 text-center h-60">
                  <ImageIcon className="h-8 w-8 mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground mb-2">No hero image set</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Select an image from your uploaded images below
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Gallery Images</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  These images will be displayed in the property gallery
                </p>
              </div>
              
              {galleryImages.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {galleryImages.map((url, index) => (
                    <div key={index} className="relative rounded-md overflow-hidden h-32 bg-gray-100">
                      <img 
                        src={url} 
                        alt={`Gallery ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1"
                        onClick={() => removeFromGallery(url)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-md border-muted-foreground/25 flex flex-col items-center justify-center p-4 text-center h-40">
                  <Image className="h-8 w-8 mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground mb-2">No gallery images</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Add images from your uploads to the gallery
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Uploaded Images</CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload images for your property or select from existing images
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Images
              </Button>
              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={onImageUpload}
              />
            </div>

            {uploadedImages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {uploadedImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative group border rounded-md overflow-hidden"
                  >
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex flex-col items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex flex-wrap gap-2 p-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => setAsHeroImage(image.url)}
                        >
                          Set as Hero
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => addToGallery(image.url)}
                        >
                          Add to Gallery
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-md border-muted-foreground/25 flex flex-col items-center justify-center p-10 text-center">
                <Upload className="h-10 w-10 mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-2">No images uploaded yet</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Drag and drop files or click upload to add images
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyImagesTab;

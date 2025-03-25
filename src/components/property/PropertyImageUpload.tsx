
import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, ImageIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { PropertyFormData } from "@/types/property";

interface PropertyImageUploadProps {
  form: UseFormReturn<PropertyFormData>;
}

const PropertyImageUpload = ({ form }: PropertyImageUploadProps) => {
  const [uploadedImages, setUploadedImages] = useState<{ name: string; url: string }[]>([]);
  const [featuredImage, setFeaturedImage] = useState<{ name: string; url: string } | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      }));

      setUploadedImages([...uploadedImages, ...newImages]);
    }
  };

  const handleFeaturedImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setFeaturedImage({
        name: file.name,
        url: imageUrl
      });
      form.setValue("featuredImage", imageUrl);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...uploadedImages];
    URL.revokeObjectURL(newImages[index].url);
    newImages.splice(index, 1);
    setUploadedImages(newImages);
  };

  const removeFeaturedImage = () => {
    if (featuredImage) {
      URL.revokeObjectURL(featuredImage.url);
      setFeaturedImage(null);
      form.setValue("featuredImage", "");
    }
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="featuredImage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Featured Image</FormLabel>
            <FormDescription className="mb-2">
              Upload a high-quality main image that will be displayed prominently in listings
            </FormDescription>
            <FormControl>
              <>
                {featuredImage ? (
                  <div className="relative rounded-md overflow-hidden h-60 bg-gray-100 mb-4">
                    <img 
                      src={featuredImage.url} 
                      alt="Featured" 
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={removeFeaturedImage}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                ) : (
                  <label
                    htmlFor="featured-image-upload"
                    className="cursor-pointer block"
                  >
                    <div className="border-2 border-dashed rounded-md border-muted-foreground/25 flex flex-col items-center justify-center p-6 text-center transition-colors hover:border-muted-foreground/50 h-60">
                      <ImageIcon className="h-10 w-10 mb-4 text-muted-foreground" />
                      <p className="mb-1 text-sm font-medium text-muted-foreground">
                        Click to upload featured image
                      </p>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG or WebP, up to 10MB
                      </p>
                    </div>
                    <input
                      id="featured-image-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFeaturedImageUpload}
                      value=""
                    />
                  </label>
                )}
                <input 
                  type="hidden" 
                  {...field}
                />
              </>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div>
        <FormLabel>Property Gallery Images</FormLabel>
        <div className="mt-2">
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                {uploadedImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative h-24 bg-gray-100 rounded-md overflow-hidden"
                  >
                    <img
                      src={image.url}
                      alt={`Property ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <div>
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer block"
                >
                  <div className="border-2 border-dashed rounded-md border-muted-foreground/25 flex flex-col items-center justify-center p-4 text-center transition-colors hover:border-muted-foreground/50">
                    <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                      Drag and drop your images here or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG or WebP, up to 10MB each
                    </p>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </CardContent>
          </Card>
          <FormDescription className="mt-1">
            Upload additional images of your property for the gallery.
          </FormDescription>
        </div>
      </div>
    </div>
  );
};

export default PropertyImageUpload;

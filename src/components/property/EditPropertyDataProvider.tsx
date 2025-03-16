
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { Property } from "@/types/property";
import { usePropertyImages } from "@/hooks/usePropertyImages";
import { propertyFormSchema } from "./EditPropertyTypes";

export type EditPropertyFormValues = z.infer<typeof propertyFormSchema>;

interface EditPropertyDataProviderProps {
  propertyId: string;
  mockPropertyData: Property;
  children: (props: {
    form: ReturnType<typeof useForm<EditPropertyFormValues>>;
    isLoading: boolean;
    property: Property | null;
    uploadedImages: Array<{ name: string; url: string }>;
    heroImage: string | null;
    galleryImages: string[];
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    removeImage: (index: number) => void;
    setAsHeroImage: (url: string) => void;
    addToGallery: (url: string) => void;
    removeFromGallery: (url: string) => void;
    removeHeroImage: () => void;
    watchGoogleCalendarSync: boolean;
  }) => React.ReactNode;
}

export const EditPropertyDataProvider = ({ 
  propertyId, 
  mockPropertyData, 
  children 
}: EditPropertyDataProviderProps) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<EditPropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      address: "",
      price: "",
      bedrooms: "",
      bathrooms: "",
      maxGuests: "",
      squareFeet: "",
      amenities: [],
      addons: [],
      availableFrom: new Date(),
      availableTo: new Date(new Date().setMonth(new Date().getMonth() + 3)),
      propertyType: "house",
      isActive: true,
      featured: false,
      googleCalendarSync: false,
      googleCalendarId: "",
      heroImage: "",
      gallery: [],
    },
  });

  const { 
    uploadedImages, 
    setUploadedImages, 
    heroImage, 
    setHeroImage, 
    galleryImages, 
    setGalleryImages, 
    handleImageUpload, 
    removeImage, 
    setAsHeroImage, 
    addToGallery, 
    removeFromGallery,
    initializeImages
  } = usePropertyImages(form.setValue);

  useEffect(() => {
    const fetchProperty = async () => {
      setIsLoading(true);
      try {
        console.log(`Fetching property data for ID: ${propertyId}`);
        const data = mockPropertyData;
        setProperty(data);
        
        form.reset({
          name: data.name,
          description: data.description,
          location: data.location,
          address: data.address,
          price: data.price.toString(),
          bedrooms: data.bedrooms.toString(),
          bathrooms: data.bathrooms.toString(),
          maxGuests: data.maxGuests.toString(),
          squareFeet: data.squareFeet ? data.squareFeet.toString() : "",
          amenities: data.amenities,
          addons: data.addons,
          availableFrom: new Date(data.availableFrom),
          availableTo: new Date(data.availableTo),
          propertyType: data.propertyType,
          isActive: data.status === "active",
          featured: data.featured,
          googleCalendarSync: data.googleCalendarSync || false,
          googleCalendarId: data.googleCalendarId || "",
          heroImage: data.heroImage || "",
          gallery: data.gallery || [],
        });
        
        initializeImages(data.heroImage, data.gallery);
        
        const images = [...(data.images || [])];
        setUploadedImages(
          images.map((url, index) => ({
            name: `Image ${index + 1}`,
            url
          }))
        );
      } catch (error) {
        console.error("Error fetching property:", error);
        toast.error("Failed to load property data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId, form, initializeImages, setUploadedImages, mockPropertyData]);

  const removeHeroImage = () => {
    setHeroImage(null);
    form.setValue("heroImage", "");
  };

  const watchGoogleCalendarSync = form.watch("googleCalendarSync");

  return children({
    form,
    isLoading,
    property,
    uploadedImages,
    heroImage,
    galleryImages,
    handleImageUpload,
    removeImage,
    setAsHeroImage,
    addToGallery,
    removeFromGallery,
    removeHeroImage,
    watchGoogleCalendarSync,
  });
};

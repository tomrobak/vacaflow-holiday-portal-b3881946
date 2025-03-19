
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import PropertyBasicInfoTab from "@/components/property/PropertyBasicInfoTab";
import PropertyAmenitiesTab from "@/components/property/PropertyAmenitiesTab";
import PropertyAddonsTab from "@/components/property/PropertyAddonsTab";
import PropertyImagesTab from "@/components/property/PropertyImagesTab";
import PropertyAvailabilityTab from "@/components/property/PropertyAvailabilityTab";
import PropertyFormSkeleton from "@/components/property/PropertyFormSkeleton";
import EditPropertyActions from "@/components/property/EditPropertyActions";

import { 
  EditPropertyDataProvider 
} from "@/components/property/EditPropertyDataProvider";
import {
  propertyTypes,
  getAmenitiesByCategory,
  formatCategoryName,
  mockPropertyData
} from "@/components/property/EditPropertyTypes";
import { Addon, AddonCategory } from "@/types/addon";

const EditProperty = () => {
  const { id = "1" } = useParams();
  const [activeTab, setActiveTab] = useState("basic");
  
  // Mock data - in a real app this would come from an API
  const [availableAddons] = useState<Addon[]>([
    {
      id: "1",
      name: "Late Checkout",
      description: "Extend your stay until 3 PM instead of the standard 11 AM checkout time.",
      price: 45,
      category: "checkout" as AddonCategory,
      featuredImage: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
      gallery: [],
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "2",
      name: "Early Check-in",
      description: "Check in as early as 10 AM instead of the standard 3 PM check-in time.",
      price: 45,
      category: "checkin" as AddonCategory,
      featuredImage: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      gallery: [],
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "3",
      name: "Train Station Pickup",
      description: "We'll pick you up from the train station and bring you directly to the property.",
      price: 30,
      category: "transportation" as AddonCategory,
      featuredImage: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
      gallery: [],
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "4",
      name: "Professional Photo Session",
      description: "1-hour photo session with a professional photographer at the property or nearby landmarks.",
      price: 120,
      category: "entertainment" as AddonCategory,
      featuredImage: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
      gallery: [],
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  const amenitiesByCategory = getAmenitiesByCategory();

  return (
    <EditPropertyDataProvider propertyId={id} mockPropertyData={mockPropertyData}>
      {({ 
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
        watchGoogleCalendarSync
      }) => {
        if (isLoading) {
          return <PropertyFormSkeleton />;
        }

        return (
          <div className="p-6 max-w-5xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">Edit Property</h1>
              <p className="text-muted-foreground mt-1">
                Update the details for {property?.name}
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="features">Features & Amenities</TabsTrigger>
                <TabsTrigger value="addons">Add-ons</TabsTrigger>
                <TabsTrigger value="images">Images & Gallery</TabsTrigger>
                <TabsTrigger value="availability">Availability</TabsTrigger>
              </TabsList>
            </Tabs>

            <Form {...form}>
              <form className="space-y-8">
                <TabsContent value="basic">
                  <PropertyBasicInfoTab form={form} propertyTypes={propertyTypes} />
                </TabsContent>

                <TabsContent value="features">
                  <PropertyAmenitiesTab 
                    form={form} 
                    amenitiesByCategory={amenitiesByCategory} 
                    formatCategoryName={formatCategoryName} 
                  />
                </TabsContent>

                <TabsContent value="addons">
                  <PropertyAddonsTab 
                    form={form} 
                    availableAddons={availableAddons}
                  />
                </TabsContent>

                <TabsContent value="images">
                  <PropertyImagesTab 
                    form={form}
                    uploadedImages={uploadedImages}
                    heroImage={heroImage}
                    galleryImages={galleryImages}
                    onImageUpload={handleImageUpload}
                    removeImage={removeImage}
                    setAsHeroImage={setAsHeroImage}
                    addToGallery={addToGallery}
                    removeFromGallery={removeFromGallery}
                    removeHeroImage={removeHeroImage}
                  />
                </TabsContent>

                <TabsContent value="availability">
                  <PropertyAvailabilityTab 
                    form={form} 
                    watchGoogleCalendarSync={watchGoogleCalendarSync} 
                  />
                </TabsContent>

                <EditPropertyActions form={form} propertyId={id} />
              </form>
            </Form>
          </div>
        );
      }}
    </EditPropertyDataProvider>
  );
};

export default EditProperty;


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
  mockAddons,
  mockPropertyData
} from "@/components/property/EditPropertyTypes";

const EditProperty = () => {
  const { id = "1" } = useParams();
  const [activeTab, setActiveTab] = useState("basic");
  const [isAddAddonDialogOpen, setIsAddAddonDialogOpen] = useState(false);
  const [availableAddons] = useState(mockAddons);

  const amenitiesByCategory = getAmenitiesByCategory();

  const handleCreateAddon = () => {
    setIsAddAddonDialogOpen(false);
    // Navigate to addons page would go here
  };

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
                <TabsTrigger value="addons">Addons</TabsTrigger>
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
                    onCreateAddon={handleCreateAddon} 
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

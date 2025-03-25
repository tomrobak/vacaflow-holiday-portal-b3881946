
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { notifyPropertyCreated } from "@/utils/property-notifications";
import PropertyFormLayout from "@/components/property/PropertyFormLayout";
import PropertyBasicInfoFields from "@/components/property/PropertyBasicInfoFields";
import PropertyDetailsFields from "@/components/property/PropertyDetailsFields";
import PropertyAmenitiesTab from "@/components/property/PropertyAmenitiesTab";
import PropertySettingsFields from "@/components/property/PropertySettingsFields";
import PropertyImageUpload from "@/components/property/PropertyImageUpload";
import PropertyCustomPricing from "@/components/property/PropertyCustomPricing";
import PropertyFormSection from "@/components/property/PropertyFormSection";
import { getAmenitiesByCategory, formatCategoryName, propertyFormSchema } from "@/components/property/EditPropertyTypes";

const NewProperty = () => {
  const navigate = useNavigate();
  const amenitiesByCategory = getAmenitiesByCategory();

  const form = useForm({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      latitude: "",
      longitude: "",
      address: "",
      price: "",
      bedrooms: "",
      bathrooms: "",
      maxGuests: "",
      squareFeet: "",
      amenities: [],
      customAmenities: [],
      propertyType: "house",
      isActive: true,
      featured: false,
      googleCalendarSync: false,
      googleCalendarId: "",
      customPrices: [],
      featuredImage: "",
    },
  });

  function onSubmit(values: any) {
    console.log("Form values:", values);

    notifyPropertyCreated({ 
      name: values.name || "New Property",
      id: Math.random().toString(36).substr(2, 9)
    });

    navigate("/properties");
  }

  return (
    <Form {...form}>
      <PropertyFormLayout
        form={form}
        title="Add New Property"
        description="Fill in the details below to add a new vacation rental property"
        submitButtonText="Create Property"
        cancelPath="/properties"
        onSubmit={onSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <PropertyFormSection withCard={false}>
              <PropertyBasicInfoFields form={form} />
            </PropertyFormSection>
            
            <PropertyFormSection withCard={false}>
              <PropertyDetailsFields form={form} />
            </PropertyFormSection>
            
            <PropertyCustomPricing form={form} />
          </div>

          <div className="space-y-6">
            <PropertyAmenitiesTab 
              form={form} 
              amenitiesByCategory={amenitiesByCategory} 
              formatCategoryName={formatCategoryName} 
            />
            
            <PropertyFormSection withCard={false}>
              <PropertySettingsFields form={form} />
            </PropertyFormSection>
            
            <PropertyFormSection withCard={false}>
              <PropertyImageUpload form={form} />
            </PropertyFormSection>
          </div>
        </div>
      </PropertyFormLayout>
    </Form>
  );
};

export default NewProperty;

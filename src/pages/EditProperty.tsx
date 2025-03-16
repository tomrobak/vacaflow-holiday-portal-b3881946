
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePropertyImages } from "@/hooks/usePropertyImages";
import { Property, PropertyFormData } from "@/types/property";
import PropertyBasicInfoTab from "@/components/property/PropertyBasicInfoTab";
import PropertyAmenitiesTab from "@/components/property/PropertyAmenitiesTab";
import PropertyAddonsTab from "@/components/property/PropertyAddonsTab";
import PropertyImagesTab from "@/components/property/PropertyImagesTab";
import PropertyAvailabilityTab from "@/components/property/PropertyAvailabilityTab";

const amenitiesOptions = [
  { id: "wifi", label: "WiFi", category: "essentials" },
  { id: "pool", label: "Swimming Pool", category: "outdoors" },
  { id: "gym", label: "Gym", category: "recreation" },
  { id: "parking", label: "Free Parking", category: "essentials" },
  { id: "aircon", label: "Air Conditioning", category: "climate" },
  { id: "kitchen", label: "Kitchen", category: "essentials" },
  { id: "tv", label: "TV", category: "entertainment" },
  { id: "washing", label: "Washing Machine", category: "essentials" },
  { id: "heating", label: "Heating", category: "climate" },
  { id: "balcony", label: "Balcony", category: "outdoors" },
  { id: "fireplace", label: "Fireplace", category: "climate" },
  { id: "bbq", label: "BBQ", category: "outdoors" },
  { id: "hotTub", label: "Hot Tub", category: "outdoors" },
  { id: "petsAllowed", label: "Pets Allowed", category: "policies" },
  { id: "childFriendly", label: "Child Friendly", category: "policies" },
  { id: "workspace", label: "Workspace", category: "essentials" },
  { id: "dishwasher", label: "Dishwasher", category: "essentials" },
  { id: "beachfront", label: "Beachfront", category: "location" },
  { id: "waterfront", label: "Waterfront", category: "location" },
  { id: "mountainView", label: "Mountain View", category: "location" },
  { id: "cityView", label: "City View", category: "location" },
  { id: "doorman", label: "Doorman", category: "security" },
  { id: "elevator", label: "Elevator", category: "accessibility" },
  { id: "wheelchairAccessible", label: "Wheelchair Accessible", category: "accessibility" },
  { id: "breakfast", label: "Breakfast", category: "food" },
  { id: "smokeAlarm", label: "Smoke Alarm", category: "safety" },
  { id: "carbonMonoxideAlarm", label: "Carbon Monoxide Alarm", category: "safety" },
  { id: "firstAidKit", label: "First Aid Kit", category: "safety" },
  { id: "sauna", label: "Sauna", category: "recreation" },
  { id: "jacuzzi", label: "Jacuzzi", category: "recreation" },
  { id: "netflix", label: "Netflix", category: "entertainment" },
  { id: "gameConsole", label: "Game Console", category: "entertainment" },
  { id: "boardGames", label: "Board Games", category: "entertainment" },
  { id: "bikeRental", label: "Bike Rental", category: "activities" },
  { id: "kayak", label: "Kayak", category: "activities" },
  { id: "coffeemaker", label: "Coffee Maker", category: "kitchen" },
  { id: "ironingEquipment", label: "Ironing Equipment", category: "essentials" },
  { id: "hairdryer", label: "Hair Dryer", category: "bathroom" },
  { id: "selfCheckIn", label: "Self Check-In", category: "access" },
  { id: "privateEntrance", label: "Private Entrance", category: "access" },
];

const propertyTypes = [
  { value: "house", label: "House" },
  { value: "apartment", label: "Apartment" },
  { value: "cabin", label: "Cabin" },
  { value: "villa", label: "Villa" },
  { value: "condo", label: "Condominium" },
];

const mockAddons = [
  {
    id: "1",
    name: "Late Checkout",
    description: "Extend your stay until 3 PM instead of the standard 11 AM checkout time.",
    price: 45,
    category: "checkout",
    featuredImage: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2",
    name: "Early Check-in",
    description: "Check in as early as 10 AM instead of the standard 3 PM check-in time.",
    price: 45,
    category: "checkin",
    featuredImage: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "3",
    name: "Train Station Pickup",
    description: "We'll pick you up from the train station and bring you directly to the property.",
    price: 30,
    category: "transportation",
    featuredImage: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "4",
    name: "Professional Photo Session",
    description: "1-hour photo session with a professional photographer at the property or nearby landmarks.",
    price: 120,
    category: "entertainment",
    featuredImage: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const mockPropertyData: Property = {
  id: "1",
  name: "Sunset Villa",
  location: "Malibu, CA",
  description: "A beautiful beachfront property with stunning ocean views. This luxurious villa features modern furnishings, a private pool, and direct beach access. Perfect for family vacations or romantic getaways. Enjoy breathtaking sunsets from the spacious terrace.",
  address: "123 Beach Dr, Malibu, CA",
  price: 350,
  bedrooms: 3,
  bathrooms: 2,
  maxGuests: 6,
  squareFeet: 2200,
  amenities: ["wifi", "pool", "kitchen", "aircon", "washing", "parking"],
  availableFrom: new Date(),
  availableTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
  propertyType: "villa",
  status: "active",
  featured: true,
  images: [],
  heroImage: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
  gallery: [
    "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    "https://images.unsplash.com/photo-1472396961693-142e6e269027",
    "https://images.unsplash.com/photo-1466721591366-2d5fba72006d"
  ],
  googleCalendarSync: true,
  googleCalendarId: "example@gmail.com",
  addons: ["1", "3"],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Property name must be at least 2 characters.",
  }).optional(),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }).optional(),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }).optional(),
  address: z.string().optional(),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number.",
  }).optional(),
  bedrooms: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) >= 0,
    {
      message: "Number of bedrooms must be a non-negative number.",
    }
  ).optional(),
  bathrooms: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) >= 0,
    {
      message: "Number of bathrooms must be a non-negative number.",
    }
  ).optional(),
  maxGuests: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    {
      message: "Maximum guests must be a positive number.",
    }
  ).optional(),
  squareFeet: z.string().refine(
    (val) => val === "" || (!isNaN(Number(val)) && Number(val) > 0),
    {
      message: "Square feet must be a positive number.",
    }
  ).optional(),
  amenities: z.array(z.string()).optional(),
  addons: z.array(z.string()).optional(),
  availableFrom: z.date(),
  availableTo: z.date(),
  propertyType: z.string(),
  isActive: z.boolean().default(true),
  featured: z.boolean().default(false),
  googleCalendarSync: z.boolean().default(false),
  googleCalendarId: z.string().optional(),
  heroImage: z.string().optional(),
  gallery: z.array(z.string()).optional(),
}).refine(
  (data) => {
    return data.availableTo > data.availableFrom;
  },
  {
    message: "End date must be after start date.",
    path: ["availableTo"],
  }
).refine(
  (data) => {
    return !data.googleCalendarSync || (data.googleCalendarSync && data.googleCalendarId && data.googleCalendarId.trim() !== "");
  },
  {
    message: "Google Calendar ID is required when Google Calendar Sync is enabled.",
    path: ["googleCalendarId"],
  }
);

const amenitiesByCategory = amenitiesOptions.reduce((acc, amenity) => {
  if (!acc[amenity.category]) {
    acc[amenity.category] = [];
  }
  acc[amenity.category].push(amenity);
  return acc;
}, {} as Record<string, typeof amenitiesOptions>);

const formatCategoryName = (category: string) => {
  return category.charAt(0).toUpperCase() + category.slice(1);
};

const EditProperty = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("basic");
  const [availableAddons, setAvailableAddons] = useState(mockAddons);
  const [isAddAddonDialogOpen, setIsAddAddonDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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
        console.log(`Fetching property data for ID: ${id}`);
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
  }, [id, form, initializeImages, setUploadedImages]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form values:", values);
    console.log("Hero image:", heroImage);
    console.log("Gallery images:", galleryImages);
    console.log("Uploaded images:", uploadedImages);
    console.log("Selected addons:", values.addons);
    
    toast.success(`Property "${values.name}" has been updated!`);
    navigate(`/properties/${id}`);
  }

  const handleCreateAddon = () => {
    setIsAddAddonDialogOpen(false);
    navigate("/addons");
  };

  const removeHeroImage = () => {
    setHeroImage(null);
    form.setValue("heroImage", "");
  };

  const watchGoogleCalendarSync = form.watch("googleCalendarSync");

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading property data...</p>
        </div>
      </div>
    );
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate(`/properties/${id}`)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Update Property
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditProperty;

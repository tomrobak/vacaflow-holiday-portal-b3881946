
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon, Building, Upload, X, Plus, MapPin, Calendar as CalendarLucide, Image, ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Property } from "@/types/property";

// Extended amenities list
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

// Mock data for demo purposes
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
  createdAt: new Date(),
  updatedAt: new Date(),
};

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Property name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  address: z.string().optional(),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number.",
  }),
  bedrooms: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) >= 0,
    {
      message: "Number of bedrooms must be a non-negative number.",
    }
  ),
  bathrooms: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) >= 0,
    {
      message: "Number of bathrooms must be a non-negative number.",
    }
  ),
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

// Group amenities by category
const amenitiesByCategory = amenitiesOptions.reduce((acc, amenity) => {
  if (!acc[amenity.category]) {
    acc[amenity.category] = [];
  }
  acc[amenity.category].push(amenity);
  return acc;
}, {} as Record<string, typeof amenitiesOptions>);

// Capitalize category names for display
const formatCategoryName = (category: string) => {
  return category.charAt(0).toUpperCase() + category.slice(1);
};

const EditProperty = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadedImages, setUploadedImages] = useState<
    { name: string; url: string }[]
  >([]);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("basic");

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

  // Fetch property data
  useEffect(() => {
    const fetchProperty = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        console.log(`Fetching property data for ID: ${id}`);
        // Mock data for demo
        const data = mockPropertyData;
        setProperty(data);
        
        // Set form values from property data
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
        
        // Set images
        if (data.heroImage) {
          setHeroImage(data.heroImage);
        }
        
        if (data.gallery && data.gallery.length > 0) {
          setGalleryImages(data.gallery);
        }
        
        // Set uploaded images for display
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
  }, [id, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form values:", values);
    console.log("Hero image:", heroImage);
    console.log("Gallery images:", galleryImages);
    console.log("Uploaded images:", uploadedImages);
    
    toast.success(`Property "${values.name}" has been updated!`);
    navigate(`/properties/${id}`);
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      }));

      setUploadedImages([...uploadedImages, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...uploadedImages];
    URL.revokeObjectURL(newImages[index].url);
    newImages.splice(index, 1);
    setUploadedImages(newImages);
  };

  const setAsHeroImage = (url: string) => {
    setHeroImage(url);
    form.setValue("heroImage", url);
    toast.success("Hero image has been set");
  };

  const addToGallery = (url: string) => {
    if (!galleryImages.includes(url)) {
      const newGallery = [...galleryImages, url];
      setGalleryImages(newGallery);
      form.setValue("gallery", newGallery);
      toast.success("Image added to gallery");
    } else {
      toast.info("This image is already in the gallery");
    }
  };

  const removeFromGallery = (url: string) => {
    const newGallery = galleryImages.filter(img => img !== url);
    setGalleryImages(newGallery);
    form.setValue("gallery", newGallery);
    toast.success("Image removed from gallery");
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
          <TabsTrigger value="images">Images & Gallery</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>
      </Tabs>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Sunset Villa" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter a unique name for your property.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your property..."
                          className="resize-none min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a detailed description of your property.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="e.g. Malibu, CA"
                            className="pl-8"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Enter the location of your property.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter the complete address..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This address will be shared with guests after booking.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="propertyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a property type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {propertyTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the type of property.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="bedrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bedrooms</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="2"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bathrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bathrooms</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="2"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="maxGuests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Guests</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            placeholder="4"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="squareFeet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Square Feet</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="1200"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price per Night (USD)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="200"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the price per night in USD.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Active Listing</FormLabel>
                          <FormDescription>
                            This property will be immediately available for bookings
                            if active.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Featured Property</FormLabel>
                          <FormDescription>
                            Featured properties are highlighted on the homepage and in search results.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="amenities"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Amenities</FormLabel>
                        <FormDescription>
                          Select the amenities available at your property.
                        </FormDescription>
                      </div>
                      
                      {Object.entries(amenitiesByCategory).map(([category, amenities]) => (
                        <div key={category} className="mb-6">
                          <h3 className="text-sm font-medium mb-3 text-muted-foreground">
                            {formatCategoryName(category)}
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {amenities.map((item) => (
                              <FormField
                                key={item.id}
                                control={form.control}
                                name="amenities"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={item.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(item.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([
                                                  ...(field.value || []),
                                                  item.id,
                                                ])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== item.id
                                                  )
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {item.label}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hero Image Section */}
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
                          onClick={() => {
                            setHeroImage(null);
                            form.setValue("heroImage", "");
                          }}
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

              {/* Gallery Section */}
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
                        {galleryImages.map((image, index) => (
                          <div key={index} className="relative rounded-md overflow-hidden h-24 bg-gray-100">
                            <img 
                              src={image} 
                              alt={`Gallery ${index + 1}`} 
                              className="w-full h-full object-cover"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6"
                              onClick={() => removeFromGallery(image)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border-2 border-dashed rounded-md border-muted-foreground/25 flex flex-col items-center justify-center p-4 text-center h-40">
                        <ImageIcon className="h-8 w-8 mb-2 text-muted-foreground" />
                        <p className="text-sm font-medium text-muted-foreground">No gallery images</p>
                        <p className="text-xs text-muted-foreground">
                          Select images from your uploaded images below
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upload Images Section */}
            <Card>
              <CardContent className="pt-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Uploaded Images</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                    {uploadedImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative h-36 bg-gray-100 rounded-md overflow-hidden group"
                      >
                        <img
                          src={image.url}
                          alt={`Property ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-2 p-2">
                          <div className="flex gap-1">
                            <Button
                              variant="secondary"
                              size="sm"
                              className="h-8"
                              onClick={() => setAsHeroImage(image.url)}
                            >
                              Set as Hero
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              className="h-8"
                              onClick={() => addToGallery(image.url)}
                            >
                              Add to Gallery
                            </Button>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-8 w-full"
                            onClick={() => removeImage(index)}
                          >
                            Remove
                          </Button>
                        </div>
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="availability" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Availability Period</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="availableFrom"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Available From</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                  className={cn("p-3 pointer-events-auto")}
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="availableTo"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Available To</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                  className={cn("p-3 pointer-events-auto")}
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Calendar Settings</h3>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="googleCalendarSync"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Enable Google Calendar Sync</FormLabel>
                              <FormDescription>
                                Automatically sync bookings with a Google Calendar
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      {watchGoogleCalendarSync && (
                        <FormField
                          control={form.control}
                          name="googleCalendarId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Google Calendar ID</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <CalendarLucide className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    placeholder="e.g. example@gmail.com"
                                    className="pl-8"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormDescription>
                                Enter the Google Calendar ID to sync with.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/properties/${id}`)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditProperty;

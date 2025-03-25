
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Building, Upload, X, Plus, MapPin, Calendar as CalendarLucide, 
  DollarSign, Image as ImageIcon, GeoLocation, Tag, 
  ArrowRight, Trash2 
} from "lucide-react";
import { format } from "date-fns";

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
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { notifyPropertyCreated } from "@/utils/property-notifications";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
  latitude: z.string().optional().refine(val => val === "" || !isNaN(Number(val)), {
    message: "Latitude must be a valid number.",
  }),
  longitude: z.string().optional().refine(val => val === "" || !isNaN(Number(val)), {
    message: "Longitude must be a valid number.",
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
  customAmenities: z.array(z.object({
    id: z.string(),
    label: z.string()
  })).optional(),
  propertyType: z.string(),
  isActive: z.boolean().default(true),
  featured: z.boolean().default(false),
  googleCalendarSync: z.boolean().default(false),
  googleCalendarId: z.string().optional(),
  customPrices: z.array(z.object({
    id: z.string(),
    from: z.date(),
    to: z.date(),
    price: z.string()
  })).optional(),
  featuredImage: z.string().optional(),
}).refine(
  (data) => {
    return !data.googleCalendarSync || (data.googleCalendarSync && data.googleCalendarId && data.googleCalendarId.trim() !== "");
  },
  {
    message: "Google Calendar ID is required when Google Calendar Sync is enabled.",
    path: ["googleCalendarId"],
  }
);

const propertyTypes = [
  { value: "house", label: "House" },
  { value: "apartment", label: "Apartment" },
  { value: "cabin", label: "Cabin" },
  { value: "villa", label: "Villa" },
  { value: "condo", label: "Condominium" },
];

const amenitiesOptions = [
  { id: "wifi", label: "WiFi", category: "internet" },
  { id: "pool", label: "Swimming Pool", category: "outdoors" },
  { id: "gym", label: "Gym", category: "fitness" },
  { id: "parking", label: "Free Parking", category: "parking" },
  { id: "aircon", label: "Air Conditioning", category: "climate" },
  { id: "kitchen", label: "Kitchen", category: "kitchen" },
  { id: "tv", label: "TV", category: "entertainment" },
  { id: "washing", label: "Washing Machine", category: "laundry" },
  { id: "heating", label: "Heating", category: "climate" },
  { id: "balcony", label: "Balcony", category: "outdoors" },
  { id: "fireplace", label: "Fireplace", category: "climate" },
  { id: "bbq", label: "BBQ", category: "outdoors" },
  { id: "hotTub", label: "Hot Tub", category: "outdoors" },
  { id: "petsAllowed", label: "Pets Allowed", category: "policies" },
  { id: "childFriendly", label: "Child Friendly", category: "policies" },
  { id: "workspace", label: "Workspace", category: "office" },
];

// Group amenities by category for better UI organization
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

const NewProperty = () => {
  const navigate = useNavigate();
  const [uploadedImages, setUploadedImages] = useState<
    { name: string; url: string }[]
  >([]);
  const [customAmenities, setCustomAmenities] = useState<{ id: string; label: string }[]>([]);
  const [newAmenity, setNewAmenity] = useState("");
  const [customPrices, setCustomPrices] = useState<{
    id: string;
    from: Date;
    to: Date;
    price: string;
  }[]>([]);
  const [newCustomPrice, setNewCustomPrice] = useState({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 7)),
    price: "",
  });
  const [featuredImage, setFeaturedImage] = useState<{ name: string; url: string } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form values:", values);
    console.log("Uploaded images:", uploadedImages);
    console.log("Featured image:", featuredImage);
    console.log("Custom amenities:", customAmenities);
    console.log("Custom prices:", customPrices);

    notifyPropertyCreated({ 
      name: values.name,
      id: Math.random().toString(36).substr(2, 9)
    });

    navigate("/properties");
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

  const addCustomAmenity = () => {
    if (newAmenity.trim() !== "") {
      const newCustomAmenity = {
        id: `custom-${Date.now()}`,
        label: newAmenity.trim()
      };
      setCustomAmenities([...customAmenities, newCustomAmenity]);
      form.setValue("customAmenities", [...customAmenities, newCustomAmenity]);
      setNewAmenity("");
    }
  };

  const removeCustomAmenity = (id: string) => {
    const updatedAmenities = customAmenities.filter(amenity => amenity.id !== id);
    setCustomAmenities(updatedAmenities);
    form.setValue("customAmenities", updatedAmenities);
  };

  const addCustomPrice = () => {
    if (newCustomPrice.price.trim() !== "" && !isNaN(Number(newCustomPrice.price)) && Number(newCustomPrice.price) > 0) {
      const newPrice = {
        id: `price-${Date.now()}`,
        from: newCustomPrice.from,
        to: newCustomPrice.to,
        price: newCustomPrice.price
      };
      
      setCustomPrices([...customPrices, newPrice]);
      form.setValue("customPrices", [...customPrices, newPrice]);
      
      // Reset the form for new custom price
      setNewCustomPrice({
        from: new Date(),
        to: new Date(new Date().setDate(new Date().getDate() + 7)),
        price: "",
      });
    }
  };

  const removeCustomPrice = (id: string) => {
    const updatedPrices = customPrices.filter(price => price.id !== id);
    setCustomPrices(updatedPrices);
    form.setValue("customPrices", updatedPrices);
  };

  const watchGoogleCalendarSync = form.watch("googleCalendarSync");

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Add New Property</h1>
        <p className="text-muted-foreground mt-1">
          Fill in the details below to add a new vacation rental property
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

              {/* New geolocation coordinates input */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="e.g. 34.0259"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="e.g. -118.7798"
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
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Address (Optional)</FormLabel>
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
                      <FormLabel>Square Feet (Optional)</FormLabel>
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
                      <div className="relative">
                        <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          min="0"
                          placeholder="200"
                          className="pl-8"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Enter the base price per night in USD.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Updated custom pricing section with cards */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Custom Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Set custom prices for specific dates (e.g., holidays, peak seasons)
                  </p>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {customPrices.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {customPrices.map((priceItem) => (
                          <Card key={priceItem.id} className="bg-muted/40">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <Badge variant="success" className="mt-1">
                                  ${priceItem.price}/night
                                </Badge>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeCustomPrice(priceItem.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="text-sm space-y-1">
                                <div className="flex items-center gap-2">
                                  <CalendarLucide className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span>From: {format(priceItem.from, "MMM d, yyyy")}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CalendarLucide className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span>To: {format(priceItem.to, "MMM d, yyyy")}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                    
                    <Card>
                      <CardContent className="p-4 space-y-4">
                        <h4 className="text-sm font-medium">Add new custom price</h4>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="space-y-1">
                            <label className="text-xs font-medium">From</label>
                            <Input
                              type="date"
                              value={newCustomPrice.from.toISOString().split('T')[0]}
                              onChange={(e) => {
                                const date = new Date(e.target.value);
                                setNewCustomPrice({ ...newCustomPrice, from: date });
                              }}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium">To</label>
                            <Input
                              type="date"
                              value={newCustomPrice.to.toISOString().split('T')[0]}
                              onChange={(e) => {
                                const date = new Date(e.target.value);
                                setNewCustomPrice({ ...newCustomPrice, to: date });
                              }}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium">Price (USD)</label>
                            <div className="relative">
                              <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="number"
                                min="0"
                                placeholder="300"
                                className="pl-8"
                                value={newCustomPrice.price}
                                onChange={(e) => {
                                  setNewCustomPrice({ ...newCustomPrice, price: e.target.value });
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <Button 
                          type="button" 
                          variant="secondary" 
                          className="w-full"
                          onClick={addCustomPrice}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Custom Price
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
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
                      Select the type of property you are listing.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Improved amenities section with better layout */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Property Amenities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="amenities"
                    render={() => (
                      <FormItem>
                        <FormDescription className="mb-4">
                          Select the amenities available at your property
                        </FormDescription>
                        
                        <div className="space-y-5">
                          {Object.entries(amenitiesByCategory).map(([category, amenities]) => (
                            <div key={category} className="space-y-2">
                              <h3 className="text-sm font-medium">
                                {formatCategoryName(category)}
                              </h3>
                              <div className="grid grid-cols-2 gap-2">
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
                                          <FormLabel className="font-normal text-sm">
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
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Improved custom amenities section with inline add */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Custom Amenities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormDescription>
                    Add your own custom amenities not listed above
                  </FormDescription>
                  
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Enter amenity name..."
                        className="pl-8"
                        value={newAmenity}
                        onChange={(e) => setNewAmenity(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addCustomAmenity();
                          }
                        }}
                      />
                    </div>
                    <Button 
                      type="button" 
                      onClick={addCustomAmenity}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  
                  {customAmenities.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">Your Custom Amenities</h3>
                      <div className="flex flex-wrap gap-2">
                        {customAmenities.map((amenity) => (
                          <Badge 
                            key={amenity.id} 
                            variant="outline"
                            className="flex items-center gap-1 py-1.5"
                          >
                            {amenity.label}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                              onClick={() => removeCustomAmenity(amenity.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

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

              <div className="space-y-4 p-4 border rounded-md">
                <h3 className="text-lg font-medium">Calendar Sync</h3>
                
                <FormField
                  control={form.control}
                  name="googleCalendarSync"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-2">
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
                          Enter the Google Calendar ID to sync with. You can find this in your Google Calendar settings.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Improved featured image section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Featured Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="featuredImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormDescription className="mb-4">
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
                </CardContent>
              </Card>

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
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/properties")}
            >
              Cancel
            </Button>
            <Button type="submit">Create Property</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewProperty;

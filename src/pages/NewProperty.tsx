import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon, Building, Upload, X, Plus, MapPin, Calendar as CalendarLucide } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { notifyPropertyCreated } from "@/utils/property-notifications";

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

const amenitiesOptions = [
  { id: "wifi", label: "WiFi" },
  { id: "pool", label: "Swimming Pool" },
  { id: "gym", label: "Gym" },
  { id: "parking", label: "Free Parking" },
  { id: "aircon", label: "Air Conditioning" },
  { id: "kitchen", label: "Kitchen" },
  { id: "tv", label: "TV" },
  { id: "washing", label: "Washing Machine" },
  { id: "heating", label: "Heating" },
  { id: "balcony", label: "Balcony" },
  { id: "fireplace", label: "Fireplace" },
  { id: "bbq", label: "BBQ" },
  { id: "hotTub", label: "Hot Tub" },
  { id: "petsAllowed", label: "Pets Allowed" },
  { id: "childFriendly", label: "Child Friendly" },
  { id: "workspace", label: "Workspace" },
];

const propertyTypes = [
  { value: "house", label: "House" },
  { value: "apartment", label: "Apartment" },
  { value: "cabin", label: "Cabin" },
  { value: "villa", label: "Villa" },
  { value: "condo", label: "Condominium" },
];

const NewProperty = () => {
  const navigate = useNavigate();
  const [uploadedImages, setUploadedImages] = useState<
    { name: string; url: string }[]
  >([]);

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
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form values:", values);
    console.log("Uploaded images:", uploadedImages);

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

  const removeImage = (index: number) => {
    const newImages = [...uploadedImages];
    URL.revokeObjectURL(newImages[index].url);
    newImages.splice(index, 1);
    setUploadedImages(newImages);
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
                    <div className="grid grid-cols-2 gap-2">
                      {amenitiesOptions.map((item) => (
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
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              <div>
                <FormLabel>Property Images</FormLabel>
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
                    Upload high-quality images of your property.
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

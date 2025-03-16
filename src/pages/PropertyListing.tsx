
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Calendar, Home, Users, DollarSign, Star, Info, ShowerHead, Bed, Square, MapPin, Share, Heart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Property, PropertyType } from "@/types/property";
import PropertyBookingCard from "@/components/property/PropertyBookingCard";
import PropertyGallery from "@/components/property/PropertyGallery";
import PropertyAmenities from "@/components/property/PropertyAmenities";
import PropertyAvailabilityCalendar from "@/components/property/PropertyAvailabilityCalendar";
import PropertyLocationMap from "@/components/property/PropertyLocationMap";
import PropertyReviews from "@/components/property/PropertyReviews";
import { useToast } from "sonner";

// Mock property data for demonstration
const getMockProperty = (id: string): Property => {
  return {
    id,
    name: "Luxury Beachfront Villa",
    description: "Stunning beachfront villa with panoramic ocean views. This spacious retreat features a private pool, modern amenities, and direct beach access. Perfect for families or couples seeking a luxurious getaway.",
    location: "Malibu, California",
    address: "123 Ocean Drive, Malibu, CA 90265",
    price: 299,
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    squareFeet: 2200,
    amenities: [
      "Wi-Fi", 
      "Pool", 
      "Ocean View", 
      "Kitchen", 
      "Air Conditioning", 
      "TV", 
      "Washer & Dryer", 
      "Free Parking",
      "Beachfront",
      "BBQ Grill"
    ],
    availableFrom: new Date(),
    availableTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    propertyType: "villa" as PropertyType,
    status: "active",
    featured: true,
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg"
    ],
    heroImage: "/placeholder.svg",
    googleCalendarSync: true,
    googleCalendarId: "calendar123",
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

const PropertyListing = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [property, setProperty] = useState<Property | null>(id ? getMockProperty(id) : null);
  
  if (!property) {
    return (
      <div className="container py-10">
        <p>Property not found</p>
        <Button asChild className="mt-4">
          <Link to="/properties">View all properties</Link>
        </Button>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };
  
  const handleSaveProperty = () => {
    toast.success("Property saved to favorites");
  };

  return (
    <div className="container py-6 space-y-8 max-w-7xl mx-auto">
      {/* Property Header */}
      <div>
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-2xl md:text-3xl font-bold">{property.name}</h1>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={handleSaveProperty}>
              <Heart className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1 text-yellow-500" />
            <span className="font-medium mr-1">4.9</span>
            <span className="mr-2">(128 reviews)</span>
          </div>
          <Separator orientation="vertical" className="h-4 mx-2" />
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{property.location}</span>
          </div>
        </div>
      </div>

      {/* Property Gallery */}
      <PropertyGallery property={property} />
      
      {/* Property Content - Main + Sidebar layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-8">
          {/* Property Details */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-6">
              <div>
                <h2 className="text-xl font-semibold">
                  {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)} hosted by John
                </h2>
                <div className="flex items-center gap-x-4 mt-1 text-muted-foreground">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{property.maxGuests} guests</span>
                  </div>
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    <span>{property.bedrooms} bedrooms</span>
                  </div>
                  <div className="flex items-center">
                    <ShowerHead className="h-4 w-4 mr-1" />
                    <span>{property.bathrooms} bathrooms</span>
                  </div>
                  {property.squareFeet && (
                    <div className="flex items-center">
                      <Square className="h-4 w-4 mr-1" />
                      <span>{property.squareFeet} sq ft</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Home className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{property.description}</p>
            </div>
          </div>
          
          {/* Property Amenities */}
          <PropertyAmenities amenities={property.amenities} />
          
          {/* Property Tabs - Calendar, Reviews, Location */}
          <Tabs defaultValue="calendar">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="calendar">
                <Calendar className="h-4 w-4 mr-2" />
                Availability
              </TabsTrigger>
              <TabsTrigger value="reviews">
                <Star className="h-4 w-4 mr-2" />
                Reviews
              </TabsTrigger>
              <TabsTrigger value="location">
                <MapPin className="h-4 w-4 mr-2" />
                Location
              </TabsTrigger>
            </TabsList>
            <TabsContent value="calendar" className="py-4">
              <PropertyAvailabilityCalendar property={property} />
            </TabsContent>
            <TabsContent value="reviews" className="py-4">
              <PropertyReviews propertyId={property.id} />
            </TabsContent>
            <TabsContent value="location" className="py-4">
              <PropertyLocationMap property={property} />
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Booking Card Sidebar */}
        <div className="lg:col-span-1">
          <PropertyBookingCard property={property} />
        </div>
      </div>
    </div>
  );
};

export default PropertyListing;

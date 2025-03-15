
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Calendar, Edit, Trash2, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Property, PropertyStatus } from "@/types/property";

// Mock data for demo purposes - in a real app, this would come from an API call
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
  googleCalendarSync: true,
  googleCalendarId: "example@gmail.com",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const statusColors: Record<PropertyStatus, string> = {
  active: "bg-green-100 text-green-800 hover:bg-green-200",
  inactive: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  maintenance: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  booked: "bg-blue-100 text-blue-800 hover:bg-blue-200",
};

const amenityLabels: Record<string, string> = {
  wifi: "WiFi",
  pool: "Swimming Pool",
  gym: "Gym",
  parking: "Free Parking",
  aircon: "Air Conditioning",
  kitchen: "Kitchen",
  tv: "TV",
  washing: "Washing Machine",
  heating: "Heating",
  balcony: "Balcony",
  fireplace: "Fireplace",
  bbq: "BBQ",
  hotTub: "Hot Tub",
  petsAllowed: "Pets Allowed",
  childFriendly: "Child Friendly",
  workspace: "Workspace",
};

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<Property>(mockPropertyData);

  // In a real application, fetch property data from API
  useEffect(() => {
    // Mock API call to fetch property details
    console.log(`Fetching property details for ID: ${id}`);
    
    // For demo purposes, we're using mock data
    // In a real app, you would fetch from your API here
  }, [id]);

  if (!property) {
    return <div className="p-6">Loading property details...</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center mb-2">
            <Link
              to="/properties"
              className="text-sm text-muted-foreground flex items-center mr-2"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Properties
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">
              {property.name}
            </h1>
          </div>
          <p className="text-muted-foreground">
            {property.location}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link to={`/properties/${id}/calendar`}>
              <Calendar className="mr-2 h-4 w-4" />
              View Calendar
            </Link>
          </Button>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Description</h3>
                <p className="text-muted-foreground">{property.description}</p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-medium mb-1">Type</h3>
                  <p>{property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Price</h3>
                  <p>${property.price} / night</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Status</h3>
                  <Badge className={statusColors[property.status]}>
                    {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Bedrooms</h3>
                  <p>{property.bedrooms}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Bathrooms</h3>
                  <p>{property.bathrooms}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Max Guests</h3>
                  <p>{property.maxGuests}</p>
                </div>
                {property.squareFeet && (
                  <div>
                    <h3 className="font-medium mb-1">Square Feet</h3>
                    <p>{property.squareFeet}</p>
                  </div>
                )}
                <div>
                  <h3 className="font-medium mb-1">Featured</h3>
                  <p>{property.featured ? "Yes" : "No"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {property.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center">
                    <Badge variant="outline" className="mr-2 bg-slate-50">
                      ✓
                    </Badge>
                    <span>{amenityLabels[amenity] || amenity}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Calendar & Bookings</CardTitle>
              <CardDescription>
                Manage your property's availability
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Available Period</h3>
                <p className="text-sm">
                  From: {property.availableFrom.toLocaleDateString()}
                </p>
                <p className="text-sm">
                  To: {property.availableTo.toLocaleDateString()}
                </p>
              </div>
              
              {property.googleCalendarSync && (
                <div>
                  <h3 className="font-medium mb-1">Google Calendar</h3>
                  <p className="text-sm flex items-center text-green-600">
                    <Badge variant="outline" className="mr-2 bg-green-50 text-green-600 border-green-200">
                      Connected
                    </Badge>
                    Two-way sync enabled
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to={`/properties/${id}/calendar`}>
                  <Calendar className="mr-2 h-4 w-4" />
                  View Calendar
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
              <CardDescription>
                Only shared with guests after booking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{property.address}</p>
              <div className="mt-4">
                <Button variant="outline" className="w-full" size="sm">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View on Maps
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;

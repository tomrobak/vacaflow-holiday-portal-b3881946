
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Calendar, Edit, Trash2, ExternalLink, MapPin, Grid, Check, Share } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Property, PropertyStatus } from "@/types/property";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
  amenities: ["wifi", "pool", "kitchen", "aircon", "washing", "parking", "beachfront", "mountainView", "netflix", "breakfast"],
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
  dishwasher: "Dishwasher",
  beachfront: "Beachfront",
  waterfront: "Waterfront",
  mountainView: "Mountain View",
  cityView: "City View",
  doorman: "Doorman",
  elevator: "Elevator",
  wheelchairAccessible: "Wheelchair Accessible",
  breakfast: "Breakfast",
  smokeAlarm: "Smoke Alarm",
  carbonMonoxideAlarm: "Carbon Monoxide Alarm",
  firstAidKit: "First Aid Kit",
  sauna: "Sauna",
  jacuzzi: "Jacuzzi",
  netflix: "Netflix",
  gameConsole: "Game Console",
  boardGames: "Board Games",
  bikeRental: "Bike Rental",
  kayak: "Kayak",
  coffeemaker: "Coffee Maker",
  ironingEquipment: "Ironing Equipment",
  hairdryer: "Hair Dryer",
  selfCheckIn: "Self Check-In",
  privateEntrance: "Private Entrance",
};

// Group amenities by category for display
const amenityCategories: Record<string, string[]> = {
  "Essentials": ["wifi", "kitchen", "washing", "workspace", "aircon", "heating", "ironingEquipment", "hairdryer"],
  "Features": ["pool", "hotTub", "balcony", "fireplace", "bbq", "sauna", "jacuzzi"],
  "Location": ["beachfront", "waterfront", "mountainView", "cityView"],
  "Entertainment": ["tv", "netflix", "gameConsole", "boardGames"],
  "Services": ["breakfast", "doorman", "selfCheckIn"],
  "Safety": ["smokeAlarm", "carbonMonoxideAlarm", "firstAidKit"],
  "Accessibility": ["elevator", "wheelchairAccessible", "privateEntrance"],
};

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // In a real application, fetch property data from API
  useEffect(() => {
    // Mock API call to fetch property details
    console.log(`Fetching property details for ID: ${id}`);
    
    // For demo purposes, we're using mock data
    // In a real app, you would fetch from your API here
    setProperty(mockPropertyData);
  }, [id]);

  if (!property) {
    return (
      <div className="p-6 flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading property details...</p>
        </div>
      </div>
    );
  }

  // Get filtered amenities by category for display
  const getAmenitiesByCategory = (category: string) => {
    return property.amenities.filter(amenity => 
      amenityCategories[category]?.includes(amenity)
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Top navigation */}
      <div className="flex items-center mb-2 p-6 pb-0">
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
      
      {/* Property header with status and actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 py-2">
        <div className="flex items-center gap-2">
          <Badge className={statusColors[property.status]}>
            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </Badge>
          <p className="text-muted-foreground flex items-center">
            <MapPin className="h-4 w-4 mr-1" /> {property.location}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link to={`/properties/${id}/calendar`}>
              <Calendar className="mr-2 h-4 w-4" />
              Calendar
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to={`/properties/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button variant="outline">
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Hero image and gallery */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
          {/* Hero image - takes up 8 columns on md screens */}
          <div 
            className="md:col-span-8 h-[400px] rounded-lg overflow-hidden relative cursor-pointer group"
            onClick={() => {
              setActiveImage(property.heroImage || null);
              setIsGalleryOpen(true);
            }}
          >
            {property.heroImage ? (
              <>
                <img 
                  src={property.heroImage} 
                  alt={property.name} 
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button variant="secondary">View Photos</Button>
                </div>
              </>
            ) : (
              <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                <p className="text-muted-foreground">No hero image available</p>
              </div>
            )}
          </div>
          
          {/* Gallery preview - takes up 4 columns on md screens */}
          <div className="md:col-span-4 grid grid-cols-2 gap-2 h-[400px]">
            {property.gallery && property.gallery.length > 0 ? (
              property.gallery.slice(0, 4).map((image, index) => (
                <div 
                  key={index} 
                  className="overflow-hidden rounded-lg h-full relative cursor-pointer group"
                  onClick={() => {
                    setActiveImage(image);
                    setIsGalleryOpen(true);
                  }}
                >
                  <img 
                    src={image} 
                    alt={`Gallery ${index + 1}`} 
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))
            ) : (
              <div className="col-span-2 h-full bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">No gallery images</p>
              </div>
            )}
          </div>
        </div>
        
        {/* View all photos button */}
        {(property.gallery && property.gallery.length > 0) && (
          <div className="mt-2 flex justify-end">
            <Button 
              variant="outline" 
              onClick={() => {
                setActiveImage(property.heroImage || property.gallery?.[0] || null);
                setIsGalleryOpen(true);
              }}
              className="gap-2"
            >
              <Grid className="h-4 w-4" />
              View all photos
            </Button>
          </div>
        )}
      </div>

      {/* Property details tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="px-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="amenities">Amenities</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>
        
        {/* Overview tab */}
        <TabsContent value="overview" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-3">Quick Facts</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="h-8 w-8 rounded-full flex items-center justify-center p-0">
                          <span className="text-xs font-normal">{property.propertyType.slice(0, 1).toUpperCase()}</span>
                        </Badge>
                        <div>
                          <p className="text-sm font-medium">Type</p>
                          <p className="text-sm text-muted-foreground">
                            {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="h-8 w-8 rounded-full flex items-center justify-center p-0">
                          <span className="text-xs font-normal">{property.bedrooms}</span>
                        </Badge>
                        <div>
                          <p className="text-sm font-medium">Bedrooms</p>
                          <p className="text-sm text-muted-foreground">
                            {property.bedrooms} {property.bedrooms === 1 ? 'bedroom' : 'bedrooms'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="h-8 w-8 rounded-full flex items-center justify-center p-0">
                          <span className="text-xs font-normal">{property.bathrooms}</span>
                        </Badge>
                        <div>
                          <p className="text-sm font-medium">Bathrooms</p>
                          <p className="text-sm text-muted-foreground">
                            {property.bathrooms} {property.bathrooms === 1 ? 'bathroom' : 'bathrooms'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="h-8 w-8 rounded-full flex items-center justify-center p-0">
                          <span className="text-xs font-normal">{property.maxGuests}</span>
                        </Badge>
                        <div>
                          <p className="text-sm font-medium">Guests</p>
                          <p className="text-sm text-muted-foreground">
                            Up to {property.maxGuests} {property.maxGuests === 1 ? 'guest' : 'guests'}
                          </p>
                        </div>
                      </div>
                      
                      {property.squareFeet && (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="h-8 w-8 rounded-full flex items-center justify-center p-0">
                            <span className="text-xs font-normal">ft²</span>
                          </Badge>
                          <div>
                            <p className="text-sm font-medium">Size</p>
                            <p className="text-sm text-muted-foreground">
                              {property.squareFeet} sq ft
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="h-8 w-8 rounded-full flex items-center justify-center p-0">
                          <span className="text-xs font-normal">$</span>
                        </Badge>
                        <div>
                          <p className="text-sm font-medium">Price</p>
                          <p className="text-sm text-muted-foreground">
                            ${property.price}/night
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-3">Top Amenities</h3>
                    <div className="grid grid-cols-2 gap-y-2">
                      {property.amenities.slice(0, 6).map((amenity) => (
                        <div key={amenity} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{amenityLabels[amenity] || amenity}</span>
                        </div>
                      ))}
                    </div>
                    {property.amenities.length > 6 && (
                      <Button 
                        variant="link" 
                        className="mt-2 h-8 px-0"
                        onClick={() => setActiveTab("amenities")}
                      >
                        Show all {property.amenities.length} amenities
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-semibold">${property.price}</p>
                      <p className="text-sm text-muted-foreground">per night</p>
                    </div>
                    <Badge className={`${statusColors[property.status]} capitalize`}>
                      {property.status}
                    </Badge>
                  </div>
                  
                  <Separator />
                  
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
                <CardFooter className="flex flex-col gap-2">
                  <Button asChild className="w-full">
                    <Link to={`/properties/${id}/calendar`}>
                      <Calendar className="mr-2 h-4 w-4" />
                      View Calendar
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link to={`/bookings/new?propertyId=${id}`}>
                      Create New Booking
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                  <CardDescription>
                    Only shared with guests after booking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{property.address}</p>
                  <div className="mt-4 bg-gray-100 h-36 rounded-md flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Map preview</p>
                  </div>
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
        </TabsContent>
        
        {/* Amenities tab */}
        <TabsContent value="amenities" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>All Amenities</CardTitle>
              <CardDescription>
                Features and facilities available at this property
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {Object.entries(amenityCategories).map(([category, amenityList]) => {
                  const categoryAmenities = getAmenitiesByCategory(category);
                  if (categoryAmenities.length === 0) return null;
                  
                  return (
                    <div key={category}>
                      <h3 className="text-lg font-medium mb-4">{category}</h3>
                      <div className="space-y-3">
                        {categoryAmenities.map(amenity => (
                          <div key={amenity} className="flex items-center gap-3">
                            <Check className="h-5 w-5 text-green-500" />
                            <span>{amenityLabels[amenity] || amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Location tab */}
        <TabsContent value="location" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
              <CardDescription>Property location and surroundings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-100 h-96 rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Map preview would be displayed here</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Address</h3>
                <p className="text-muted-foreground">{property.address}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Area</h3>
                <p className="text-muted-foreground">
                  {property.location}
                </p>
              </div>
              
              <Button variant="outline">
                <ExternalLink className="mr-2 h-4 w-4" />
                View on Google Maps
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Availability tab */}
        <TabsContent value="availability" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
              <CardDescription>Manage your property's availability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Available Period</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-md">
                    <p className="text-sm font-medium mb-1">From</p>
                    <p>{property.availableFrom.toLocaleDateString()}</p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <p className="text-sm font-medium mb-1">To</p>
                    <p>{property.availableTo.toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              {property.googleCalendarSync && (
                <div>
                  <h3 className="font-medium mb-2">Google Calendar Integration</h3>
                  <div className="p-4 border rounded-md bg-green-50">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Connected to Google Calendar</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Calendar ID: {property.googleCalendarId}
                        </p>
                        <p className="text-sm text-green-600 mt-2">
                          Two-way synchronization is enabled
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col space-y-4">
                <Button asChild>
                  <Link to={`/properties/${id}/calendar`}>
                    <Calendar className="mr-2 h-4 w-4" />
                    View Booking Calendar
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to={`/properties/${id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Availability
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Full-screen gallery dialog */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0">
          <DialogHeader className="absolute top-0 left-0 right-0 z-10 px-6 py-4 bg-gradient-to-b from-black/80 to-transparent text-white">
            <DialogTitle>Property Gallery</DialogTitle>
            <DialogDescription className="text-gray-200">
              {property.name} - {property.location}
            </DialogDescription>
          </DialogHeader>
          <div className="h-[80vh] relative">
            <Carousel className="w-full h-full">
              <CarouselContent className="h-full">
                {/* Include hero image first */}
                {property.heroImage && (
                  <CarouselItem className="h-full">
                    <div className="h-full flex items-center justify-center p-6">
                      <img
                        src={property.heroImage}
                        alt="Hero"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </CarouselItem>
                )}
                
                {/* Include all gallery images */}
                {property.gallery?.map((image, index) => (
                  <CarouselItem key={index} className="h-full">
                    <div className="h-full flex items-center justify-center p-6">
                      <img
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertyDetail;

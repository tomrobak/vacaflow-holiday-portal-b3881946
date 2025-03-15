import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  Calendar,
  Eye,
  List,
  Grid,
  MapPin,
  Bed,
  Bath,
  Building,
  Filter,
  SlidersHorizontal,
  Check,
  X,
} from "lucide-react";

const properties = [
  {
    id: 1,
    name: "Sunset Villa",
    location: "Malibu, CA",
    price: "$350/night",
    beds: 4,
    baths: 3,
    description:
      "A beautiful beachfront villa with panoramic ocean views and modern amenities.",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
    type: "Villa",
    status: "Active",
    bookings: 12,
  },
  {
    id: 2,
    name: "Mountain Retreat",
    location: "Aspen, CO",
    price: "$275/night",
    beds: 3,
    baths: 2,
    description:
      "Cozy cabin nestled in the mountains, perfect for skiing and hiking trips.",
    image: "https://images.unsplash.com/photo-1542718610-a1d656d1884c",
    type: "Cabin",
    status: "Active",
    bookings: 8,
  },
  {
    id: 3,
    name: "Downtown Loft",
    location: "New York, NY",
    price: "$200/night",
    beds: 2,
    baths: 1,
    description:
      "Modern loft in the heart of the city, walking distance to attractions.",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
    type: "Apartment",
    status: "Active",
    bookings: 15,
  },
  {
    id: 4,
    name: "Lakeside Cottage",
    location: "Lake Tahoe, NV",
    price: "$225/night",
    beds: 3,
    baths: 2,
    description:
      "Charming cottage on the shores of Lake Tahoe with private dock.",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
    type: "Cottage",
    status: "Inactive",
    bookings: 5,
  },
  {
    id: 5,
    name: "Palm Springs Oasis",
    location: "Palm Springs, CA",
    price: "$300/night",
    beds: 4,
    baths: 3,
    description:
      "Modern desert home with private pool and spectacular mountain views.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
    type: "House",
    status: "Active",
    bookings: 9,
  },
  {
    id: 6,
    name: "Oceanfront Condo",
    location: "Miami, FL",
    price: "$280/night",
    beds: 3,
    baths: 2,
    description:
      "Luxurious oceanfront condo with beach access and resort amenities.",
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf",
    type: "Condo",
    status: "Active",
    bookings: 18,
  },
];

const Properties = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");

  const propertyTypes = Array.from(new Set(properties.map(p => p.type)));

  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      property.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPropertyType = propertyTypeFilter === null || property.type === propertyTypeFilter;
    const matchesStatus = statusFilter === null || property.status === statusFilter;
    
    return matchesSearch && matchesPropertyType && matchesStatus;
  });

  const clearFilters = () => {
    setPropertyTypeFilter(null);
    setStatusFilter(null);
  };

  const activeFiltersCount = [
    propertyTypeFilter !== null,
    statusFilter !== null
  ].filter(Boolean).length;

  const PropertyCard = ({ property }: { property: typeof properties[0] }) => (
    <Card key={property.id} className="overflow-hidden">
      <div className="relative h-48 w-full">
        <img
          src={property.image}
          alt={property.name}
          className="h-full w-full object-cover"
        />
        <Badge
          className="absolute top-2 right-2"
          variant={property.status === "Active" ? "default" : "secondary"}
        >
          {property.status}
        </Badge>
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{property.name}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
              {property.location}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={`/properties/${property.id}`} className="flex items-center cursor-pointer">
                  <Eye className="mr-2 h-4 w-4" />
                  <span>View Details</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/properties/${property.id}/edit`} className="flex items-center cursor-pointer">
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit Property</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/properties/${property.id}/calendar`} className="flex items-center cursor-pointer">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Manage Calendar</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive cursor-pointer">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete Property</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
          <div className="flex items-center">
            <Bed className="h-3.5 w-3.5 mr-1" />
            {property.beds} Beds
          </div>
          <div className="flex items-center">
            <Bath className="h-3.5 w-3.5 mr-1" />
            {property.baths} Baths
          </div>
          <div className="flex items-center">
            <Building className="h-3.5 w-3.5 mr-1" />
            {property.type}
          </div>
          <div className="font-medium text-foreground ml-auto">
            {property.price}
          </div>
        </div>
        <p className="text-sm line-clamp-2">{property.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" className="flex-1" asChild>
          <Link to={`/properties/${property.id}`}>
            View Details
          </Link>
        </Button>
        <Button className="flex-1" asChild>
          <Link to={`/properties/${property.id}/calendar`}>
            <Calendar className="mr-2 h-4 w-4" /> Calendar
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );

  const PropertyListItem = ({ property }: { property: typeof properties[0] }) => (
    <div className="flex flex-col md:flex-row gap-4 border rounded-lg overflow-hidden">
      <div className="w-full md:w-48 h-48 md:h-auto">
        <img
          src={property.image}
          alt={property.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex-1 p-4 flex flex-col">
        <div className="flex justify-between">
          <div>
            <h3 className="text-xl font-semibold">{property.name}</h3>
            <p className="text-muted-foreground flex items-center mt-1">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              {property.location}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <Badge variant={property.status === "Active" ? "default" : "secondary"}>
              {property.status}
            </Badge>
            <p className="font-medium mt-1">{property.price}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground my-2">
          <div className="flex items-center">
            <Bed className="h-3.5 w-3.5 mr-1" />
            {property.beds} Beds
          </div>
          <div className="flex items-center">
            <Bath className="h-3.5 w-3.5 mr-1" />
            {property.baths} Baths
          </div>
          <div className="flex items-center">
            <Building className="h-3.5 w-3.5 mr-1" />
            {property.type}
          </div>
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            {property.bookings} Bookings
          </div>
        </div>
        
        <p className="text-sm line-clamp-2 flex-1">{property.description}</p>
        
        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/properties/${property.id}`}>
              <Eye className="mr-2 h-4 w-4" /> View
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to={`/properties/${property.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link to={`/properties/${property.id}/calendar`}>
              <Calendar className="mr-2 h-4 w-4" /> Calendar
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-auto h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Calendar className="mr-2 h-4 w-4" />
                <span>Manage Availability</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete Property</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground mt-1">
            Manage your vacation rental properties
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search properties..."
              className="pl-8 w-full sm:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button asChild>
            <Link to="/properties/new">
              <Plus className="mr-2 h-4 w-4" /> Add Property
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 px-1 py-0" variant="secondary">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Property Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {propertyTypes.map(type => (
                <DropdownMenuItem 
                  key={type}
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setPropertyTypeFilter(current => current === type ? null : type)}
                >
                  {propertyTypeFilter === type && <Check className="h-4 w-4" />}
                  <span className={propertyTypeFilter === type ? "font-medium" : ""}>
                    {type}
                  </span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setStatusFilter(current => current === "Active" ? null : "Active")}
              >
                {statusFilter === "Active" && <Check className="h-4 w-4" />}
                <span className={statusFilter === "Active" ? "font-medium" : ""}>
                  Active
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setStatusFilter(current => current === "Inactive" ? null : "Inactive")}
              >
                {statusFilter === "Inactive" && <Check className="h-4 w-4" />}
                <span className={statusFilter === "Inactive" ? "font-medium" : ""}>
                  Inactive
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="flex justify-center text-primary cursor-pointer"
                onClick={clearFilters}
                disabled={activeFiltersCount === 0}
              >
                Clear Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {propertyTypeFilter && (
            <Badge variant="outline" className="flex items-center gap-1 h-9 px-3">
              Type: {propertyTypeFilter}
              <Button 
                variant="ghost" 
                className="h-4 w-4 p-0 ml-1" 
                onClick={() => setPropertyTypeFilter(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {statusFilter && (
            <Badge variant="outline" className="flex items-center gap-1 h-9 px-3">
              Status: {statusFilter}
              <Button 
                variant="ghost" 
                className="h-4 w-4 p-0 ml-1" 
                onClick={() => setStatusFilter(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
        
        <div className="flex items-center bg-muted rounded-md p-1">
          <Button
            variant={view === "grid" ? "default" : "ghost"}
            size="sm"
            className="h-8"
            onClick={() => setView("grid")}
          >
            <Grid className="h-4 w-4 mr-1" /> Grid
          </Button>
          <Button
            variant={view === "list" ? "default" : "ghost"}
            size="sm"
            className="h-8"
            onClick={() => setView("list")}
          >
            <List className="h-4 w-4 mr-1" /> List
          </Button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProperties.map((property) => (
            <PropertyListItem key={property.id} property={property} />
          ))}
        </div>
      )}

      {filteredProperties.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No properties found</p>
          <Button className="mt-4" asChild>
            <Link to="/properties/new">
              <Plus className="mr-2 h-4 w-4" /> Add Your First Property
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Properties;

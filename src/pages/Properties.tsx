
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Edit,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  Calendar,
  Eye,
} from "lucide-react";

const Properties = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock properties data - in a real app, this would come from the API
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
    },
  ];

  // Filter properties based on search query
  const filteredProperties = properties.filter(property =>
    property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.location.toLowerCase().includes(searchQuery.toLowerCase())
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

      {/* Properties grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <Card key={property.id} className="overflow-hidden">
            <div className="relative h-48 w-full">
              <img
                src={property.image}
                alt={property.name}
                className="h-full w-full object-cover"
              />
            </div>
            <CardHeader className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{property.name}</CardTitle>
                  <CardDescription>{property.location}</CardDescription>
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
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      <span>View Details</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit Property</span>
                    </DropdownMenuItem>
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
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                <div>{property.beds} Beds</div>
                <div>{property.baths} Baths</div>
                <div className="font-medium text-foreground">
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
                <Link to={`/calendar?property=${property.id}`}>
                  <Calendar className="mr-2 h-4 w-4" /> Calendar
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

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

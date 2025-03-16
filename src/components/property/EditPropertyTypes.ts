
import { Property, PropertyFormData } from "@/types/property";
import { z } from "zod";

// Property type options constant
export const propertyTypes = [
  { value: "house", label: "House" },
  { value: "apartment", label: "Apartment" },
  { value: "cabin", label: "Cabin" },
  { value: "villa", label: "Villa" },
  { value: "condo", label: "Condominium" },
];

// Amenities options
export const amenitiesOptions = [
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

// Helper function to group amenities by category
export const getAmenitiesByCategory = () => {
  return amenitiesOptions.reduce((acc, amenity) => {
    if (!acc[amenity.category]) {
      acc[amenity.category] = [];
    }
    acc[amenity.category].push(amenity);
    return acc;
  }, {} as Record<string, typeof amenitiesOptions>);
};

// Format category name for display
export const formatCategoryName = (category: string) => {
  return category.charAt(0).toUpperCase() + category.slice(1);
};

// Form validation schema
export const propertyFormSchema = z.object({
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
  availableFrom: z.date().optional(),
  availableTo: z.date().optional(),
  propertyType: z.string().optional(),
  isActive: z.boolean().default(true),
  featured: z.boolean().default(false),
  googleCalendarSync: z.boolean().default(false),
  googleCalendarId: z.string().optional(),
  heroImage: z.string().optional(),
  gallery: z.array(z.string()).optional(),
}).refine(
  (data) => {
    return !data.availableFrom || !data.availableTo || data.availableTo > data.availableFrom;
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

// Mock addon data
export const mockAddons = [
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

// Mock property data
export const mockPropertyData: Property = {
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


export type PropertyType = 'house' | 'apartment' | 'cabin' | 'villa' | 'condo';

export type PropertyStatus = 'active' | 'inactive' | 'maintenance' | 'booked';

export interface PropertyAmenity {
  id: string;
  name: string;
}

export interface Property {
  id: string;
  name: string;
  description: string;
  location: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  squareFeet?: number;
  amenities: string[];
  availableFrom: Date;
  availableTo: Date;
  propertyType: PropertyType;
  status: PropertyStatus;
  featured: boolean;
  images: string[];
  heroImage?: string;
  gallery?: string[];
  addons?: string[]; // IDs of available addons
  googleCalendarSync?: boolean;
  googleCalendarId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyFormData {
  name?: string;
  description?: string;
  location?: string;
  address?: string;
  price?: string;
  bedrooms?: string;
  bathrooms?: string;
  maxGuests?: string;
  squareFeet?: string;
  amenities?: string[];
  availableFrom: Date;
  availableTo: Date;
  propertyType: string;
  isActive: boolean;
  featured?: boolean;
  googleCalendarSync?: boolean;
  googleCalendarId?: string;
  heroImage?: string;
  gallery?: string[];
  addons?: string[];
}

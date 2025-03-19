
export type AddonCategory = 'checkout' | 'checkin' | 'transportation' | 'entertainment' | 'other';

export interface Addon {
  id: string;
  name: string;
  description: string;
  price: number;
  category: AddonCategory;
  featuredImage?: string;
  gallery?: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AddonFormValues {
  name: string;
  description: string;
  price: string;
  category: string;
  featuredImage?: string;
  gallery?: string[];
  active: boolean;
}

export interface PropertyAddon {
  addonId: string;
  propertyId: string;
  price: number;
  active: boolean;
}

export interface SelectedAddon {
  addonId: string;
  quantity?: number;
  notes?: string;
}


export interface Addon {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
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

export type AddonCategory = 'checkout' | 'checkin' | 'transportation' | 'entertainment' | 'other';

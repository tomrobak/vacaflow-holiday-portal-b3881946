import { useState } from "react";
import { toast } from "sonner";
import { Addon, AddonCategory, AddonFormValues } from "@/types/addon";

// Mock data for addons
const mockAddons: Addon[] = [
  {
    id: "1",
    name: "Late Checkout",
    description: "Extend your stay until 3 PM instead of the standard 11 AM checkout time.",
    price: 45,
    category: "checkout",
    featuredImage: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    gallery: [
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
    ],
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
    gallery: [],
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
    gallery: [],
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
    gallery: [
      "https://images.unsplash.com/photo-1472396961693-142e6e269027",
      "https://images.unsplash.com/photo-1466721591366-2d5fba72006d"
    ],
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const categoryLabels: Record<string, string> = {
  all: "All Categories",
  checkout: "Checkout",
  checkin: "Check-in",
  transportation: "Transportation",
  entertainment: "Entertainment",
  other: "Other",
};

export const initialAddonForm: AddonFormValues = {
  name: "",
  description: "",
  price: "",
  category: "other",
  featuredImage: "",
  gallery: [],
  active: true
};

export function useAddons() {
  const [addons, setAddons] = useState<Addon[]>(mockAddons);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentAddon, setCurrentAddon] = useState<Addon | null>(null);
  const [newAddon, setNewAddon] = useState<AddonFormValues>(initialAddonForm);
  
  // Filter addons based on search query and category
  const filteredAddons = addons.filter(addon => {
    const matchesSearch = addon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          addon.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || addon.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddAddon = () => {
    if (!newAddon.name || !newAddon.description || !newAddon.price) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const price = parseFloat(newAddon.price);
    if (isNaN(price) || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    
    const newAddonEntry: Addon = {
      id: Date.now().toString(),
      name: newAddon.name,
      description: newAddon.description,
      price: price,
      category: newAddon.category as AddonCategory,
      featuredImage: newAddon.featuredImage,
      gallery: newAddon.gallery,
      active: newAddon.active,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setAddons([...addons, newAddonEntry]);
    setIsAddDialogOpen(false);
    setNewAddon(initialAddonForm);
    
    toast.success("Addon added successfully");
  };

  const handleEditAddon = () => {
    if (!currentAddon) return;
    
    if (!currentAddon.name || !currentAddon.description || currentAddon.price <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setAddons(addons.map(addon => 
      addon.id === currentAddon.id ? currentAddon : addon
    ));
    
    setIsEditDialogOpen(false);
    setCurrentAddon(null);
    toast.success("Addon updated successfully");
  };

  const handleDeleteAddon = (id: string) => {
    setAddons(addons.filter(addon => addon.id !== id));
    toast.success("Addon deleted successfully");
  };
  
  const handleUploadImage = (type: 'featured' | 'gallery', addonState: 'new' | 'current') => {
    // In a real app, this would open a file upload dialog
    // For now, we'll just simulate adding a random image URL
    const randomImages = [
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
      "https://images.unsplash.com/photo-1472396961693-142e6e269027",
      "https://images.unsplash.com/photo-1466721591366-2d5fba72006d"
    ];
    
    const randomImage = randomImages[Math.floor(Math.random() * randomImages.length)];
    
    if (addonState === 'new') {
      if (type === 'featured') {
        setNewAddon({...newAddon, featuredImage: randomImage});
      } else {
        setNewAddon({...newAddon, gallery: [...(newAddon.gallery || []), randomImage]});
      }
    } else if (currentAddon && addonState === 'current') {
      if (type === 'featured') {
        setCurrentAddon({...currentAddon, featuredImage: randomImage});
      } else {
        setCurrentAddon({
          ...currentAddon, 
          gallery: [...(currentAddon.gallery || []), randomImage]
        });
      }
    }
    
    toast.success("Image uploaded successfully");
  };
  
  const removeImage = (
    type: 'featured' | 'gallery', 
    index: number = 0,
    addonState: 'new' | 'current'
  ) => {
    if (addonState === 'new') {
      if (type === 'featured') {
        setNewAddon({...newAddon, featuredImage: ""});
      } else {
        const newGallery = [...(newAddon.gallery || [])];
        newGallery.splice(index, 1);
        setNewAddon({...newAddon, gallery: newGallery});
      }
    } else if (currentAddon && addonState === 'current') {
      if (type === 'featured') {
        setCurrentAddon({...currentAddon, featuredImage: ""});
      } else {
        const newGallery = [...(currentAddon.gallery || [])];
        newGallery.splice(index, 1);
        setCurrentAddon({...currentAddon, gallery: newGallery});
      }
    }
  };

  return {
    addons: filteredAddons,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    currentAddon,
    setCurrentAddon,
    newAddon,
    setNewAddon,
    handleAddAddon,
    handleEditAddon,
    handleDeleteAddon,
    handleUploadImage,
    removeImage,
    clearFilters: () => {
      setSearchQuery("");
      setCategoryFilter("all");
    }
  };
}

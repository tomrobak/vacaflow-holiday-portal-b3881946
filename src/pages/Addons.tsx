
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  PlusCircle, 
  Search, 
  Edit, 
  Trash2, 
  Package, 
  Clock, 
  Train, 
  Camera, 
  Filter 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Addon, AddonCategory } from "@/types/addon";

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

const categoryIcons: Record<string, React.ReactNode> = {
  checkout: <Clock className="h-5 w-5" />,
  checkin: <Clock className="h-5 w-5" />,
  transportation: <Train className="h-5 w-5" />,
  entertainment: <Camera className="h-5 w-5" />,
  other: <Package className="h-5 w-5" />,
};

const categoryLabels: Record<string, string> = {
  checkout: "Checkout",
  checkin: "Check-in",
  transportation: "Transportation",
  entertainment: "Entertainment",
  other: "Other",
};

const Addons = () => {
  const navigate = useNavigate();
  const [addons, setAddons] = useState<Addon[]>(mockAddons);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentAddon, setCurrentAddon] = useState<Addon | null>(null);
  const [newAddon, setNewAddon] = useState({
    name: "",
    description: "",
    price: "",
    category: "other",
    featuredImage: "",
    gallery: [] as string[],
    active: true
  });
  
  // Filter addons based on search query and category
  const filteredAddons = addons.filter(addon => {
    const matchesSearch = addon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         addon.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "" || addon.category === categoryFilter;
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
    setNewAddon({
      name: "",
      description: "",
      price: "",
      category: "other",
      featuredImage: "",
      gallery: [],
      active: true
    });
    
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
        setNewAddon({...newAddon, gallery: [...newAddon.gallery, randomImage]});
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
    
    toast.success(`Image uploaded successfully`);
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
        const newGallery = [...newAddon.gallery];
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

  return (
    <div className="container py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Addons</h1>
          <p className="text-muted-foreground mt-1">
            Manage addons that can be attached to properties
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Addon
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search addons..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              <span>{categoryFilter ? categoryLabels[categoryFilter] : "All Categories"}</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            <SelectItem value="checkout">Checkout</SelectItem>
            <SelectItem value="checkin">Check-in</SelectItem>
            <SelectItem value="transportation">Transportation</SelectItem>
            <SelectItem value="entertainment">Entertainment</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAddons.map((addon) => (
          <Card key={addon.id} className="overflow-hidden">
            {addon.featuredImage ? (
              <div className="aspect-video w-full overflow-hidden">
                <img 
                  src={addon.featuredImage} 
                  alt={addon.name} 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
            ) : (
              <div className="aspect-video w-full bg-muted flex items-center justify-center">
                <Package className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle>{addon.name}</CardTitle>
                <Badge className="ml-2 capitalize">{categoryLabels[addon.category]}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground line-clamp-2">{addon.description}</p>
              <p className="text-lg font-semibold mt-2">${addon.price}</p>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setCurrentAddon(addon);
                  setIsEditDialogOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDeleteAddon(addon.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredAddons.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4 border rounded-lg bg-muted/40">
          <Package className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No addons found</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md mt-1">
            {searchQuery || categoryFilter
              ? "Try adjusting your search or filters to find what you're looking for."
              : "You haven't created any addons yet. Click 'Add New Addon' to get started."}
          </p>
          {(searchQuery || categoryFilter) && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("");
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}
      
      {/* Add Addon Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Addon</DialogTitle>
            <DialogDescription>
              Create a new addon that can be attached to properties
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Late Checkout"
                  value={newAddon.name}
                  onChange={(e) => setNewAddon({...newAddon, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="45.00"
                    value={newAddon.price}
                    onChange={(e) => setNewAddon({...newAddon, price: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={newAddon.category} 
                    onValueChange={(value) => setNewAddon({...newAddon, category: value})}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checkout">Checkout</SelectItem>
                      <SelectItem value="checkin">Check-in</SelectItem>
                      <SelectItem value="transportation">Transportation</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the addon..."
                className="min-h-24"
                value={newAddon.description}
                onChange={(e) => setNewAddon({...newAddon, description: e.target.value})}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Featured Image</Label>
                {newAddon.featuredImage ? (
                  <div className="relative rounded-md overflow-hidden h-40 bg-muted">
                    <img 
                      src={newAddon.featuredImage} 
                      alt="Featured" 
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => removeImage('featured', 0, 'new')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div 
                    className="border-2 border-dashed rounded-md border-muted-foreground/25 flex flex-col items-center justify-center p-4 text-center h-40 cursor-pointer hover:border-muted-foreground/50"
                    onClick={() => handleUploadImage('featured', 'new')}
                  >
                    <div className="mx-auto w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                      <PlusCircle className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-sm font-medium">Upload Featured Image</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG or WebP, up to 10MB
                    </p>
                  </div>
                )}
              </div>
              
              <div>
                <Label className="mb-2 block">Gallery Images</Label>
                <div className="grid grid-cols-3 gap-2">
                  {newAddon.gallery.map((image, index) => (
                    <div key={index} className="relative rounded-md overflow-hidden h-24 bg-muted">
                      <img 
                        src={image} 
                        alt={`Gallery ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => removeImage('gallery', index, 'new')}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <div 
                    className="border-2 border-dashed rounded-md border-muted-foreground/25 flex flex-col items-center justify-center p-2 text-center h-24 cursor-pointer hover:border-muted-foreground/50"
                    onClick={() => handleUploadImage('gallery', 'new')}
                  >
                    <PlusCircle className="h-5 w-5 text-muted-foreground mb-1" />
                    <p className="text-xs text-muted-foreground">Add Image</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAddon}>
              Add Addon
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Addon Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Addon</DialogTitle>
            <DialogDescription>
              Update the details for this addon
            </DialogDescription>
          </DialogHeader>
          {currentAddon && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    placeholder="Late Checkout"
                    value={currentAddon.name}
                    onChange={(e) => setCurrentAddon({...currentAddon, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-price">Price ($)</Label>
                    <Input
                      id="edit-price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="45.00"
                      value={currentAddon.price}
                      onChange={(e) => setCurrentAddon({
                        ...currentAddon, 
                        price: parseFloat(e.target.value) || 0
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-category">Category</Label>
                    <Select 
                      value={currentAddon.category} 
                      onValueChange={(value) => setCurrentAddon({
                        ...currentAddon, 
                        category: value as AddonCategory
                      })}
                    >
                      <SelectTrigger id="edit-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="checkout">Checkout</SelectItem>
                        <SelectItem value="checkin">Check-in</SelectItem>
                        <SelectItem value="transportation">Transportation</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Describe the addon..."
                  className="min-h-24"
                  value={currentAddon.description}
                  onChange={(e) => setCurrentAddon({
                    ...currentAddon, 
                    description: e.target.value
                  })}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Featured Image</Label>
                  {currentAddon.featuredImage ? (
                    <div className="relative rounded-md overflow-hidden h-40 bg-muted">
                      <img 
                        src={currentAddon.featuredImage} 
                        alt="Featured" 
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => removeImage('featured', 0, 'current')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div 
                      className="border-2 border-dashed rounded-md border-muted-foreground/25 flex flex-col items-center justify-center p-4 text-center h-40 cursor-pointer hover:border-muted-foreground/50"
                      onClick={() => handleUploadImage('featured', 'current')}
                    >
                      <div className="mx-auto w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                        <PlusCircle className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-sm font-medium">Upload Featured Image</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        JPG, PNG or WebP, up to 10MB
                      </p>
                    </div>
                  )}
                </div>
                
                <div>
                  <Label className="mb-2 block">Gallery Images</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(currentAddon.gallery || []).map((image, index) => (
                      <div key={index} className="relative rounded-md overflow-hidden h-24 bg-muted">
                        <img 
                          src={image} 
                          alt={`Gallery ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() => removeImage('gallery', index, 'current')}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    <div 
                      className="border-2 border-dashed rounded-md border-muted-foreground/25 flex flex-col items-center justify-center p-2 text-center h-24 cursor-pointer hover:border-muted-foreground/50"
                      onClick={() => handleUploadImage('gallery', 'current')}
                    >
                      <PlusCircle className="h-5 w-5 text-muted-foreground mb-1" />
                      <p className="text-xs text-muted-foreground">Add Image</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditAddon}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Addons;

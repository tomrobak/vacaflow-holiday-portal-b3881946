
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus, Tag, Search } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { PropertyFormData, PropertyAmenity } from "@/types/property";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

interface AmenityOption {
  id: string;
  label: string;
  category: string;
}

interface PropertyAmenitiesTabProps {
  form: UseFormReturn<PropertyFormData>;
  amenitiesByCategory: Record<string, AmenityOption[]>;
  formatCategoryName: (category: string) => string;
}

const PropertyAmenitiesTab = ({ 
  form, 
  amenitiesByCategory, 
  formatCategoryName 
}: PropertyAmenitiesTabProps) => {
  const [newAmenity, setNewAmenity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  // Get the current amenities from the form
  const selectedAmenities = form.watch("amenities") || [];
  const customAmenities = form.watch("customAmenities") || [];

  // Flatten the amenities by category for searching
  const allAmenities = Object.values(amenitiesByCategory).flat();

  const addCustomAmenity = () => {
    if (newAmenity.trim() !== "") {
      const newCustomAmenityItem = {
        id: `custom-${Date.now()}`,
        name: newAmenity.trim(),
        isCustom: true
      };
      
      // Add to form values
      const updatedCustomAmenities = [...customAmenities, newCustomAmenityItem];
      form.setValue("customAmenities", updatedCustomAmenities);
      
      // Reset input
      setNewAmenity("");
    }
  };

  const removeAmenity = (amenityId: string) => {
    // Remove from standard amenities
    form.setValue("amenities", selectedAmenities.filter(id => id !== amenityId));
  };
  
  const removeCustomAmenity = (amenityId: string) => {
    // Remove from custom amenities
    form.setValue("customAmenities", customAmenities.filter(item => item.id !== amenityId));
  };

  // Get label for an amenity ID
  const getAmenityLabel = (amenityId: string) => {
    const amenity = allAmenities.find(item => item.id === amenityId);
    return amenity?.label || amenityId;
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <FormField
          control={form.control}
          name="amenities"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Amenities</FormLabel>
                <FormDescription>
                  Select amenities available at your property or add custom ones.
                </FormDescription>
              </div>
              
              {/* Search & Filtering Section */}
              <div className="space-y-4">
                {/* Search existing amenities */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Command className="rounded-lg border shadow-sm">
                    <CommandInput 
                      placeholder="Search amenities..." 
                      value={searchTerm}
                      onValueChange={setSearchTerm}
                      className="h-9 pl-9"
                    />
                    {(searchTerm || showAllAmenities) && (
                      <CommandList className="max-h-[200px]">
                        <CommandEmpty>No amenities found.</CommandEmpty>
                        {Object.entries(amenitiesByCategory).map(([category, amenities]) => {
                          const categoryAmenities = amenities.filter(amenity => 
                            amenity.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
                            !selectedAmenities.includes(amenity.id)
                          );
                          
                          if (categoryAmenities.length === 0) return null;
                          
                          return (
                            <CommandGroup key={category} heading={formatCategoryName(category)}>
                              {categoryAmenities.map((amenity) => (
                                <CommandItem
                                  key={amenity.id}
                                  onSelect={() => {
                                    form.setValue("amenities", [...selectedAmenities, amenity.id]);
                                    setSearchTerm("");
                                  }}
                                >
                                  {amenity.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          );
                        })}
                      </CommandList>
                    )}
                  </Command>
                </div>
                
                {!searchTerm && !showAllAmenities && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowAllAmenities(true)}
                    className="text-xs"
                  >
                    Browse all amenities
                  </Button>
                )}
                
                {/* Add custom amenity */}
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Add custom amenity..."
                      className="pl-8"
                      value={newAmenity}
                      onChange={(e) => setNewAmenity(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addCustomAmenity();
                        }
                      }}
                    />
                  </div>
                  <Button 
                    type="button" 
                    onClick={addCustomAmenity}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
              
              {/* Selected Amenities */}
              {(selectedAmenities.length > 0 || customAmenities.length > 0) && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Selected Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAmenities.map((amenityId) => (
                      <Badge 
                        key={amenityId} 
                        variant="secondary"
                        className="flex items-center gap-1 py-1.5"
                      >
                        {getAmenityLabel(amenityId)}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                          onClick={() => removeAmenity(amenityId)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                    
                    {customAmenities.map((amenity) => (
                      <Badge 
                        key={amenity.id} 
                        variant="success"
                        className="flex items-center gap-1 py-1.5"
                      >
                        {amenity.name}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                          onClick={() => removeCustomAmenity(amenity.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default PropertyAmenitiesTab;

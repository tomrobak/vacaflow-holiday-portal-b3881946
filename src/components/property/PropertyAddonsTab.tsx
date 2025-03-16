
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Check, Package, PlusCircle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { PropertyFormData } from "@/types/property";
import { Addon } from "@/types/addon";
import { cn } from "@/lib/utils";

interface PropertyAddonsTabProps {
  form: UseFormReturn<PropertyFormData>;
  availableAddons: Addon[];
  onCreateAddon: () => void;
}

const PropertyAddonsTab = ({ 
  form, 
  availableAddons, 
  onCreateAddon 
}: PropertyAddonsTabProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Property Addons</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Select addons that are available for this property
          </p>
        </div>
        <Button variant="outline" onClick={onCreateAddon}>
          <PlusCircle className="mr-2 h-4 w-4" /> 
          Create Addon
        </Button>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="addons"
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableAddons.map((addon) => {
                  const isSelected = field.value?.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      className={cn(
                        "border rounded-lg overflow-hidden transition-all cursor-pointer hover:shadow-md",
                        isSelected ? "border-primary ring-2 ring-primary/20" : "border-border"
                      )}
                      onClick={() => {
                        const currentValues = field.value || [];
                        const newValues = isSelected
                          ? currentValues.filter(id => id !== addon.id)
                          : [...currentValues, addon.id];
                        field.onChange(newValues);
                      }}
                    >
                      <div className="relative">
                        {addon.featuredImage ? (
                          <img
                            src={addon.featuredImage}
                            alt={addon.name}
                            className="h-36 w-full object-cover"
                          />
                        ) : (
                          <div className="h-36 w-full bg-muted flex items-center justify-center">
                            <Package className="h-10 w-10 text-muted-foreground" />
                          </div>
                        )}
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{addon.name}</h3>
                          <Badge className="ml-2 capitalize">
                            {addon.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {addon.description}
                        </p>
                        <p className="text-sm font-medium mt-2">${addon.price}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default PropertyAddonsTab;

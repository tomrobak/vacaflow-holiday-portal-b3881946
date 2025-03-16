
import { Card, CardContent } from "@/components/ui/card";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { PropertyFormData } from "@/types/property";

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
  return (
    <Card>
      <CardContent className="pt-6">
        <FormField
          control={form.control}
          name="amenities"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Amenities</FormLabel>
                <FormDescription>
                  Select the amenities available at your property.
                </FormDescription>
              </div>
              
              {Object.entries(amenitiesByCategory).map(([category, amenities]) => (
                <div key={category} className="mb-6">
                  <h3 className="text-sm font-medium mb-3 text-muted-foreground">
                    {formatCategoryName(category)}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {amenities.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="amenities"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...(field.value || []),
                                          item.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default PropertyAmenitiesTab;

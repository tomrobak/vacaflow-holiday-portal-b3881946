
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { propertyTypes } from "./EditPropertyTypes";
import { UseFormReturn } from "react-hook-form";
import { PropertyFormData } from "@/types/property";
import { MapPin, Building } from "lucide-react";

interface PropertyBasicInfoFieldsProps {
  form: UseFormReturn<PropertyFormData>;
}

const PropertyBasicInfoFields = ({ form }: PropertyBasicInfoFieldsProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Property Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Sunset Villa" {...field} />
            </FormControl>
            <FormDescription>
              Enter a unique name for your property.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe your property..."
                className="resize-none min-h-32"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Provide a detailed description of your property.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="e.g. Malibu, CA"
                  className="pl-8"
                  {...field}
                />
              </div>
            </FormControl>
            <FormDescription>
              Enter the location of your property.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="latitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Latitude (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="e.g. 34.0259"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="longitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Longitude (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="e.g. -118.7798"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Address (Optional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter the complete address..."
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormDescription>
              This address will be shared with guests after booking.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="propertyType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Property Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a property type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Select the type of property you are listing.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PropertyBasicInfoFields;

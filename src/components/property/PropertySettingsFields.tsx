
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { PropertyFormData } from "@/types/property";

interface PropertySettingsFieldsProps {
  form: UseFormReturn<PropertyFormData>;
}

const PropertySettingsFields = ({ form }: PropertySettingsFieldsProps) => {
  const watchGoogleCalendarSync = form.watch("googleCalendarSync");

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="isActive"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Active Listing</FormLabel>
              <FormDescription>
                This property will be immediately available for bookings
                if active.
              </FormDescription>
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="featured"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Featured Property</FormLabel>
              <FormDescription>
                Featured properties are highlighted on the homepage and in search results.
              </FormDescription>
            </div>
          </FormItem>
        )}
      />

      <div className="space-y-4 p-4 border rounded-md">
        <h3 className="text-lg font-medium">Calendar Sync</h3>
        
        <FormField
          control={form.control}
          name="googleCalendarSync"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Enable Google Calendar Sync</FormLabel>
                <FormDescription>
                  Automatically sync bookings with a Google Calendar
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {watchGoogleCalendarSync && (
          <FormField
            control={form.control}
            name="googleCalendarId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Google Calendar ID</FormLabel>
                <FormControl>
                  <div className="relative">
                    <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="e.g. example@gmail.com"
                      className="pl-8"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Enter the Google Calendar ID to sync with. You can find this in your Google Calendar settings.
                </FormDescription>
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default PropertySettingsFields;

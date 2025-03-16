
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Calendar as CalendarLucide } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { UseFormReturn, UseFormWatch } from "react-hook-form";
import { PropertyFormData } from "@/types/property";

interface PropertyAvailabilityTabProps {
  form: UseFormReturn<PropertyFormData>;
  watchGoogleCalendarSync: boolean;
}

const PropertyAvailabilityTab = ({ 
  form,
  watchGoogleCalendarSync
}: PropertyAvailabilityTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Availability Period</CardTitle>
        <p className="text-sm text-muted-foreground">
          Set the period when this property is available for booking
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="availableFrom"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Available From</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="availableTo"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Available To</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date <= new Date() || 
                        (form.watch("availableFrom") &&
                        date <= form.watch("availableFrom"))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="pt-4">
          <FormField
            control={form.control}
            name="googleCalendarSync"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Google Calendar Sync</FormLabel>
                  <FormDescription>
                    Synchronize property availability with a Google Calendar
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
        
        {watchGoogleCalendarSync && (
          <div className="pt-2">
            <FormField
              control={form.control}
              name="googleCalendarId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Google Calendar ID</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <CalendarLucide className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="your-calendar-id@group.calendar.google.com"
                        className="pl-8"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Enter the Google Calendar ID to sync with
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyAvailabilityTab;

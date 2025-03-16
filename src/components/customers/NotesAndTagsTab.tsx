
import React, { useState } from "react";
import { Control, UseFormWatch, UseFormSetValue } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, Trash } from "lucide-react";
import { CustomerFormValues } from "@/types/customer";

interface NotesAndTagsTabProps {
  control: Control<CustomerFormValues>;
  watch: UseFormWatch<CustomerFormValues>;
  setValue: UseFormSetValue<CustomerFormValues>;
}

export const NotesAndTagsTab: React.FC<NotesAndTagsTabProps> = ({ 
  control, 
  watch, 
  setValue 
}) => {
  const [newTag, setNewTag] = useState("");

  const addTag = () => {
    if (newTag && !watch("tags").includes(newTag)) {
      setValue("tags", [...watch("tags"), newTag]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue(
      "tags",
      watch("tags").filter(tag => tag !== tagToRemove)
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Information</CardTitle>
        <CardDescription>
          Add any notes or tags to help organize this customer
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Add any special requests, preferences, or important information about this customer..." 
                  className="min-h-32"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Internal notes visible only to staff members
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-4">
          <FormLabel>Tags</FormLabel>
          <div className="flex gap-2 flex-wrap">
            {watch("tags").map((tag) => (
              <div 
                key={tag} 
                className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center gap-1"
              >
                {tag}
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5" 
                  onClick={() => removeTag(tag)}
                >
                  <Trash className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input 
              placeholder="Add a tag" 
              value={newTag} 
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <Button type="button" size="sm" onClick={addTag}>
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
          <FormDescription>
            Tags help organize customers by interests or categories
          </FormDescription>
        </div>
      </CardContent>
    </Card>
  );
};

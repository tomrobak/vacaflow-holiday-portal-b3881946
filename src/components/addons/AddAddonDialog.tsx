
import React from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddonFormValues } from "@/types/addon";

interface AddAddonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formValues: AddonFormValues;
  onFormChange: (values: Partial<AddonFormValues>) => void;
  onAddAddon: () => void;
  onUploadImage: (type: 'featured' | 'gallery') => void;
  onRemoveImage: (type: 'featured' | 'gallery', index?: number) => void;
}

const AddAddonDialog = ({
  open,
  onOpenChange,
  formValues,
  onFormChange,
  onAddAddon,
  onUploadImage,
  onRemoveImage
}: AddAddonDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                value={formValues.name}
                onChange={(e) => onFormChange({ name: e.target.value })}
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
                  value={formValues.price}
                  onChange={(e) => onFormChange({ price: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formValues.category} 
                  onValueChange={(value) => onFormChange({ category: value })}
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
              value={formValues.description}
              onChange={(e) => onFormChange({ description: e.target.value })}
            />
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Featured Image</Label>
              {formValues.featuredImage ? (
                <div className="relative rounded-md overflow-hidden h-40 bg-muted">
                  <img 
                    src={formValues.featuredImage} 
                    alt="Featured" 
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => onRemoveImage('featured')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div 
                  className="border-2 border-dashed rounded-md border-muted-foreground/25 flex flex-col items-center justify-center p-4 text-center h-40 cursor-pointer hover:border-muted-foreground/50"
                  onClick={() => onUploadImage('featured')}
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
                {(formValues.gallery || []).map((image, index) => (
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
                      onClick={() => onRemoveImage('gallery', index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <div 
                  className="border-2 border-dashed rounded-md border-muted-foreground/25 flex flex-col items-center justify-center p-2 text-center h-24 cursor-pointer hover:border-muted-foreground/50"
                  onClick={() => onUploadImage('gallery')}
                >
                  <PlusCircle className="h-5 w-5 text-muted-foreground mb-1" />
                  <p className="text-xs text-muted-foreground">Add Image</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onAddAddon}>
            Add Addon
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddAddonDialog;


import React, { useState } from "react";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Image, Save, RefreshCw, Sliders, ImagePlus, 
  FileImage, Trash2, Download, Check, X, Wrench, 
  Loader2, Settings, Search, Grip, Trash
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

const imageSettingsSchema = z.object({
  // Conversion settings
  convertToWebP: z.boolean().default(true),
  preserveOriginal: z.boolean().default(true),
  
  // Naming settings
  replaceSpaces: z.boolean().default(true),
  spacesReplacement: z.enum(["dash", "underscore"]).default("dash"),
  
  // Compression settings
  enableCompression: z.boolean().default(true),
  compressionQuality: z.number().min(1).max(100).default(85),
  
  // Responsive images
  generateResponsiveVariants: z.boolean().default(true),
  responsiveSizes: z.string().default("576,768,992,1200"),
  
  // Optimization
  enableLazyLoading: z.boolean().default(true),
  enableBlurPlaceholder: z.boolean().default(true),
  generateAltText: z.boolean().default(false),
  
  // Image dimensions
  maxWidth: z.number().min(0).max(10000).default(2000),
  maxHeight: z.number().min(0).max(10000).default(2000),
  
  // Storage path
  imagePath: z.string().default("images"),
});

type ImageSettingsFormValues = z.infer<typeof imageSettingsSchema>;

// Mock data for the uploaded images gallery
const mockImages = [
  { id: 1, name: "beach_house.jpg", size: "1.2 MB", dimensions: "2400x1600", uploaded: "2023-04-15", url: "/placeholder.svg" },
  { id: 2, name: "mountain_cabin.jpg", size: "2.1 MB", dimensions: "3200x2100", uploaded: "2023-04-12", url: "/placeholder.svg" },
  { id: 3, name: "city_apartment.webp", size: "890 KB", dimensions: "1920x1080", uploaded: "2023-04-10", url: "/placeholder.svg" },
  { id: 4, name: "lakeside_cottage.jpg", size: "1.8 MB", dimensions: "2800x1800", uploaded: "2023-04-05", url: "/placeholder.svg" },
  { id: 5, name: "desert_villa.webp", size: "1.1 MB", dimensions: "2100x1400", uploaded: "2023-04-01", url: "/placeholder.svg" },
  { id: 6, name: "forest_cabin.jpg", size: "1.5 MB", dimensions: "2200x1500", uploaded: "2023-03-28", url: "/placeholder.svg" },
];

const ImageSettings = () => {
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");

  const form = useForm<ImageSettingsFormValues>({
    resolver: zodResolver(imageSettingsSchema),
    defaultValues: {
      convertToWebP: true,
      preserveOriginal: true,
      replaceSpaces: true,
      spacesReplacement: "dash",
      enableCompression: true,
      compressionQuality: 85,
      generateResponsiveVariants: true,
      responsiveSizes: "576,768,992,1200",
      enableLazyLoading: true,
      enableBlurPlaceholder: true,
      generateAltText: false,
      maxWidth: 2000,
      maxHeight: 2000,
      imagePath: "images",
    }
  });

  const onSubmit = (data: ImageSettingsFormValues) => {
    console.log("Image settings:", data);
    toast.success("Image settings saved successfully");
  };

  const handleSelectAll = () => {
    if (selectedImages.length === mockImages.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(mockImages.map(img => img.id));
    }
  };

  const handleSelect = (id: number) => {
    if (selectedImages.includes(id)) {
      setSelectedImages(selectedImages.filter(imgId => imgId !== id));
    } else {
      setSelectedImages([...selectedImages, id]);
    }
  };

  const handleBulkConvert = () => {
    if (selectedImages.length === 0) {
      toast.error("Please select at least one image");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success(`${selectedImages.length} images processed successfully`);
      setSelectedImages([]);
    }, 2000);
  };

  const handleDelete = () => {
    if (selectedImages.length === 0) {
      toast.error("Please select at least one image");
      return;
    }
    
    // In a real application, you would delete the selected images
    toast.success(`${selectedImages.length} images deleted successfully`);
    setSelectedImages([]);
  };

  const filteredImages = mockImages.filter(img => 
    img.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedImages = [...filteredImages].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "size") {
      return parseFloat(a.size) - parseFloat(b.size);
    } else {
      // Default: date
      return new Date(b.uploaded).getTime() - new Date(a.uploaded).getTime();
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Image Settings</h2>
        <p className="text-muted-foreground">Configure image processing, optimization, and storage options</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Image Processing Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Image Processing Configuration
              </CardTitle>
              <CardDescription>
                Configure how images are processed when uploaded to your platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Conversion Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Conversion Settings</h3>
                
                <FormField
                  control={form.control}
                  name="convertToWebP"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Convert Images to WebP
                        </FormLabel>
                        <FormDescription>
                          Automatically convert uploaded images to WebP format for better performance
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="preserveOriginal"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Preserve Original Format
                        </FormLabel>
                        <FormDescription>
                          Keep the original image file alongside the WebP version
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <Separator className="my-4" />
              
              {/* Naming Convention */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Naming Convention</h3>
                
                <FormField
                  control={form.control}
                  name="replaceSpaces"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Replace Spaces in Filenames
                        </FormLabel>
                        <FormDescription>
                          Replace spaces in filenames with hyphens or underscores
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {form.watch("replaceSpaces") && (
                  <FormField
                    control={form.control}
                    name="spacesReplacement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Space Replacement Character</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select replacement" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="dash">Hyphen (-)</SelectItem>
                            <SelectItem value="underscore">Underscore (_)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Character to use when replacing spaces in filenames
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              
              <Separator className="my-4" />
              
              {/* Compression Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Compression Settings</h3>
                
                <FormField
                  control={form.control}
                  name="enableCompression"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Enable Image Compression
                        </FormLabel>
                        <FormDescription>
                          Compress images to reduce file size while maintaining quality
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {form.watch("enableCompression") && (
                  <FormField
                    control={form.control}
                    name="compressionQuality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Compression Quality (1-100)</FormLabel>
                        <div className="flex items-center gap-4">
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="100"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <span className="text-muted-foreground w-12">{field.value}%</span>
                        </div>
                        <FormDescription>
                          Higher values maintain better quality but result in larger file sizes
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              
              <Separator className="my-4" />
              
              {/* Responsive Images */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Responsive Images</h3>
                
                <FormField
                  control={form.control}
                  name="generateResponsiveVariants"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Generate Responsive Image Variants
                        </FormLabel>
                        <FormDescription>
                          Create multiple sizes of each image for responsive web design
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {form.watch("generateResponsiveVariants") && (
                  <FormField
                    control={form.control}
                    name="responsiveSizes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Responsive Image Widths (px)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="576,768,992,1200" />
                        </FormControl>
                        <FormDescription>
                          Comma-separated list of widths for responsive image variants
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              
              <Separator className="my-4" />
              
              {/* Optimization Features */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Optimization Features</h3>
                
                <FormField
                  control={form.control}
                  name="enableLazyLoading"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Enable Lazy Loading
                        </FormLabel>
                        <FormDescription>
                          Only load images when they enter the viewport for better performance
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="enableBlurPlaceholder"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Generate Blur Placeholders
                        </FormLabel>
                        <FormDescription>
                          Create low-resolution placeholders for images while they load
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="generateAltText"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Auto-generate Alt Text
                        </FormLabel>
                        <FormDescription>
                          Use AI to generate descriptive alt text for uploaded images
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <Separator className="my-4" />
              
              {/* Dimensions and Storage */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Maximum Dimensions</h3>
                  
                  <FormField
                    control={form.control}
                    name="maxWidth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Width (px)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            max="10000" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Maximum width for uploaded images (0 = no limit)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="maxHeight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Height (px)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            max="10000" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Maximum height for uploaded images (0 = no limit)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Storage Settings</h3>
                  
                  <FormField
                    control={form.control}
                    name="imagePath"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Storage Path</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="images" />
                        </FormControl>
                        <FormDescription>
                          Base path for storing uploaded images
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Alert>
                    <Settings className="h-4 w-4" />
                    <AlertTitle>Storage Integration</AlertTitle>
                    <AlertDescription>
                      Images will be stored using your configured storage provider.
                      <Button 
                        variant="link" 
                        className="p-0 h-auto font-normal text-primary" 
                        onClick={() => { /* Navigate to storage settings */ }}
                      >
                        Configure storage settings
                      </Button>
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Image Gallery Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileImage className="h-5 w-5" />
                Uploaded Images
              </CardTitle>
              <CardDescription>
                Manage all uploaded images across your platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search images..."
                    className="pl-9 w-full sm:w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Select
                    value={sortBy}
                    onValueChange={setSortBy}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date Uploaded</SelectItem>
                      <SelectItem value="name">Filename</SelectItem>
                      <SelectItem value="size">File Size</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    variant="outline" 
                    className="flex gap-2"
                    onClick={handleSelectAll}
                  >
                    {selectedImages.length === mockImages.length ? (
                      <>
                        <X className="h-4 w-4" />
                        Deselect All
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        Select All
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <div className="w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-12 px-4 text-left align-middle font-medium w-[48px]">
                          <Checkbox 
                            checked={selectedImages.length > 0 && selectedImages.length === mockImages.length}
                            onCheckedChange={handleSelectAll}
                          />
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Image</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Filename</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Size</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Dimensions</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Uploaded</th>
                        <th className="h-12 px-4 text-left align-middle font-medium w-[100px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedImages.length > 0 ? (
                        sortedImages.map((image) => (
                          <tr key={image.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td className="p-4 align-middle">
                              <Checkbox 
                                checked={selectedImages.includes(image.id)}
                                onCheckedChange={() => handleSelect(image.id)}
                              />
                            </td>
                            <td className="p-4 align-middle">
                              <div className="h-12 w-12 rounded-md overflow-hidden">
                                <img src={image.url} alt={image.name} className="h-full w-full object-cover" />
                              </div>
                            </td>
                            <td className="p-4 align-middle font-medium max-w-[200px] truncate">
                              {image.name}
                            </td>
                            <td className="p-4 align-middle text-muted-foreground">{image.size}</td>
                            <td className="p-4 align-middle text-muted-foreground">{image.dimensions}</td>
                            <td className="p-4 align-middle text-muted-foreground">{image.uploaded}</td>
                            <td className="p-4 align-middle">
                              <div className="flex gap-2">
                                <Button variant="ghost" size="icon" title="Download">
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" title="Delete" onClick={() => handleSelect(image.id)}>
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="p-4 text-center text-muted-foreground">
                            No images found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <Button 
                  variant="outline" 
                  className="flex gap-2"
                  onClick={handleBulkConvert}
                  disabled={selectedImages.length === 0 || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Wrench className="h-4 w-4" />
                      Process Selected
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex gap-2 text-destructive hover:text-destructive"
                  onClick={handleDelete}
                  disabled={selectedImages.length === 0}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Selected
                </Button>
                
                <div className="ml-auto flex items-center text-sm text-muted-foreground">
                  {selectedImages.length > 0 ? (
                    <span>{selectedImages.length} of {mockImages.length} selected</span>
                  ) : (
                    <span>{mockImages.length} images total</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="flex gap-2">
            <Save className="h-4 w-4" />
            Save Image Settings
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ImageSettings;

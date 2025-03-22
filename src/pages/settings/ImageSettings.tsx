
import React, { useState } from "react";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Image, Save, RefreshCw, Sliders, FileImage, 
  Trash2, Download, Check, X, Wrench, 
  Loader2, Settings, Search, Trash, Plus
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
  const [activeTab, setActiveTab] = useState("configuration");
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
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Image Settings</h2>
        <p className="text-muted-foreground">Configure image processing, optimization, and storage options</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="configuration" className="flex-1">
            Configuration
          </TabsTrigger>
          <TabsTrigger value="images" className="flex-1">
            Image Library
          </TabsTrigger>
        </TabsList>

        <TabsContent value="configuration">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Conversion & Naming Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Image className="h-5 w-5" />
                      Format & Naming
                    </CardTitle>
                    <CardDescription>
                      Configure image formats and file naming conventions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="convertToWebP"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Convert to WebP
                              </FormLabel>
                              <FormDescription className="text-xs">
                                Automatically convert images to WebP format
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
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Preserve Original Format
                              </FormLabel>
                              <FormDescription className="text-xs">
                                Keep original file alongside converted version
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
                      
                      <Separator className="my-3" />
                      
                      <FormField
                        control={form.control}
                        name="replaceSpaces"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Replace Spaces in Filenames
                              </FormLabel>
                              <FormDescription className="text-xs">
                                Replace spaces with a character
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
                              <FormDescription className="text-xs">
                                Character to use when replacing spaces
                              </FormDescription>
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Compression & Optimization Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Sliders className="h-5 w-5" />
                      Compression & Optimization
                    </CardTitle>
                    <CardDescription>
                      Configure quality and optimization settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0">
                    <FormField
                      control={form.control}
                      name="enableCompression"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Enable Compression
                            </FormLabel>
                            <FormDescription className="text-xs">
                              Compress images to reduce file size
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
                            <div className="flex items-center justify-between">
                              <FormLabel>Compression Quality</FormLabel>
                              <span className="text-muted-foreground text-sm w-10 text-right">{field.value}%</span>
                            </div>
                            <FormControl>
                              <Input
                                type="range"
                                min="1"
                                max="100"
                                className="w-full"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription className="text-xs">
                              Higher = better quality but larger file size
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <Separator className="my-3" />
                    
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="enableLazyLoading"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Lazy Loading
                              </FormLabel>
                              <FormDescription className="text-xs">
                                Load images when they enter viewport
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
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Blur Placeholders
                              </FormLabel>
                              <FormDescription className="text-xs">
                                Show blur placeholders while loading
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
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                AI Alt Text Generation
                              </FormLabel>
                              <FormDescription className="text-xs">
                                Auto-generate alt text for accessibility
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
                  </CardContent>
                </Card>
                
                {/* Responsive Images Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <RefreshCw className="h-5 w-5" />
                      Responsive Images
                    </CardTitle>
                    <CardDescription>
                      Configure responsive image generation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0">
                    <FormField
                      control={form.control}
                      name="generateResponsiveVariants"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Generate Responsive Variants
                            </FormLabel>
                            <FormDescription className="text-xs">
                              Create multiple sizes of each image
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
                            <FormDescription className="text-xs">
                              Comma-separated list of widths for variants
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <Separator className="my-3" />
                    
                    <div className="grid grid-cols-2 gap-4">
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
                            <FormDescription className="text-xs">
                              0 = no limit
                            </FormDescription>
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
                            <FormDescription className="text-xs">
                              0 = no limit
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                {/* Storage Settings Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Settings className="h-5 w-5" />
                      Storage Settings
                    </CardTitle>
                    <CardDescription>
                      Configure where and how images are stored
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0">
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
                        </FormItem>
                      )}
                    />
                    
                    <Alert className="mt-4">
                      <Settings className="h-4 w-4" />
                      <AlertTitle>Storage Integration</AlertTitle>
                      <AlertDescription className="text-xs">
                        Images will be stored using your configured provider.
                        <Button 
                          variant="link" 
                          className="p-0 h-auto font-normal text-primary" 
                          onClick={() => { /* Navigate to storage settings */ }}
                        >
                          Configure storage settings
                        </Button>
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>

              <Button type="submit" className="flex gap-2">
                <Save className="h-4 w-4" />
                Save Image Settings
              </Button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileImage className="h-5 w-5" />
                Image Library
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
              
              {sortedImages.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                  {sortedImages.map((image) => (
                    <Card key={image.id} className="overflow-hidden">
                      <div className="relative h-32 w-full">
                        <img 
                          src={image.url} 
                          alt={image.name} 
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <Checkbox 
                            checked={selectedImages.includes(image.id)}
                            onCheckedChange={() => handleSelect(image.id)}
                            className="h-5 w-5 bg-white/80 border-gray-400"
                          />
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm truncate" title={image.name}>
                          {image.name}
                        </h4>
                        <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
                          <span>{image.size}</span>
                          <span>{image.dimensions}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-1 p-2 pt-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Download">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Delete">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8">
                  <FileImage className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <h3 className="font-medium">No images found</h3>
                  <p className="text-sm text-muted-foreground">
                    {searchTerm ? "Try a different search term" : "Upload images to get started"}
                  </p>
                </div>
              )}
              
              {sortedImages.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
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
                  
                  <Button variant="outline" className="flex gap-2 ml-auto">
                    <Plus className="h-4 w-4" />
                    Upload Images
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImageSettings;

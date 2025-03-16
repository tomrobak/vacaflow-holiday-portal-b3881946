
import { useState } from "react";
import { toast } from "sonner";
import { UseFormSetValue } from "react-hook-form";
import { PropertyFormData } from "@/types/property";
import { EditPropertyFormValues } from "@/components/property/EditPropertyDataProvider";

interface UploadedImage {
  name: string;
  url: string;
}

// We're making this hook compatible with both PropertyFormData and EditPropertyFormValues
export const usePropertyImages = (setValue: UseFormSetValue<PropertyFormData | EditPropertyFormValues>) => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      }));

      setUploadedImages([...uploadedImages, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...uploadedImages];
    URL.revokeObjectURL(newImages[index].url);
    newImages.splice(index, 1);
    setUploadedImages(newImages);
  };

  const setAsHeroImage = (url: string) => {
    setHeroImage(url);
    setValue("heroImage", url);
    toast.success("Hero image has been set");
  };

  const addToGallery = (url: string) => {
    if (!galleryImages.includes(url)) {
      const newGallery = [...galleryImages, url];
      setGalleryImages(newGallery);
      setValue("gallery", newGallery);
      toast.success("Image added to gallery");
    } else {
      toast.info("This image is already in the gallery");
    }
  };

  const removeFromGallery = (url: string) => {
    const newGallery = galleryImages.filter(img => img !== url);
    setGalleryImages(newGallery);
    setValue("gallery", newGallery);
    toast.success("Image removed from gallery");
  };

  const initializeImages = (heroImg: string | undefined, gallery: string[] | undefined) => {
    if (heroImg) {
      setHeroImage(heroImg);
    }
    
    if (gallery && gallery.length > 0) {
      setGalleryImages(gallery);
    }
  };

  return {
    uploadedImages,
    setUploadedImages,
    heroImage,
    setHeroImage,
    galleryImages,
    setGalleryImages,
    handleImageUpload,
    removeImage,
    setAsHeroImage,
    addToGallery,
    removeFromGallery,
    initializeImages
  };
};

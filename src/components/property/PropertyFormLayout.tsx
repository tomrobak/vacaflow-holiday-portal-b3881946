
import React from "react";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { PropertyFormData } from "@/types/property";

interface PropertyFormLayoutProps {
  children: React.ReactNode;
  form: UseFormReturn<PropertyFormData>;
  title: string;
  description: string;
  submitButtonText: string;
  cancelPath: string;
  onSubmit: (values: PropertyFormData) => void;
}

const PropertyFormLayout = ({
  children,
  form,
  title,
  description,
  submitButtonText,
  cancelPath,
  onSubmit,
}: PropertyFormLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {children}

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(cancelPath)}
          >
            Cancel
          </Button>
          <Button type="submit">{submitButtonText}</Button>
        </div>
      </form>
    </div>
  );
};

export default PropertyFormLayout;

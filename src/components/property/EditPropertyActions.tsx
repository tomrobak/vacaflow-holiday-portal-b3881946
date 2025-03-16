
import React from "react";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { EditPropertyFormValues } from "./EditPropertyDataProvider";

interface EditPropertyActionsProps {
  form: UseFormReturn<EditPropertyFormValues>;
  propertyId: string;
}

const EditPropertyActions = ({ form, propertyId }: EditPropertyActionsProps) => {
  const navigate = useNavigate();

  const onSubmit = (values: EditPropertyFormValues) => {
    console.log("Form values:", values);
    
    // In a real application, we would save the values to the server here
    toast.success(`Property "${values.name}" has been updated!`);
    navigate(`/properties/${propertyId}`);
  };

  return (
    <div className="flex justify-end gap-4">
      <Button 
        type="button" 
        variant="outline"
        onClick={() => navigate(`/properties/${propertyId}`)}
      >
        Cancel
      </Button>
      <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
        Update Property
      </Button>
    </div>
  );
};

export default EditPropertyActions;

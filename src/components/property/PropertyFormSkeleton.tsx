
import React from "react";

const PropertyFormSkeleton = () => {
  return (
    <div className="p-6 flex justify-center items-center h-96">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading property data...</p>
      </div>
    </div>
  );
};

export default PropertyFormSkeleton;

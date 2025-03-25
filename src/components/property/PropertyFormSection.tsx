
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PropertyFormSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  withCard?: boolean;
}

const PropertyFormSection = ({
  title,
  children,
  className = "",
  withCard = true,
}: PropertyFormSectionProps) => {
  if (!withCard) {
    return (
      <div className={`space-y-4 ${className}`}>
        {title && <h3 className="text-lg font-semibold">{title}</h3>}
        {children}
      </div>
    );
  }

  return (
    <Card className={className}>
      {title && (
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
};

export default PropertyFormSection;

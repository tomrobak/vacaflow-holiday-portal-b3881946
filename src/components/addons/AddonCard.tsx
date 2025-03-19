
import React from "react";
import { Edit, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Addon, AddonCategory } from "@/types/addon";

interface AddonCardProps {
  addon: Addon;
  categoryLabels: Record<string, string>;
  onEdit: (addon: Addon) => void;
  onDelete: (id: string) => void;
}

const AddonCard = ({ addon, categoryLabels, onEdit, onDelete }: AddonCardProps) => {
  return (
    <Card key={addon.id} className="overflow-hidden">
      {addon.featuredImage ? (
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={addon.featuredImage} 
            alt={addon.name} 
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
      ) : (
        <div className="aspect-video w-full bg-muted flex items-center justify-center">
          <Package className="h-12 w-12 text-muted-foreground" />
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>{addon.name}</CardTitle>
          <Badge className="ml-2 capitalize">{categoryLabels[addon.category]}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2">{addon.description}</p>
        <p className="text-lg font-semibold mt-2">${addon.price}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onEdit(addon)}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onDelete(addon.id)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AddonCard;

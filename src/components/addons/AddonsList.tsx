
import React from "react";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddonCard from "./AddonCard";
import { Addon } from "@/types/addon";

interface AddonsListProps {
  addons: Addon[];
  categoryLabels: Record<string, string>;
  searchQuery: string;
  categoryFilter: string;
  onEditAddon: (addon: Addon) => void;
  onDeleteAddon: (id: string) => void;
  onClearFilters: () => void;
}

const AddonsList = ({ 
  addons, 
  categoryLabels, 
  searchQuery, 
  categoryFilter,
  onEditAddon, 
  onDeleteAddon,
  onClearFilters
}: AddonsListProps) => {
  if (addons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 border rounded-lg bg-muted/40">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No addons found</h3>
        <p className="text-sm text-muted-foreground text-center max-w-md mt-1">
          {searchQuery || (categoryFilter && categoryFilter !== "all")
            ? "Try adjusting your search or filters to find what you're looking for."
            : "You haven't created any addons yet. Click 'Add New Addon' to get started."}
        </p>
        {(searchQuery || (categoryFilter && categoryFilter !== "all")) && (
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={onClearFilters}
          >
            Clear Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {addons.map((addon) => (
        <AddonCard 
          key={addon.id}
          addon={addon}
          categoryLabels={categoryLabels}
          onEdit={onEditAddon}
          onDelete={onDeleteAddon}
        />
      ))}
    </div>
  );
};

export default AddonsList;


import React from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddonsSearch from "@/components/addons/AddonsSearch";
import AddonsList from "@/components/addons/AddonsList";
import AddAddonDialog from "@/components/addons/AddAddonDialog";
import EditAddonDialog from "@/components/addons/EditAddonDialog";
import { useAddons, categoryLabels } from "@/hooks/useAddons";

const Addons = () => {
  const {
    addons,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    currentAddon,
    setCurrentAddon,
    newAddon,
    setNewAddon,
    handleAddAddon,
    handleEditAddon,
    handleDeleteAddon,
    handleUploadImage,
    removeImage,
    clearFilters
  } = useAddons();

  return (
    <div className="container py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Addons</h1>
          <p className="text-muted-foreground mt-1">
            Manage addons that can be attached to properties
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Addon
        </Button>
      </div>

      <AddonsSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        categoryLabels={categoryLabels}
      />

      <AddonsList
        addons={addons}
        categoryLabels={categoryLabels}
        searchQuery={searchQuery}
        categoryFilter={categoryFilter}
        onEditAddon={(addon) => {
          setCurrentAddon(addon);
          setIsEditDialogOpen(true);
        }}
        onDeleteAddon={handleDeleteAddon}
        onClearFilters={clearFilters}
      />
      
      {/* Add Addon Dialog */}
      <AddAddonDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        formValues={newAddon}
        onFormChange={(values) => setNewAddon({...newAddon, ...values})}
        onAddAddon={handleAddAddon}
        onUploadImage={(type) => handleUploadImage(type, 'new')}
        onRemoveImage={(type, index) => removeImage(type, index, 'new')}
      />
      
      {/* Edit Addon Dialog */}
      <EditAddonDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        currentAddon={currentAddon}
        onAddonChange={(values) => currentAddon && setCurrentAddon({...currentAddon, ...values})}
        onEditAddon={handleEditAddon}
        onUploadImage={(type) => handleUploadImage(type, 'current')}
        onRemoveImage={(type, index) => removeImage(type, index, 'current')}
      />
    </div>
  );
};

export default Addons;

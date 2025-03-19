
import React from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddonsSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  categoryLabels: Record<string, string>;
}

const AddonsSearch = ({ 
  searchQuery, 
  onSearchChange, 
  categoryFilter, 
  onCategoryChange,
  categoryLabels
}: AddonsSearchProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search addons..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Select value={categoryFilter} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <div className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            <span>{categoryFilter ? categoryLabels[categoryFilter] : "All Categories"}</span>
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="checkout">Checkout</SelectItem>
          <SelectItem value="checkin">Check-in</SelectItem>
          <SelectItem value="transportation">Transportation</SelectItem>
          <SelectItem value="entertainment">Entertainment</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default AddonsSearch;

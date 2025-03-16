
import { useState } from "react";
import { 
  Filter, 
  Home, 
  Users, 
  Calendar, 
  CreditCard,
  Clock,
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SmsFilter } from "@/types/sms";
import { Search } from "lucide-react";

interface SmsFiltersProps {
  activeFilter: SmsFilter;
  setActiveFilter: (filter: SmsFilter) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  predefinedFilters: SmsFilter[];
  mockProperties: { id: string; name: string }[];
  selectedPropertyFilter: string;
  setSelectedPropertyFilter: (propertyId: string) => void;
  allTags: string[];
  handlePropertyFilterChange: (propertyId: string) => void;
  handleTagFilterChange: (tag: string) => void;
  handleSetActiveFilter: (filter: SmsFilter) => void;
}

const SmsFilters = ({
  activeFilter,
  setActiveFilter,
  searchTerm,
  setSearchTerm,
  predefinedFilters,
  mockProperties,
  selectedPropertyFilter,
  handlePropertyFilterChange,
  allTags,
  handleTagFilterChange,
  handleSetActiveFilter
}: SmsFiltersProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Message Filters</CardTitle>
        <CardDescription>Select recipients based on filters</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Accordion type="single" collapsible defaultValue="predefined">
          <AccordionItem value="predefined">
            <AccordionTrigger>Predefined Filters</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {predefinedFilters.map((filter) => (
                  <Button
                    key={filter.type}
                    variant={activeFilter.type === filter.type ? "default" : "outline"}
                    className="w-full justify-start text-left"
                    onClick={() => handleSetActiveFilter(filter)}
                  >
                    {filter.type === 'all' && <Users className="mr-2 h-4 w-4" />}
                    {filter.type === 'upcoming-bookings' && <Calendar className="mr-2 h-4 w-4" />}
                    {filter.type === 'pending-payment' && <CreditCard className="mr-2 h-4 w-4" />}
                    {filter.type === 'past-bookings' && <Clock className="mr-2 h-4 w-4" />}
                    {filter.label}
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="properties">
            <AccordionTrigger>Filter by Property</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {mockProperties.map((property) => (
                  <Button
                    key={property.id}
                    variant={activeFilter.type === 'property' && selectedPropertyFilter === property.id ? "default" : "outline"}
                    className="w-full justify-start text-left"
                    onClick={() => handlePropertyFilterChange(property.id)}
                  >
                    <Home className="mr-2 h-4 w-4" />
                    {property.name}
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="tags">
            <AccordionTrigger>Filter by Tag</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {allTags.map((tag) => (
                  <Button
                    key={tag}
                    variant={activeFilter.type === 'tag' && activeFilter.value === tag ? "default" : "outline"}
                    className="w-full justify-start text-left"
                    onClick={() => handleTagFilterChange(tag)}
                  >
                    <Tag className="mr-2 h-4 w-4" />
                    {tag}
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => handleSetActiveFilter({ type: 'all', label: 'All Customers' })}
        >
          <Filter className="mr-2 h-4 w-4" />
          Clear Filters
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SmsFilters;

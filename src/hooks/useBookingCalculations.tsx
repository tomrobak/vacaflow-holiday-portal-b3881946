
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { BookingFormValues } from "@/types/booking";
import { Customer, Property } from "@/types/bookingForm";

interface UseBookingCalculationsProps {
  form: UseFormReturn<BookingFormValues>;
  properties: Property[];
  customers: Customer[];
}

export function useBookingCalculations({ form, properties, customers }: UseBookingCalculationsProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [totalNights, setTotalNights] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  
  // Watch form values to calculate price
  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");
  const propertyId = form.watch("propertyId");
  const customerId = form.watch("customerId");

  // Update selections and calculate price
  useEffect(() => {
    if (propertyId) {
      const property = properties.find(p => p.id === propertyId);
      setSelectedProperty(property || null);
    } else {
      setSelectedProperty(null);
    }
    
    if (customerId) {
      const customer = customers.find(c => c.id === customerId);
      setSelectedCustomer(customer || null);
    } else {
      setSelectedCustomer(null);
    }
    
    if (startDate && endDate) {
      const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      setTotalNights(nights);
      
      if (selectedProperty) {
        setTotalAmount(nights * selectedProperty.price);
      }
    } else {
      setTotalNights(0);
      setTotalAmount(0);
    }
  }, [startDate, endDate, propertyId, customerId, selectedProperty, properties, customers]);

  return {
    selectedProperty,
    selectedCustomer,
    totalNights,
    totalAmount
  };
}


import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { BookingFormValues } from "@/types/booking";
import { Customer, Property } from "@/types/bookingForm";
import { differenceInDays } from "date-fns";

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
  const guestCount = form.watch("guestCount");

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
    
    if (startDate && endDate && startDate < endDate) {
      const nights = differenceInDays(endDate, startDate);
      setTotalNights(nights);
      
      if (selectedProperty) {
        const accommodationCost = nights * selectedProperty.price;
        const cleaningFee = selectedProperty.price * 0.15; // 15% of one night
        const serviceFee = accommodationCost * 0.08; // 8% service fee
        
        setTotalAmount(accommodationCost + cleaningFee + serviceFee);
      }
    } else {
      setTotalNights(0);
      setTotalAmount(0);
    }
  }, [startDate, endDate, propertyId, customerId, selectedProperty, properties, customers, guestCount]);

  return {
    selectedProperty,
    selectedCustomer,
    totalNights,
    totalAmount
  };
}

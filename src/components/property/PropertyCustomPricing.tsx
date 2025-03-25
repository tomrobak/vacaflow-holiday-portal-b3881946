
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, CalendarIcon as CalendarLucide, Trash2, Plus } from "lucide-react";
import { format } from "date-fns";
import { UseFormReturn } from "react-hook-form";
import { PropertyFormData } from "@/types/property";

interface PropertyCustomPricingProps {
  form: UseFormReturn<PropertyFormData>;
}

const PropertyCustomPricing = ({ form }: PropertyCustomPricingProps) => {
  const [customPrices, setCustomPrices] = useState<{
    id: string;
    from: Date;
    to: Date;
    price: string;
  }[]>([]);

  const [newCustomPrice, setNewCustomPrice] = useState({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 7)),
    price: "",
  });

  const addCustomPrice = () => {
    if (newCustomPrice.price.trim() !== "" && !isNaN(Number(newCustomPrice.price)) && Number(newCustomPrice.price) > 0) {
      const newPrice = {
        id: `price-${Date.now()}`,
        from: newCustomPrice.from,
        to: newCustomPrice.to,
        price: newCustomPrice.price
      };
      
      setCustomPrices([...customPrices, newPrice]);
      form.setValue("customPrices", [...customPrices, newPrice]);
      
      setNewCustomPrice({
        from: new Date(),
        to: new Date(new Date().setDate(new Date().getDate() + 7)),
        price: "",
      });
    }
  };

  const removeCustomPrice = (id: string) => {
    const updatedPrices = customPrices.filter(price => price.id !== id);
    setCustomPrices(updatedPrices);
    form.setValue("customPrices", updatedPrices);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Custom Pricing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Set custom prices for specific dates (e.g., holidays, peak seasons)
        </p>
        
        <div className="grid grid-cols-1 gap-4">
          {customPrices.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {customPrices.map((priceItem) => (
                <Card key={priceItem.id} className="bg-muted/40">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="success" className="mt-1">
                        ${priceItem.price}/night
                      </Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCustomPrice(priceItem.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-2">
                        <CalendarLucide className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>From: {format(priceItem.from, "MMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarLucide className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>To: {format(priceItem.to, "MMM d, yyyy")}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          <Card>
            <CardContent className="p-4 space-y-4">
              <h4 className="text-sm font-medium">Add new custom price</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium">From</label>
                  <Input
                    type="date"
                    value={newCustomPrice.from.toISOString().split('T')[0]}
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      setNewCustomPrice({ ...newCustomPrice, from: date });
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">To</label>
                  <Input
                    type="date"
                    value={newCustomPrice.to.toISOString().split('T')[0]}
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      setNewCustomPrice({ ...newCustomPrice, to: date });
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Price (USD)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      min="0"
                      placeholder="300"
                      className="pl-8"
                      value={newCustomPrice.price}
                      onChange={(e) => {
                        setNewCustomPrice({ ...newCustomPrice, price: e.target.value });
                      }}
                    />
                  </div>
                </div>
              </div>
              <Button 
                type="button" 
                variant="secondary" 
                className="w-full"
                onClick={addCustomPrice}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Price
              </Button>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCustomPricing;


import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import PropertyReviews from "@/components/property/PropertyReviews";

// Mock property data
const mockProperty = {
  id: "prop-1",
  name: "Oceanview Villa",
  address: "123 Coastal Drive, Beachville, CA",
  rating: 4.8,
};

// Mock reviews rating distribution
const mockRatingDistribution = {
  5: 12, // 12 reviews with 5 stars
  4: 5,  // 5 reviews with 4 stars
  3: 2,  // 2 reviews with 3 stars
  2: 1,  // 1 review with 2 stars
  1: 0,  // 0 reviews with 1 star
};

const ViewPropertyReviews = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState(mockProperty);
  const [isLoading, setIsLoading] = useState(true);
  const [ratingDistribution, setRatingDistribution] = useState(mockRatingDistribution);
  
  // In a real app, we would fetch the property and reviews data based on the ID
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [id]);
  
  const totalReviews = Object.values(ratingDistribution).reduce((sum, count) => sum + count, 0);
  
  return (
    <div className="container p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Property
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{property.name} Reviews</h1>
          <p className="text-muted-foreground">{property.address}</p>
        </div>
        
        <div className="flex items-center bg-secondary rounded-md px-4 py-2">
          <div className="flex items-center mr-2">
            <Star className="h-5 w-5 mr-1 text-yellow-500 fill-yellow-500" />
            <span className="font-bold">{property.rating}</span>
          </div>
          <Separator orientation="vertical" className="h-6 mx-2" />
          <span>{totalReviews} reviews</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Rating Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = ratingDistribution[rating as keyof typeof ratingDistribution] || 0;
                  const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                  
                  return (
                    <div key={rating} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="mr-2">{rating}</span>
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {count} {count === 1 ? "review" : "reviews"}
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="md:col-span-2">
          <PropertyReviews propertyId={id || ""} />
        </div>
      </div>
    </div>
  );
};

export default ViewPropertyReviews;

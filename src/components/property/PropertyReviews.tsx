
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface PropertyReviewsProps {
  propertyId: string;
}

// Mock review data
const mockReviews = [
  {
    id: "1",
    author: "John Doe",
    avatar: "/placeholder.svg",
    date: "September 2023",
    rating: 5,
    comment: "Amazing property with spectacular views. Everything was clean and well-maintained. Will definitely be coming back!"
  },
  {
    id: "2",
    author: "Emma Wilson",
    avatar: "/placeholder.svg",
    date: "August 2023",
    rating: 4,
    comment: "Lovely place to stay. Great location, comfortable beds, and the host was very responsive. The only small issue was the WiFi was a bit spotty."
  },
  {
    id: "3",
    author: "Michael Chen",
    avatar: "/placeholder.svg",
    date: "July 2023",
    rating: 5,
    comment: "Perfect getaway spot! The beach access was incredible, and the property had everything we needed. Highly recommend for families."
  }
];

const PropertyReviews = ({ propertyId }: PropertyReviewsProps) => {
  const [visibleReviews, setVisibleReviews] = useState(3);
  const reviews = mockReviews;
  
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  
  const handleLoadMore = () => {
    setVisibleReviews(prev => prev + 3);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <div className="flex items-center">
            <Star className="h-5 w-5 mr-1 text-yellow-500" />
            <span>{averageRating.toFixed(1)}</span>
          </div>
          <Separator orientation="vertical" className="h-5 mx-3" />
          <span>{reviews.length} reviews</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {reviews.slice(0, visibleReviews).map((review) => (
            <div key={review.id} className="space-y-2">
              <div className="flex items-start space-x-4">
                <Avatar>
                  <AvatarImage src={review.avatar} alt={review.author} />
                  <AvatarFallback>{review.author.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="font-medium">{review.author}</div>
                  <div className="text-sm text-muted-foreground">{review.date}</div>
                </div>
              </div>
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`} 
                    fill={i < review.rating ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{review.comment}</p>
              
              {review.id !== reviews.slice(0, visibleReviews).slice(-1)[0].id && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
          
          {visibleReviews < reviews.length && (
            <Button 
              variant="outline" 
              onClick={handleLoadMore} 
              className="w-full mt-4"
            >
              Show more reviews
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyReviews;

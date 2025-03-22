
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Mock booking data
const mockBooking = {
  id: "book-1",
  propertyId: "prop-1",
  propertyName: "Oceanview Villa",
  checkInDate: new Date("2023-08-10"),
  checkOutDate: new Date("2023-08-15"),
  imageUrl: "/placeholder.svg",
};

const AddReview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  
  // In a real app, we would fetch the booking details based on the ID
  const booking = mockBooking;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    
    if (comment.trim() === "") {
      toast.error("Please enter a review comment");
      return;
    }
    
    // Here we would submit the review to the backend
    // For now, just show a success message and navigate back
    toast.success("Review submitted successfully!");
    navigate("/customer/reviews");
  };
  
  return (
    <div className="container p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Write a Review</CardTitle>
          <CardDescription>
            Share your experience at {booking.propertyName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                <div className="hidden sm:block">
                  <img 
                    src={booking.imageUrl} 
                    alt={booking.propertyName} 
                    className="w-24 h-24 object-cover rounded-md"
                  />
                </div>
                
                <div className="sm:col-span-3">
                  <h3 className="font-medium">{booking.propertyName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1 focus:outline-none focus:ring-0"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        (hoveredRating ? star <= hoveredRating : star <= rating)
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="comment" className="text-sm font-medium">Your Review</label>
              <Textarea
                id="comment"
                placeholder="Write about your experience..."
                rows={5}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit">Submit Review</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to format dates
function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default AddReview;

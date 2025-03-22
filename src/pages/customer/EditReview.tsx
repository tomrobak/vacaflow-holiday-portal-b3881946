
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Mock review data
const mockReview = {
  id: "rev-1",
  propertyId: "prop-1",
  propertyName: "Oceanview Villa",
  imageUrl: "/placeholder.svg",
  rating: 4,
  comment: "Beautiful property with amazing views. The beach access was convenient and the amenities were great. The only downside was the noise from the nearby restaurant at night.",
  createdAt: new Date("2023-09-15"),
  status: "published",
};

const EditReview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // In a real app, we would fetch the review details based on the ID
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setRating(mockReview.rating);
      setComment(mockReview.comment);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [id]);
  
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
    
    // Here we would update the review in the backend
    // For now, just show a success message and navigate back
    toast.success("Review updated successfully!");
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
          <CardTitle className="text-2xl">Edit Your Review</CardTitle>
          <CardDescription>
            Update your review for {mockReview.propertyName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                  <div className="hidden sm:block">
                    <img 
                      src={mockReview.imageUrl} 
                      alt={mockReview.propertyName} 
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  </div>
                  
                  <div className="sm:col-span-3">
                    <h3 className="font-medium">{mockReview.propertyName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Review posted on {formatDate(mockReview.createdAt)}
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
                <Button type="submit">Update Review</Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to format dates
function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default EditReview;

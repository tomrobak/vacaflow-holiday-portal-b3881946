
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Mock review data
const mockReview = {
  id: "rev-1",
  propertyId: "prop-1",
  propertyName: "Oceanview Villa",
  author: "John Smith",
  authorId: "user-1",
  avatar: "/placeholder.svg",
  rating: 4,
  comment: "Beautiful property with amazing views. The beach access was convenient and the amenities were great. The only downside was the noise from the nearby restaurant at night.",
  createdAt: new Date("2023-09-15"),
  status: "pending",
};

const EditReview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [review, setReview] = useState(mockReview);
  
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
    navigate(`/admin/properties/${review.propertyId}/reviews`);
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Edit Review</CardTitle>
              <CardDescription>
                Modify this review for {review.propertyName}
              </CardDescription>
            </div>
            <Badge variant={review.status === "published" ? "default" : "outline"}>
              {review.status === "published" ? "Published" : "Pending"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col space-y-2">
                <div className="grid grid-cols-1 gap-4 items-start">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{review.propertyName}</span>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <img
                      src={review.avatar}
                      alt={review.author}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{review.author}</span>
                      <span className="text-sm text-muted-foreground">
                        Posted on {formatDate(review.createdAt)}
                      </span>
                    </div>
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
                      className="p-1 focus:outline-none focus:ring-0"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="comment" className="text-sm font-medium">Review Content</label>
                <Textarea
                  id="comment"
                  placeholder="Review content..."
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

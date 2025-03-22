
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, X, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
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

const RejectReview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [review, setReview] = useState(mockReview);
  const [rejectionReason, setRejectionReason] = useState("");
  
  // In a real app, we would fetch the review details based on the ID
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [id]);
  
  const handleReject = () => {
    // Here we would update the review status in the backend
    // For now, just show a success message and navigate back
    toast.success("Review has been rejected!");
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
              <CardTitle className="text-2xl">Reject Review</CardTitle>
              <CardDescription>
                Reject this review for {review.propertyName}
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
            <div className="space-y-6">
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
              
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              
              <div className="bg-secondary p-4 rounded-md">
                <p className="text-muted-foreground">{review.comment}</p>
              </div>
              
              <div className="flex items-center p-4 border rounded-md bg-red-50 border-red-200">
                <X className="h-5 w-5 text-red-500 mr-3" />
                <div className="text-sm">
                  <p className="font-medium text-red-800">Rejecting this review</p>
                  <p className="text-red-700">This review will not be published and will be marked as rejected.</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="rejectionReason" className="text-sm font-medium">Reason for Rejection (Optional)</label>
                <Textarea
                  id="rejectionReason"
                  placeholder="Explain why this review is being rejected..."
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">This reason will be included in the notification to the user.</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button 
            onClick={handleReject} 
            disabled={isLoading}
            variant="destructive"
          >
            <X className="h-4 w-4 mr-2" />
            Reject Review
          </Button>
        </CardFooter>
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

export default RejectReview;

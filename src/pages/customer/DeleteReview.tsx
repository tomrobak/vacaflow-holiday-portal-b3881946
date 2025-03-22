
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Mock review data
const mockReview = {
  id: "rev-1",
  propertyId: "prop-1",
  propertyName: "Oceanview Villa",
  rating: 4,
  comment: "Beautiful property with amazing views. The beach access was convenient and the amenities were great. The only downside was the noise from the nearby restaurant at night.",
  createdAt: new Date("2023-09-15"),
};

const DeleteReview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [review, setReview] = useState(mockReview);
  
  // In a real app, we would fetch the review details based on the ID
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [id]);
  
  const handleDelete = () => {
    setIsConfirmOpen(false);
    
    // Here we would delete the review in the backend
    // For now, just show a success message and navigate back
    toast.success("Review deleted successfully!");
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
          <CardTitle className="text-2xl">Delete Review</CardTitle>
          <CardDescription>
            Are you sure you want to delete your review for {review.propertyName}?
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col space-y-1 bg-secondary p-4 rounded-md">
                <p className="font-medium">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < review.rating ? "text-yellow-500" : "text-gray-300"}>★</span>
                  ))}
                </p>
                <p className="text-muted-foreground">{review.comment}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Posted on {formatDate(review.createdAt)}
                </p>
              </div>
              
              <div className="flex items-center p-4 border rounded-md bg-amber-50 border-amber-200">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-3" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800">Warning</p>
                  <p className="text-amber-700">This action cannot be undone. The review will be permanently deleted.</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => setIsConfirmOpen(true)}
            disabled={isLoading}
          >
            Delete Review
          </Button>
        </CardFooter>
      </Card>
      
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your review for {review.propertyName}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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

export default DeleteReview;

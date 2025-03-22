
import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Star, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Mock reviews data
const mockReviews = [
  {
    id: "rev-1",
    propertyId: "prop-1",
    propertyName: "Oceanview Villa",
    rating: 5,
    comment: "Beautiful property with amazing views. Everything was clean and well-maintained.",
    createdAt: new Date("2023-09-15"),
    status: "published",
  },
  {
    id: "rev-2",
    propertyId: "prop-2",
    propertyName: "Mountain Cabin",
    rating: 4,
    comment: "Cozy cabin with great hiking trails nearby. Fireplace wasn't working properly though.",
    createdAt: new Date("2023-08-20"),
    status: "published",
  },
  {
    id: "rev-3",
    propertyId: "prop-3",
    propertyName: "Downtown Loft",
    rating: 3,
    comment: "Great location but a bit noisy at night. Could use better soundproofing.",
    createdAt: new Date("2023-07-05"),
    status: "pending",
  },
];

const CustomerReviews = () => {
  const [reviews] = useState(mockReviews);
  
  const publishedReviews = reviews.filter(review => review.status === "published");
  const pendingReviews = reviews.filter(review => review.status === "pending");
  
  return (
    <div className="container p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Reviews</h1>
          <p className="text-muted-foreground">Manage your property reviews</p>
        </div>
        <Button asChild>
          <Link to="/customer/bookings" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Write a Review
          </Link>
        </Button>
      </div>
      
      <Tabs defaultValue="published" className="w-full">
        <TabsList>
          <TabsTrigger value="published">Published ({publishedReviews.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingReviews.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="published" className="mt-6">
          {publishedReviews.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <p className="text-muted-foreground">You haven't published any reviews yet.</p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link to="/customer/bookings">Browse Your Stays</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {publishedReviews.map((review) => (
                <ReviewCard 
                  key={review.id} 
                  review={review}
                  actions={
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/customer/reviews/${review.id}/edit`}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/customer/reviews/${review.id}/delete`}>
                          <Trash className="h-4 w-4 mr-1" />
                          Delete
                        </Link>
                      </Button>
                    </div>
                  }
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="pending" className="mt-6">
          {pendingReviews.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <p className="text-muted-foreground">You don't have any pending reviews.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingReviews.map((review) => (
                <ReviewCard 
                  key={review.id} 
                  review={review}
                  actions={
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/customer/reviews/${review.id}/edit`}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/customer/reviews/${review.id}/delete`}>
                          <Trash className="h-4 w-4 mr-1" />
                          Delete
                        </Link>
                      </Button>
                    </div>
                  }
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface ReviewCardProps {
  review: typeof mockReviews[0];
  actions?: React.ReactNode;
}

const ReviewCard = ({ review, actions }: ReviewCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle>{review.propertyName}</CardTitle>
          <CardDescription>
            {format(review.createdAt, "MMMM d, yyyy")}
          </CardDescription>
        </div>
        <Badge variant={review.status === "published" ? "default" : "outline"}>
          {review.status === "published" ? "Published" : "Pending"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star 
              key={i} 
              className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
            />
          ))}
        </div>
        
        <p className="text-muted-foreground">{review.comment}</p>
        
        {actions && (
          <>
            <Separator />
            <div className="flex justify-end">{actions}</div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

// Helper function to format dates
function format(date: Date, formatStr: string) {
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
  return formatStr.replace("MMMM", months[date.getMonth()])
    .replace("d", date.getDate().toString())
    .replace("yyyy", date.getFullYear().toString());
}

export default CustomerReviews;

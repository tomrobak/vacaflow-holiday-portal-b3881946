
import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Star, Check, X, Edit, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

// Mock reviews data
const mockReviews = [
  {
    id: "rev-1",
    propertyId: "prop-1",
    propertyName: "Oceanview Villa",
    author: "John Smith",
    authorId: "user-1",
    avatar: "/placeholder.svg",
    rating: 5,
    comment: "Beautiful property with amazing views. Everything was clean and well-maintained.",
    createdAt: new Date("2023-09-15"),
    status: "pending",
  },
  {
    id: "rev-2",
    propertyId: "prop-2",
    propertyName: "Mountain Cabin",
    author: "Emma Wilson",
    authorId: "user-2",
    avatar: "/placeholder.svg",
    rating: 2,
    comment: "Disappointing experience. The cabin was not clean when we arrived, and several amenities listed were not actually available. Would not recommend.",
    createdAt: new Date("2023-08-20"),
    status: "pending",
  },
  {
    id: "rev-3",
    propertyId: "prop-3",
    propertyName: "Downtown Loft",
    author: "Michael Chen",
    authorId: "user-3",
    avatar: "/placeholder.svg",
    rating: 3,
    comment: "Average stay. Great location but noisy at night. Could use better soundproofing.",
    createdAt: new Date("2023-07-05"),
    status: "pending",
  },
];

const PendingReviews = () => {
  const [reviews] = useState(mockReviews);
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredReviews = searchTerm
    ? reviews.filter(review => 
        review.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : reviews;
  
  return (
    <div className="container p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Pending Reviews</h1>
          <p className="text-muted-foreground">
            {reviews.length} reviews waiting for approval
          </p>
        </div>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by property, guest, or review content..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {filteredReviews.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-muted-foreground">No pending reviews found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <Card key={review.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage src={review.avatar} alt={review.author} />
                    <AvatarFallback>{review.author.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base font-medium">{review.author}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
                <Badge variant="outline">Pending</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Link 
                    to={`/admin/properties/${review.propertyId}`}
                    className="text-primary hover:underline flex items-center"
                  >
                    <Building className="h-4 w-4 mr-1" />
                    {review.propertyName}
                  </Link>
                </div>
                
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                
                <p className="text-muted-foreground">{review.comment}</p>
                
                <Separator />
                
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/admin/reviews/${review.id}/edit`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                  </Button>
                  <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700" asChild>
                    <Link to={`/admin/reviews/${review.id}/approve`}>
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Link>
                  </Button>
                  <Button size="sm" variant="destructive" asChild>
                    <Link to={`/admin/reviews/${review.id}/reject`}>
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
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

export default PendingReviews;

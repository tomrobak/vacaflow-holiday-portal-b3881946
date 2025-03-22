
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, Edit, Check, X, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock property data
const mockProperty = {
  id: "prop-1",
  name: "Oceanview Villa",
  address: "123 Coastal Drive, Beachville, CA",
  rating: 4.8,
};

// Mock reviews data
const mockReviews = [
  {
    id: "rev-1",
    propertyId: "prop-1",
    author: "John Smith",
    authorId: "user-1",
    avatar: "/placeholder.svg",
    rating: 5,
    comment: "Beautiful property with amazing views. Everything was clean and well-maintained.",
    createdAt: new Date("2023-09-15"),
    status: "published",
  },
  {
    id: "rev-2",
    propertyId: "prop-1",
    author: "Emma Wilson",
    authorId: "user-2",
    avatar: "/placeholder.svg",
    rating: 4,
    comment: "Lovely place to stay. Great location, comfortable beds, and the host was very responsive. The only small issue was the WiFi was a bit spotty.",
    createdAt: new Date("2023-08-20"),
    status: "published",
  },
  {
    id: "rev-3",
    propertyId: "prop-1",
    author: "Michael Chen",
    authorId: "user-3",
    avatar: "/placeholder.svg",
    rating: 3,
    comment: "Property was okay but overpriced for what it offered. The photos made it look bigger than it actually was.",
    createdAt: new Date("2023-07-05"),
    status: "pending",
  },
];

const PropertyReviews = () => {
  const { id } = useParams<{ id: string }>();
  const [property] = useState(mockProperty);
  const [reviews] = useState(mockReviews);
  
  const publishedReviews = reviews.filter(review => review.status === "published");
  const pendingReviews = reviews.filter(review => review.status === "pending");
  
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
          <span>{reviews.length} reviews</span>
        </div>
      </div>
      
      <Tabs defaultValue="published" className="w-full">
        <TabsList>
          <TabsTrigger value="published">Published ({publishedReviews.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending Approval ({pendingReviews.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="published" className="mt-6">
          {publishedReviews.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <p className="text-muted-foreground">No published reviews for this property yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {publishedReviews.map((review) => (
                <ReviewCard 
                  key={review.id} 
                  review={review}
                  actions={
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/admin/reviews/${review.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="text-destructive">
                          <Link to={`/admin/reviews/${review.id}/reject`}>
                            <X className="h-4 w-4 mr-2" />
                            Unpublish
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
                <p className="text-muted-foreground">No pending reviews for this property.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingReviews.map((review) => (
                <ReviewCard 
                  key={review.id} 
                  review={review}
                  actions={
                    <div className="flex">
                      <Button variant="ghost" size="icon" asChild className="text-green-600 hover:text-green-700">
                        <Link to={`/admin/reviews/${review.id}/approve`}>
                          <Check className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild className="text-destructive">
                        <Link to={`/admin/reviews/${review.id}/reject`}>
                          <X className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/admin/reviews/${review.id}/edit`}>
                          <Edit className="h-4 w-4" />
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
          <div className="flex justify-end">{actions}</div>
        )}
      </CardContent>
    </Card>
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

export default PropertyReviews;

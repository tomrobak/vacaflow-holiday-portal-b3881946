
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { format, addDays, differenceInDays } from "date-fns";
import {
  Calendar as CalendarIcon,
  Edit,
  Trash2,
  Clock,
  Users,
  Bed,
  Bath,
  Home,
  Check,
  ChevronLeft,
  ImageOff,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mock data for a single property
const propertyData = {
  id: 1,
  name: "Sunset Villa",
  description:
    "A beautiful beachfront villa with panoramic ocean views and modern amenities. Located in the exclusive Malibu neighborhood, this property offers direct beach access and a private pool. Perfect for families or groups looking for a luxury vacation experience with all the comforts of home. Enjoy beautiful sunsets from the expansive deck overlooking the Pacific Ocean.",
  location: "Malibu, CA",
  price: 350,
  bedrooms: 4,
  bathrooms: 3,
  propertyType: "Villa",
  amenities: [
    "WiFi",
    "Swimming Pool",
    "Air Conditioning",
    "Kitchen",
    "Free Parking",
    "TV",
    "Washing Machine",
    "Beach Access",
  ],
  images: [
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
  ],
  availableFrom: new Date(),
  availableTo: addDays(new Date(), 90),
  // Mock booking data for the calendar
  bookedDates: [
    {
      startDate: addDays(new Date(), 5),
      endDate: addDays(new Date(), 10),
      customerName: "John Smith",
    },
    {
      startDate: addDays(new Date(), 20),
      endDate: addDays(new Date(), 25),
      customerName: "Emma Johnson",
    },
  ],
};

const PropertyDetail = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bookingStartDate, setBookingStartDate] = useState<Date | undefined>(
    undefined
  );
  const [bookingEndDate, setBookingEndDate] = useState<Date | undefined>(
    undefined
  );
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  // In a real app, we would fetch the property data based on the ID
  // For now, we'll use our mock data
  const property = propertyData;

  // Function to check if a date is booked
  const isDateBooked = (date: Date) => {
    return property.bookedDates.some(
      (booking) =>
        date >= booking.startDate && date <= booking.endDate
    );
  };

  // Function to check if a date should be disabled in the calendar
  const isDateDisabled = (date: Date) => {
    return (
      date < property.availableFrom ||
      date > property.availableTo ||
      isDateBooked(date)
    );
  };

  // Function to handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    if (!bookingStartDate) {
      setBookingStartDate(date);
    } else if (!bookingEndDate && date > bookingStartDate) {
      // Check if any dates in the range are booked
      let hasBookedDate = false;
      let currentDate = new Date(bookingStartDate.getTime());
      while (currentDate <= date) {
        if (isDateBooked(currentDate)) {
          hasBookedDate = true;
          break;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      if (hasBookedDate) {
        toast.error("Your selected range includes already booked dates");
        setBookingStartDate(date);
        setBookingEndDate(undefined);
      } else {
        setBookingEndDate(date);
      }
    } else {
      // Reset and start a new selection
      setBookingStartDate(date);
      setBookingEndDate(undefined);
    }
  };

  // Calculate number of nights and total price
  const numberOfNights = bookingStartDate && bookingEndDate
    ? differenceInDays(bookingEndDate, bookingStartDate) + 1
    : 0;
  const totalPrice = numberOfNights * property.price;

  // Navigation for the image gallery
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === property.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? property.images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          to="/properties"
          className="flex items-center text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Properties
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {property.name}
              </h1>
              <p className="text-muted-foreground mt-1">{property.location}</p>
            </div>
            <div className="flex gap-2 mt-2 md:mt-0">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/properties/${id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Link>
              </Button>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </div>
          </div>

          {/* Property Images */}
          <div className="relative w-full h-80 mb-6 bg-muted rounded-lg overflow-hidden">
            {property.images.length > 0 ? (
              <>
                <img
                  src={property.images[currentImageIndex]}
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex justify-between items-center px-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-black/20 text-white hover:bg-black/40"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-black/20 text-white hover:bg-black/40"
                    onClick={nextImage}
                  >
                    <ChevronLeft className="h-6 w-6 rotate-180" />
                  </Button>
                </div>
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                  {property.images.map((_, index) => (
                    <button
                      key={index}
                      className={`h-2 w-2 rounded-full ${
                        index === currentImageIndex
                          ? "bg-white"
                          : "bg-white/50"
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <ImageOff className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No images available</p>
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">About this property</h2>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center">
                  <Home className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>{property.propertyType}</span>
                </div>
                <div className="flex items-center">
                  <Bed className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>{property.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center">
                  <Bath className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>{property.bathrooms} Bathrooms</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>Up to {property.bedrooms * 2} guests</span>
                </div>
              </div>
              <p className="mt-4 text-pretty">{property.description}</p>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.amenities
                  .slice(0, showAllAmenities ? property.amenities.length : 6)
                  .map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-primary" />
                      <span>{amenity}</span>
                    </div>
                  ))}
              </div>
              {property.amenities.length > 6 && (
                <Button
                  variant="link"
                  className="mt-2 p-0 h-auto"
                  onClick={() => setShowAllAmenities(!showAllAmenities)}
                >
                  {showAllAmenities ? "Show less" : "Show all amenities"}
                </Button>
              )}
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-4">Availability</h2>
              <div className="border rounded-lg p-4">
                <Calendar
                  mode="range"
                  selected={{
                    from: bookingStartDate,
                    to: bookingEndDate,
                  }}
                  onSelect={(range) => {
                    if (range?.from) {
                      handleDateSelect(range.from);
                    }
                    if (range?.to) {
                      handleDateSelect(range.to);
                    }
                  }}
                  disabled={isDateDisabled}
                  className="w-full p-3 pointer-events-auto"
                  numberOfMonths={2}
                  classNames={{
                    months: "flex flex-col md:flex-row space-y-4 md:space-x-4 md:space-y-0",
                  }}
                />
                <div className="mt-4 text-sm text-muted-foreground">
                  <p className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Available from{" "}
                    <span className="font-medium mx-1">
                      {format(property.availableFrom, "PP")}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium mx-1">
                      {format(property.availableTo, "PP")}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Card */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-2xl">${property.price}</CardTitle>
              <CardDescription>per night</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Check-in</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !bookingStartDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {bookingStartDate ? (
                            format(bookingStartDate, "PP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={bookingStartDate}
                          onSelect={(date) => {
                            setBookingStartDate(date);
                            setBookingEndDate(undefined);
                          }}
                          disabled={isDateDisabled}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Check-out</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !bookingEndDate && "text-muted-foreground"
                          )}
                          disabled={!bookingStartDate}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {bookingEndDate ? (
                            format(bookingEndDate, "PP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={bookingEndDate}
                          onSelect={setBookingEndDate}
                          disabled={(date) => {
                            if (!bookingStartDate) return true;
                            if (date < bookingStartDate) return true;
                            // Check if any date between start and current is booked
                            let currentDate = new Date(bookingStartDate.getTime());
                            while (currentDate <= date) {
                              if (isDateBooked(currentDate)) return true;
                              currentDate.setDate(currentDate.getDate() + 1);
                            }
                            return isDateDisabled(date);
                          }}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {bookingStartDate && bookingEndDate && (
                  <div className="space-y-4 mt-4">
                    <div className="flex justify-between text-sm">
                      <span>
                        ${property.price} x {numberOfNights} nights
                      </span>
                      <span>${property.price * numberOfNights}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Cleaning fee</span>
                      <span>$50</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Service fee</span>
                      <span>${Math.round(totalPrice * 0.1)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>
                        ${totalPrice + 50 + Math.round(totalPrice * 0.1)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                disabled={!bookingStartDate || !bookingEndDate}
                onClick={() => {
                  toast.success("Booking request submitted", {
                    description: "You'll receive a confirmation soon.",
                  });
                }}
              >
                {!bookingStartDate || !bookingEndDate 
                  ? "Select dates" 
                  : "Request Booking"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;

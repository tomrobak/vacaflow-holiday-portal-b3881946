
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Home, Calendar, CreditCard, Users, Settings } from "lucide-react";

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Vacaflow App</h1>
        <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
          A comprehensive vacation property rental management application
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              <CardTitle className="text-base md:text-lg">Property Management</CardTitle>
            </div>
            <CardDescription className="text-sm md:text-base">
              Manage your vacation properties with ease
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            <p className="text-sm md:text-base">
              Add, edit, and remove properties from your catalog. Upload images,
              set pricing, and manage availability.
            </p>
          </CardContent>
          <CardFooter className="p-4 md:p-6 pt-0">
            <Button asChild className="w-full">
              <Link to="/properties">View Properties</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              <CardTitle className="text-base md:text-lg">Booking Calendar</CardTitle>
            </div>
            <CardDescription className="text-sm md:text-base">
              Visualize and manage property availability
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            <p className="text-sm md:text-base">
              Interactive calendar with booking management. Sync with Google
              Calendar and avoid double bookings.
            </p>
          </CardContent>
          <CardFooter className="p-4 md:p-6 pt-0">
            <Button asChild className="w-full">
              <Link to="/calendar">Open Calendar</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              <CardTitle className="text-base md:text-lg">Payments & Invoices</CardTitle>
            </div>
            <CardDescription className="text-sm md:text-base">
              Track payments and generate invoices
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            <p className="text-sm md:text-base">
              Fully integrated with Stripe for secure payments. Generate
              invoices, handle refunds, and track revenue.
            </p>
          </CardContent>
          <CardFooter className="p-4 md:p-6 pt-0">
            <Button asChild className="w-full">
              <Link to="/payments">Manage Payments</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              <CardTitle className="text-base md:text-lg">Customer Management</CardTitle>
            </div>
            <CardDescription className="text-sm md:text-base">
              Keep track of your customers and bookings
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            <p className="text-sm md:text-base">
              Manage customer profiles, view booking history, and communicate
              directly through the integrated messaging system.
            </p>
          </CardContent>
          <CardFooter className="p-4 md:p-6 pt-0">
            <Button asChild className="w-full">
              <Link to="/customers">View Customers</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              <CardTitle className="text-base md:text-lg">Settings & Configuration</CardTitle>
            </div>
            <CardDescription className="text-sm md:text-base">
              Configure your application to suit your needs
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            <p className="text-sm md:text-base">
              Customize payment options, email notifications, storage
              preferences, and more through an intuitive interface.
            </p>
          </CardContent>
          <CardFooter className="p-4 md:p-6 pt-0">
            <Button asChild className="w-full">
              <Link to="/settings">Open Settings</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-base md:text-lg">Getting Started</CardTitle>
            <CardDescription className="text-sm md:text-base">
              New to Vacaflow? Start here to set up your account
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            <p className="text-sm md:text-base">
              Follow our simple guide to set up your properties, configure
              payment methods, and start accepting bookings in minutes.
            </p>
          </CardContent>
          <CardFooter className="p-4 md:p-6 pt-0">
            <Button asChild className="w-full">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Index;

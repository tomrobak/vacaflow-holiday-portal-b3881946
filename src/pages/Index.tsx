
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Vacaflow App</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A comprehensive vacation property rental management application
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Home className="h-6 w-6 text-primary" />
              <CardTitle>Property Management</CardTitle>
            </div>
            <CardDescription>
              Manage your vacation properties with ease
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Add, edit, and remove properties from your catalog. Upload images,
              set pricing, and manage availability.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/properties">View Properties</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              <CardTitle>Booking Calendar</CardTitle>
            </div>
            <CardDescription>
              Visualize and manage property availability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Interactive calendar with booking management. Sync with Google
              Calendar and avoid double bookings.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/calendar">Open Calendar</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-primary" />
              <CardTitle>Payments & Invoices</CardTitle>
            </div>
            <CardDescription>
              Track payments and generate invoices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Fully integrated with Stripe for secure payments. Generate
              invoices, handle refunds, and track revenue.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/payments">Manage Payments</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              <CardTitle>Customer Management</CardTitle>
            </div>
            <CardDescription>
              Keep track of your customers and bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Manage customer profiles, view booking history, and communicate
              directly through the integrated messaging system.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/customers">View Customers</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-6 w-6 text-primary" />
              <CardTitle>Settings & Configuration</CardTitle>
            </div>
            <CardDescription>
              Configure your application to suit your needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Customize payment options, email notifications, storage
              preferences, and more through an intuitive interface.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/settings">Open Settings</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              New to Vacaflow? Start here to set up your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Follow our simple guide to set up your properties, configure
              payment methods, and start accepting bookings in minutes.
            </p>
          </CardContent>
          <CardFooter>
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

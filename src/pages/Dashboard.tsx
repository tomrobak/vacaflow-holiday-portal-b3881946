
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  CreditCard,
  DollarSign,
  Home,
  Plus,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // In a real application, this data would come from the API
  const stats = [
    {
      title: "Total Properties",
      value: "4",
      icon: Home,
      description: "Active vacation properties",
      change: "+1 from last month",
    },
    {
      title: "Active Bookings",
      value: "12",
      icon: Calendar,
      description: "Current and upcoming",
      change: "+3 from last month",
    },
    {
      title: "Total Customers",
      value: "87",
      icon: Users,
      description: "Registered users",
      change: "+9 from last month",
    },
    {
      title: "Revenue",
      value: "$13,258",
      icon: DollarSign,
      description: "This month",
      change: "+18% from last month",
    },
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your vacation rental business
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button asChild>
            <Link to="/properties/new">
              <Plus className="mr-2 h-4 w-4" /> Add Property
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/calendar">View Calendar</Link>
          </Button>
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <p className="text-xs text-green-500 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent activity section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>
              Latest booking activity across all properties
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-md bg-secondary flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    <div>
                      <div className="font-medium">Sunset Villa</div>
                      <div className="text-sm text-muted-foreground">
                        {`June ${15 + i} - June ${20 + i}, 2024`}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/bookings/1">Details</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>Latest transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-md bg-secondary flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    <div>
                      <div className="font-medium">{`$${
                        550 + i * 125
                      }.00`}</div>
                      <div className="text-sm text-muted-foreground">
                        Booking #{1000 + i} - John Doe
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/payments/1">View</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CreditCard, FileText, MessageSquare, Home } from "lucide-react";
import { Link } from "react-router-dom";

const CustomerDashboard = () => {
  // Mock data that would come from an API in a real application
  const upcomingBookings = [
    { id: "BK-1001", property: "Beachside Villa", checkIn: "2023-08-12", checkOut: "2023-08-19", status: "confirmed" },
    { id: "BK-1002", property: "Mountain Cabin", checkIn: "2023-09-20", checkOut: "2023-09-25", status: "pending" },
  ];
  
  const recentPayments = [
    { id: "PAY-2001", amount: 1250.00, date: "2023-07-15", status: "completed" },
    { id: "PAY-2002", amount: 450.00, date: "2023-07-01", status: "pending" },
  ];
  
  const unreadMessages = 2;
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Welcome back, Jane</h1>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Stays</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingBookings.length}</div>
            <p className="text-xs text-muted-foreground">Next: Aug 12 - Beachside Villa</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadMessages}</div>
            <p className="text-xs text-muted-foreground">Last message 2 days ago</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$450.00</div>
            <p className="text-xs text-muted-foreground">Due on August 1, 2023</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Bookings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Upcoming Bookings</h2>
          <Button variant="outline" size="sm" asChild>
            <Link to="/customer/bookings">View All</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingBookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle>{booking.property}</CardTitle>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    booking.status === "confirmed" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
                <CardDescription>
                  {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Ref: {booking.id}</span>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/customer/bookings/${booking.id}`}>Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Payments */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Payments</h2>
          <Button variant="outline" size="sm" asChild>
            <Link to="/customer/payments">View All</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentPayments.map((payment) => (
            <Card key={payment.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle>${payment.amount.toFixed(2)}</CardTitle>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    payment.status === "completed" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                  }`}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </span>
                </div>
                <CardDescription>
                  {new Date(payment.date).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Ref: {payment.id}</span>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/customer/payments/${payment.id}`}>Receipt</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;

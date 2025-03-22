
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  CreditCard, 
  Home, 
  LayoutDashboard, 
  Menu, 
  MessageSquare, 
  CalendarCheck2, 
  FileText,
  User,
  LogOut,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const CustomerLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/customer/dashboard", icon: LayoutDashboard },
    { name: "My Bookings", href: "/customer/bookings", icon: CalendarCheck2 },
    { name: "Payments", href: "/customer/payments", icon: CreditCard },
    { name: "Invoices", href: "/customer/invoices", icon: FileText },
    { name: "Messages", href: "/customer/messages", icon: MessageSquare },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="flex h-full min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4 md:gap-8">
            <Link to="/" className="flex items-center space-x-2">
              <Home className="h-5 w-5" />
              <span className="font-semibold">Vacation Rentals</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center text-sm font-medium ${
                    isActive(item.href)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">Jane Doe</p>
              </div>
            </div>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:max-w-xs">
                <div className="flex items-center justify-between">
                  <Link to="/" className="flex items-center space-x-2" onClick={() => setOpen(false)}>
                    <Home className="h-5 w-5" />
                    <span className="font-semibold">Vacation Rentals</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <Separator className="my-4" />
                <div className="flex flex-col gap-4 py-4">
                  <div className="flex items-center gap-2 px-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt="User" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Jane Doe</p>
                    </div>
                  </div>
                  <Separator className="my-2" />
                  <nav className="flex flex-col space-y-2 px-2">
                    {navigation.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm ${
                          isActive(item.href)
                            ? "bg-muted font-medium text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-primary"
                        }`}
                        onClick={() => setOpen(false)}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                  <Separator className="my-2" />
                  <div className="px-2">
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground" asChild>
                      <Link to="/customer/profile" onClick={() => setOpen(false)}>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground" asChild>
                      <Link to="/login" onClick={() => setOpen(false)}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="border-t py-6 bg-background">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Vacation Rentals. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary">
              Terms
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary">
              Privacy
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomerLayout;

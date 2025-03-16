
import { ReactNode, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  User, 
  Home, 
  Calendar, 
  CreditCard, 
  MessageSquare, 
  LogOut,
  Menu,
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface CustomerLayoutProps {
  children: ReactNode;
}

const CustomerLayout = ({ children }: CustomerLayoutProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    // In a real app, this would call a logout API
    toast.info("Logged out successfully");
    navigate("/customer/login");
  };

  // Mobile layout
  if (isMobile) {
    return (
      <div className="flex min-h-screen flex-col">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <div className="flex h-full flex-col">
                <div className="flex h-14 items-center border-b px-4">
                  <Link to="/customer/dashboard" className="flex items-center gap-2 font-bold">
                    <span className="text-primary text-xl">Vacaflow</span>
                  </Link>
                </div>
                <nav className="flex-1 overflow-auto p-4 space-y-2">
                  <Link 
                    to="/customer/dashboard" 
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary"
                    onClick={() => {
                      const closeButton = document.querySelector('[data-radix-sheet-close]');
                      if (closeButton && closeButton instanceof HTMLElement) {
                        closeButton.click();
                      }
                    }}
                  >
                    <Home className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                  <Link 
                    to="/customer/bookings" 
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary"
                    onClick={() => {
                      const closeButton = document.querySelector('[data-radix-sheet-close]');
                      if (closeButton && closeButton instanceof HTMLElement) {
                        closeButton.click();
                      }
                    }}
                  >
                    <Calendar className="h-5 w-5" />
                    <span>Bookings</span>
                  </Link>
                  <Link 
                    to="/customer/payments" 
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary"
                    onClick={() => {
                      const closeButton = document.querySelector('[data-radix-sheet-close]');
                      if (closeButton && closeButton instanceof HTMLElement) {
                        closeButton.click();
                      }
                    }}
                  >
                    <CreditCard className="h-5 w-5" />
                    <span>Payments</span>
                  </Link>
                  <Link 
                    to="/customer/messages" 
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary"
                    onClick={() => {
                      const closeButton = document.querySelector('[data-radix-sheet-close]');
                      if (closeButton && closeButton instanceof HTMLElement) {
                        closeButton.click();
                      }
                    }}
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span>Messages</span>
                  </Link>
                </nav>
                <div className="border-t p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Jane Smith</span>
                      <span className="text-xs text-muted-foreground">
                        jane@example.com
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-auto h-8 w-8"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <Link to="/customer/dashboard" className="flex items-center gap-2 font-bold">
            <span className="text-primary text-xl">Vacaflow</span>
          </Link>
          
          <div className="ml-auto flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <User className="h-4 w-4" />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1">
          <div className="min-h-[calc(100vh-3.5rem)] bg-background">
            {children}
          </div>
        </main>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="bg-card text-card-foreground w-64 flex flex-col border-r">
        {/* Sidebar header */}
        <div className="flex h-16 items-center border-b px-6">
          <Link to="/customer/dashboard" className="flex items-center gap-2 font-bold">
            <span className="text-primary text-xl">Vacaflow</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <Link 
            to="/customer/dashboard" 
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary"
          >
            <Home className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link 
            to="/customer/bookings" 
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary"
          >
            <Calendar className="h-5 w-5" />
            <span>Bookings</span>
          </Link>
          <Link 
            to="/customer/payments" 
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary"
          >
            <CreditCard className="h-5 w-5" />
            <span>Payments</span>
          </Link>
          <Link 
            to="/customer/messages" 
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary"
          >
            <MessageSquare className="h-5 w-5" />
            <span>Messages</span>
          </Link>
        </nav>

        {/* User section */}
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <User className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Jane Smith</span>
              <span className="text-xs text-muted-foreground">
                jane@example.com
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto h-8 w-8"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </main>
    </div>
  );
};

export default CustomerLayout;

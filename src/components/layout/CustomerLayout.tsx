
import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Home, Calendar, CreditCard, MessageSquare, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CustomerLayoutProps {
  children: ReactNode;
}

const CustomerLayout = ({ children }: CustomerLayoutProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, this would call a logout API
    toast.info("Logged out successfully");
    navigate("/customer/login");
  };

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

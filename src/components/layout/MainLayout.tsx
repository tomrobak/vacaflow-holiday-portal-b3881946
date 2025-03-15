
import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Calendar,
  CreditCard,
  Home,
  LogOut,
  MessageSquare,
  PanelLeft,
  Settings,
  User,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
}

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const navItems: NavItem[] = [
    { label: "Dashboard", icon: Home, href: "/dashboard" },
    { label: "Properties", icon: Home, href: "/properties" },
    { label: "Calendar", icon: Calendar, href: "/calendar" },
    { label: "Bookings", icon: Calendar, href: "/bookings" },
    { label: "Customers", icon: Users, href: "/customers" },
    { label: "Payments", icon: CreditCard, href: "/payments" },
    { label: "Messages", icon: MessageSquare, href: "/messages" },
    { label: "Settings", icon: Settings, href: "/settings" },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-card text-card-foreground fixed inset-y-0 left-0 z-50 flex flex-col border-r transition-all duration-300 ease-in-out md:relative",
          sidebarOpen ? "w-64" : "w-[70px]"
        )}
      >
        {/* Sidebar header */}
        <div className="flex h-16 items-center justify-between px-4 py-4">
          <Link
            to="/"
            className={cn(
              "flex items-center gap-2 font-bold transition-opacity",
              !sidebarOpen && "opacity-0"
            )}
          >
            <span className="text-primary text-xl">Vacaflow</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8"
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2">
          <TooltipProvider delayDuration={0}>
            {navItems.map((item) => (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      location.pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span
                      className={cn(
                        "transition-opacity",
                        !sidebarOpen && "opacity-0"
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className={cn(!sidebarOpen && "flex")}
                >
                  {item.label}
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </nav>

        {/* User section */}
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <User className="h-5 w-5" />
            </div>
            <div
              className={cn(
                "flex flex-col transition-opacity",
                !sidebarOpen && "opacity-0"
              )}
            >
              <span className="text-sm font-medium">Admin User</span>
              <span className="text-xs text-muted-foreground">
                admin@vacaflow.com
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "ml-auto h-8 w-8 transition-opacity",
                !sidebarOpen && "opacity-0"
              )}
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

export default MainLayout;

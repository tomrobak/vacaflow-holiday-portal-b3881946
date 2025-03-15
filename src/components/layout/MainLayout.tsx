
import { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  LogOut,
  PanelLeft,
  Plus,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useNavigation, NavigationItem } from "@/hooks/use-navigation";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { navigationItems, isActive, isChildActive } = useNavigation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderNavItem = (item: NavigationItem) => {
    const active = isActive(item.href);
    const hasChildren = item.children && item.children.length > 0;
    const childActive = hasChildren && isChildActive(item);
    const [expanded, setExpanded] = useState(childActive);
    
    return (
      <div key={item.href} className="w-full">
        <Link
          to={hasChildren ? "#" : item.href}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            (active || childActive)
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
          )}
          onClick={(e) => {
            if (hasChildren) {
              e.preventDefault();
              setExpanded(!expanded);
            }
          }}
        >
          <item.icon className="h-5 w-5" />
          <span
            className={cn(
              "flex-1 transition-opacity",
              !sidebarOpen && "opacity-0"
            )}
          >
            {item.label}
          </span>
          {hasChildren && sidebarOpen && (
            <ChevronDown 
              className={cn(
                "h-4 w-4 transition-transform", 
                expanded && "rotate-180"
              )} 
            />
          )}
        </Link>
        
        {hasChildren && expanded && sidebarOpen && (
          <div className="ml-6 mt-1 space-y-1">
            {item.children?.map((child) => (
              <Link
                key={child.href}
                to={child.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive(child.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                )}
              >
                <child.icon className="h-4 w-4" />
                <span>{child.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
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
            {navigationItems.map((item) => (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <div>{renderNavItem(item)}</div>
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

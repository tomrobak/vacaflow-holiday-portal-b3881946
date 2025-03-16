
import { ReactNode, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  LogOut,
  Menu,
  PanelLeft,
  User,
  X,
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { navigationItems, isActive, isChildActive } = useNavigation();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderNavItem = (item: NavigationItem, onItemClick?: () => void) => {
    const active = isActive(item.href);
    const hasChildren = item.children && item.children.length > 0;
    const childActive = hasChildren && isChildActive(item);
    const [expanded, setExpanded] = useState(childActive);
    
    return (
      <div key={item.href} className="w-full">
        <Link
          to={hasChildren ? "#" : item.href}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
            (active || childActive)
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
          )}
          onClick={(e) => {
            if (hasChildren) {
              e.preventDefault();
              setExpanded(!expanded);
            } else if (onItemClick) {
              onItemClick();
            }
          }}
        >
          <item.icon className="h-5 w-5 flex-shrink-0" />
          <span className="flex-1 truncate">
            {item.label}
          </span>
          {hasChildren && (
            <ChevronDown 
              className={cn(
                "h-4 w-4 transition-transform", 
                expanded && "rotate-180"
              )} 
            />
          )}
        </Link>
        
        {hasChildren && expanded && (
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
                onClick={onItemClick}
              >
                <child.icon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{child.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Handle admin profile navigation
  const handleProfileClick = () => {
    navigate("/settings/profile");
  };

  // Mobile sidebar using Sheet component
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
                  <Link to="/" className="flex items-center gap-2 font-bold">
                    <span className="text-primary text-xl">Vacaflow</span>
                  </Link>
                </div>
                <nav className="flex-1 overflow-auto p-2 space-y-1">
                  {navigationItems.map((item) => 
                    renderNavItem(item, () => {
                      const closeButton = document.querySelector('[data-radix-sheet-close]');
                      if (closeButton && closeButton instanceof HTMLElement) {
                        closeButton.click();
                      }
                    })
                  )}
                </nav>
                <div className="border-t p-4">
                  <Button 
                    variant="ghost"
                    className="flex w-full items-center gap-3 px-2 py-1.5"
                    onClick={() => {
                      handleProfileClick();
                      const closeButton = document.querySelector('[data-radix-sheet-close]');
                      if (closeButton && closeButton instanceof HTMLElement) {
                        closeButton.click();
                      }
                    }}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">Admin User</span>
                      <span className="text-xs text-muted-foreground">
                        admin@vacaflow.com
                      </span>
                    </div>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <Link to="/" className="flex items-center gap-2 font-bold">
            <span className="text-primary text-xl">Vacaflow</span>
          </Link>
          
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <User className="h-4 w-4" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/settings/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings/portal")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Portal Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
        <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "flex w-full items-center gap-3 px-2 py-1.5 transition-opacity",
                  !sidebarOpen && "justify-center"
                )}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <User className="h-5 w-5" />
                </div>
                <div
                  className={cn(
                    "flex flex-col items-start transition-opacity",
                    !sidebarOpen && "opacity-0"
                  )}
                >
                  <span className="text-sm font-medium">Admin User</span>
                  <span className="text-xs text-muted-foreground">
                    admin@vacaflow.com
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate("/settings/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings/portal")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Portal Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

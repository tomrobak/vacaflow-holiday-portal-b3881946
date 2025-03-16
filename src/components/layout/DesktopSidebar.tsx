
import { Link } from "react-router-dom";
import { PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useNavigation } from "@/hooks/use-navigation";
import NavigationItem from "./NavigationItem";
import UserProfileButton from "./UserProfileButton";

interface DesktopSidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const DesktopSidebar = ({ sidebarOpen, toggleSidebar }: DesktopSidebarProps) => {
  const { navigationItems, isActive, isChildActive } = useNavigation();

  return (
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
                <div>
                  <NavigationItem 
                    item={item}
                    isActive={isActive}
                    isChildActive={isChildActive}
                    collapsed={!sidebarOpen}
                  />
                </div>
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
        <UserProfileButton collapsed={!sidebarOpen} />
      </div>
    </aside>
  );
};

export default DesktopSidebar;

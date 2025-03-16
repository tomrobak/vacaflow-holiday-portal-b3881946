
import { useNavigate } from "react-router-dom";
import { User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserProfileButtonProps {
  collapsed?: boolean;
  onClick?: () => void;
  className?: string;
}

const UserProfileButton = ({ collapsed = false, onClick, className }: UserProfileButtonProps) => {
  const navigate = useNavigate();

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    if (onClick) onClick();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "flex w-full items-center gap-3 px-2 py-1.5 transition-opacity",
            collapsed && "justify-center",
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <User className="h-5 w-5" />
          </div>
          <div
            className={cn(
              "flex flex-col items-start",
              collapsed && "opacity-0"
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
        <DropdownMenuItem onClick={() => handleMenuItemClick("/settings/profile")}>
          <User className="mr-2 h-4 w-4" />
          <span>My Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleMenuItemClick("/settings/portal")}>
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
  );
};

export default UserProfileButton;

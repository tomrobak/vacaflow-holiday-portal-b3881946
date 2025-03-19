
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavigationItem as NavigationItemType } from "@/types/navigation";

interface NavigationItemProps {
  item: NavigationItemType;
  isActive: (path: string) => boolean;
  isChildActive: (item: NavigationItemType) => boolean;
  collapsed?: boolean;
  onItemClick?: () => void;
}

const NavigationItem = ({ 
  item, 
  isActive, 
  isChildActive, 
  collapsed = false,
  onItemClick 
}: NavigationItemProps) => {
  const active = isActive(item.href);
  const hasChildren = item.children && item.children.length > 0;
  const childActive = hasChildren && isChildActive(item);
  const [expanded, setExpanded] = useState(childActive);
  
  return (
    <div className="w-full">
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
        <span className={cn("flex-1 truncate", collapsed && "opacity-0")}>
          {item.label}
        </span>
        {hasChildren && (
          <ChevronDown 
            className={cn(
              "h-4 w-4 transition-transform", 
              expanded && "rotate-180",
              collapsed && "opacity-0"
            )} 
          />
        )}
      </Link>
      
      {hasChildren && expanded && (
        <div className={cn("ml-6 mt-1 space-y-1", collapsed && "opacity-0 h-0 overflow-hidden")}>
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

export default NavigationItem;

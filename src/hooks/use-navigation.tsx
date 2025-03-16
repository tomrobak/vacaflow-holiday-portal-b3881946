
import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { navigationItems as defaultNavigationItems } from "@/data/navigationItems";
import { isActiveRoute, isChildRouteActive, getActiveNavigationItem } from "@/utils/navigationUtils";
import { NavigationItem } from "@/types/navigation";

export type { NavigationItem } from "@/types/navigation";

export function useNavigation(customItems?: NavigationItem[]) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Use custom navigation items if provided, otherwise use default
  const navigationItems = useMemo(() => 
    customItems || defaultNavigationItems, 
    [customItems]
  );

  const isActive = (path: string) => isActiveRoute(currentPath, path);
  
  const isChildActive = (item: NavigationItem) => isChildRouteActive(item, currentPath);

  return {
    navigate,
    navigationItems,
    currentPath,
    isActive,
    isChildActive,
    getActiveNavigationItem: () => getActiveNavigationItem(navigationItems, currentPath),
  };
}

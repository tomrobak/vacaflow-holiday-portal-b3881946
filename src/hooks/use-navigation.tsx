
import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Calendar,
  CreditCard,
  Home,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react";

export type NavigationItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  children?: NavigationItem[];
};

export function useNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = useMemo<NavigationItem[]>(
    () => [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: Home,
      },
      {
        label: "Properties",
        href: "/properties",
        icon: Home,
      },
      {
        label: "Calendar",
        href: "/calendar",
        icon: Calendar,
      },
      {
        label: "Bookings",
        href: "/bookings",
        icon: Calendar,
      },
      {
        label: "Customers",
        href: "/customers",
        icon: Users,
      },
      {
        label: "Payments",
        href: "/payments",
        icon: CreditCard,
      },
      {
        label: "Messages",
        href: "/messages",
        icon: MessageSquare,
      },
      {
        label: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
    []
  );

  const currentPath = location.pathname;

  const isActive = (path: string) => {
    return currentPath === path;
  };

  return {
    navigate,
    navigationItems,
    currentPath,
    isActive,
  };
}

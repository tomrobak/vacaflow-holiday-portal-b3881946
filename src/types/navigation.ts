
import { LucideIcon } from "lucide-react";

export type NavigationItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  children?: NavigationItem[];
};

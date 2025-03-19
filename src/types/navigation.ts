
import { ReactNode } from "react";

export interface NavigationItem {
  title: string;
  label: string;
  href: string;
  icon: React.ElementType;
  children?: NavigationItem[];
}

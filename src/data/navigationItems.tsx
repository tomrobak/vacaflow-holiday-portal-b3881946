
import {
  Calendar,
  CreditCard,
  Home,
  MessageSquare,
  Settings,
  Users,
  Building,
  BookOpen,
  Plus,
  Mail,
  Cloud,
  Server,
  Image,
  UserCheck,
  UserX,
  Clock,
  Palette,
  User,
  Sliders,
} from "lucide-react";
import { NavigationItem } from "@/types/navigation";

export const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    label: "Properties",
    href: "/properties",
    icon: Building,
    children: [
      {
        label: "All Properties",
        href: "/properties",
        icon: Building,
      },
      {
        label: "Add Property",
        href: "/properties/new",
        icon: Plus,
      },
    ],
  },
  {
    label: "Bookings",
    href: "/bookings",
    icon: BookOpen,
    children: [
      {
        label: "All Bookings",
        href: "/bookings",
        icon: BookOpen,
      },
      {
        label: "Calendar",
        href: "/calendar",
        icon: Calendar,
      },
    ]
  },
  {
    label: "Customers",
    href: "/customers",
    icon: Users,
    children: [
      {
        label: "All Customers",
        href: "/customers",
        icon: Users,
      },
      {
        label: "Add Customer",
        href: "/customers/new",
        icon: Plus,
      },
      {
        label: "Active Customers",
        href: "/customers?status=active",
        icon: UserCheck,
      },
      {
        label: "Inactive Customers",
        href: "/customers?status=inactive",
        icon: UserX,
      },
      {
        label: "Pending Customers",
        href: "/customers?status=pending",
        icon: Clock,
      },
    ]
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
    children: [
      {
        label: "General",
        href: "/settings/general",
        icon: Settings,
      },
      {
        label: "Unified Mailbox",
        href: "/settings/mail",
        icon: Mail,
      },
      {
        label: "Payment",
        href: "/settings/payment",
        icon: CreditCard,
      },
      {
        label: "Portal Settings",
        href: "/settings/portal",
        icon: Palette,
      },
      {
        label: "Admin Profile",
        href: "/settings/profile",
        icon: User,
      },
      {
        label: "Storage",
        href: "/settings/storage",
        icon: Cloud,
      },
      {
        label: "Images",
        href: "/settings/images",
        icon: Image,
      },
      {
        label: "Email Delivery",
        href: "/settings/email",
        icon: Server,
      },
    ],
  },
];

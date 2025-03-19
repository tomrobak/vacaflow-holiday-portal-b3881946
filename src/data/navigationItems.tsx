
import {
  LineChart,
  Home,
  CalendarCheck2,
  CalendarDays,
  Users,
  CreditCard,
  MessageSquare,
  Settings,
  Sliders,
  User,
  Mail,
  Smartphone as SmartphoneIcon,
  FileText,
  UserCircle,
  Inbox,
  HardDrive,
  Image,
  Package,
} from "lucide-react";
import { NavigationItem } from "@/types/navigation";

export const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: LineChart,
  },
  {
    title: "Properties",
    label: "Properties",
    href: "/properties",
    icon: Home,
  },
  {
    title: "Bookings",
    label: "Bookings",
    href: "/bookings",
    icon: CalendarCheck2,
  },
  {
    title: "Calendar",
    label: "Calendar",
    href: "/calendar",
    icon: CalendarDays,
  },
  {
    title: "Customers",
    label: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    title: "Payments",
    label: "Payments",
    href: "/payments",
    icon: CreditCard,
  },
  {
    title: "Messages",
    label: "Messages",
    href: "/messages",
    icon: MessageSquare,
    children: [
      {
        title: "SMS",
        label: "SMS",
        href: "/messages/sms",
        icon: SmartphoneIcon,
      },
    ],
  },
  {
    title: "Settings",
    label: "Settings",
    href: "/settings",
    icon: Settings,
    children: [
      {
        title: "General",
        label: "General",
        href: "/settings",
        icon: Sliders,
      },
      {
        title: "Add-ons",
        label: "Add-ons",
        href: "/settings/addons",
        icon: Package,
      },
      {
        title: "Admin Profile",
        label: "Admin Profile",
        href: "/settings/admin",
        icon: User,
      },
      {
        title: "Email",
        label: "Email",
        href: "/settings/email",
        icon: Mail,
      },
      {
        title: "SMS",
        label: "SMS",
        href: "/settings/sms",
        icon: SmartphoneIcon,
      },
      {
        title: "SMS Templates",
        label: "SMS Templates",
        href: "/settings/sms-templates",
        icon: FileText,
      },
      {
        title: "Payment",
        label: "Payment",
        href: "/settings/payment",
        icon: CreditCard,
      },
      {
        title: "Customer Portal",
        label: "Customer Portal",
        href: "/settings/portal",
        icon: UserCircle,
      },
      {
        title: "Mail Server",
        label: "Mail Server",
        href: "/settings/mail",
        icon: Inbox,
      },
      {
        title: "Storage",
        label: "Storage",
        href: "/settings/storage",
        icon: HardDrive,
      },
      {
        title: "Image Settings",
        label: "Image Settings",
        href: "/settings/images",
        icon: Image,
      },
    ],
  },
];

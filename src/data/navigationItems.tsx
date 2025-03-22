
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
    href: "/admin/dashboard",
    icon: LineChart,
  },
  {
    title: "Properties",
    label: "Properties",
    href: "/admin/properties",
    icon: Home,
  },
  {
    title: "Add-ons",
    label: "Add-ons",
    href: "/admin/addons",
    icon: Package,
  },
  {
    title: "Bookings",
    label: "Bookings",
    href: "/admin/bookings",
    icon: CalendarCheck2,
  },
  {
    title: "Calendar",
    label: "Calendar",
    href: "/admin/calendar",
    icon: CalendarDays,
  },
  {
    title: "Customers",
    label: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    title: "Payments",
    label: "Payments",
    href: "/admin/payments",
    icon: CreditCard,
  },
  {
    title: "Messages",
    label: "Messages",
    href: "/admin/messages",
    icon: MessageSquare,
    children: [
      {
        title: "SMS",
        label: "SMS",
        href: "/admin/messages/sms",
        icon: SmartphoneIcon,
      },
    ],
  },
  {
    title: "Settings",
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
    children: [
      {
        title: "General",
        label: "General",
        href: "/admin/settings",
        icon: Sliders,
      },
      {
        title: "Add-ons",
        label: "Add-ons",
        href: "/admin/settings/addons",
        icon: Package,
      },
      {
        title: "Admin Profile",
        label: "Admin Profile",
        href: "/admin/settings/admin",
        icon: User,
      },
      {
        title: "Email",
        label: "Email",
        href: "/admin/settings/email",
        icon: Mail,
      },
      {
        title: "SMS",
        label: "SMS",
        href: "/admin/settings/sms",
        icon: SmartphoneIcon,
      },
      {
        title: "Payment",
        label: "Payment",
        href: "/admin/settings/payment",
        icon: CreditCard,
      },
      {
        title: "Customer Portal",
        label: "Customer Portal",
        href: "/admin/settings/portal",
        icon: UserCircle,
      },
      {
        title: "Mail Server",
        label: "Mail Server",
        href: "/admin/settings/mail",
        icon: Inbox,
      },
      {
        title: "Storage",
        label: "Storage",
        href: "/admin/settings/storage",
        icon: HardDrive,
      },
      {
        title: "Image Settings",
        label: "Image Settings",
        href: "/admin/settings/images",
        icon: Image,
      },
    ],
  },
];

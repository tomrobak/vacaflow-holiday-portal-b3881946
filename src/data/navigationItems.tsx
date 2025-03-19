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

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  submenu?: {
    title: string;
    href: string;
    icon: React.ReactNode;
  }[];
}

export const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LineChart className="w-5 h-5" />,
  },
  {
    title: "Properties",
    href: "/properties",
    icon: <Home className="w-5 h-5" />,
  },
  {
    title: "Bookings",
    href: "/bookings",
    icon: <CalendarCheck2 className="w-5 h-5" />,
  },
  {
    title: "Calendar",
    href: "/calendar",
    icon: <CalendarDays className="w-5 h-5" />,
  },
  {
    title: "Customers",
    href: "/customers",
    icon: <Users className="w-5 h-5" />,
  },
  {
    title: "Payments",
    href: "/payments",
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    title: "Messages",
    href: "/messages",
    icon: <MessageSquare className="w-5 h-5" />,
    submenu: [
      {
        title: "SMS",
        href: "/messages/sms",
        icon: <SmartphoneIcon className="w-5 h-5" />,
      },
    ],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="w-5 h-5" />,
    submenu: [
      {
        title: "General",
        href: "/settings",
        icon: <Sliders className="w-5 h-5" />,
      },
      {
        title: "Add-ons",
        href: "/settings/addons",
        icon: <Package className="w-5 h-5" />,
      },
      {
        title: "Admin Profile",
        href: "/settings/admin",
        icon: <User className="w-5 h-5" />,
      },
      {
        title: "Email",
        href: "/settings/email",
        icon: <Mail className="w-5 h-5" />,
      },
      {
        title: "SMS",
        href: "/settings/sms",
        icon: <SmartphoneIcon className="w-5 h-5" />,
      },
      {
        title: "SMS Templates",
        href: "/settings/sms-templates",
        icon: <FileText className="w-5 h-5" />,
      },
      {
        title: "Payment",
        href: "/settings/payment",
        icon: <CreditCard className="w-5 h-5" />,
      },
      {
        title: "Customer Portal",
        href: "/settings/portal",
        icon: <UserCircle className="w-5 h-5" />,
      },
      {
        title: "Mail Server",
        href: "/settings/mail",
        icon: <Inbox className="w-5 h-5" />,
      },
      {
        title: "Storage",
        href: "/settings/storage",
        icon: <HardDrive className="w-5 h-5" />,
      },
      {
        title: "Image Settings",
        href: "/settings/images",
        icon: <Image className="w-5 h-5" />,
      },
    ],
  },
];

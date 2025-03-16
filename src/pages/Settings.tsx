
import React from "react";
import { Outlet } from "react-router-dom";
import { 
  Settings as SettingsIcon, 
  Mail, 
  CreditCard, 
  Cloud, 
  Server 
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.split("/").pop() || "general";
  const isMobile = useIsMobile();

  const handleNavigation = (value: string) => {
    navigate(`/settings/${value}`);
  };

  const navItems = [
    { value: "general", label: "General", icon: <SettingsIcon className="h-4 w-4" /> },
    { value: "mail", label: "Mail", icon: <Mail className="h-4 w-4" /> },
    { value: "payment", label: "Payment", icon: <CreditCard className="h-4 w-4" /> },
    { value: "storage", label: "Storage", icon: <Cloud className="h-4 w-4" /> },
    { value: "email", label: "Email", icon: <Server className="h-4 w-4" /> }
  ];

  return (
    <div className="container px-4 md:px-6 py-4 md:py-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Configure your platform settings and integrations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
        {/* Sidebar Navigation */}
        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
          <div className="flex flex-col">
            {navItems.map((item) => (
              <Button
                key={item.value}
                variant={currentPath === item.value ? "secondary" : "ghost"}
                className="justify-start rounded-none h-12 px-4"
                onClick={() => handleNavigation(item.value)}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-card rounded-lg border shadow-sm p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Settings;

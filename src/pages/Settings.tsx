
import React from "react";
import { Outlet } from "react-router-dom";
import { 
  Settings as SettingsIcon, 
  Mail, 
  CreditCard, 
  Cloud, 
  Server 
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.split("/").pop() || "general";

  const handleTabChange = (value: string) => {
    navigate(`/settings/${value}`);
  };

  return (
    <div className="container px-4 md:px-6 py-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your platform settings and integrations
        </p>
      </div>

      <Tabs 
        value={currentPath}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid grid-cols-5 w-full max-w-4xl">
          <TabsTrigger value="general" className="flex gap-2 items-center">
            <SettingsIcon className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="mail" className="flex gap-2 items-center">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Mail</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex gap-2 items-center">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Payment</span>
          </TabsTrigger>
          <TabsTrigger value="storage" className="flex gap-2 items-center">
            <Cloud className="h-4 w-4" />
            <span className="hidden sm:inline">Storage</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex gap-2 items-center">
            <Server className="h-4 w-4" />
            <span className="hidden sm:inline">Email</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="bg-card rounded-lg border shadow-sm p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Settings;

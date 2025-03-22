
import React from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { navigationItems } from "@/data/navigationItems";

const Settings = () => {
  const location = useLocation();
  const settingsItems = navigationItems.find(item => item.title === "Settings")?.children || [];
  
  // Get current active tab from URL
  const getCurrentTab = () => {
    const path = location.pathname;
    if (path === "/admin/settings") return "/admin/settings";
    
    const matchingChild = settingsItems.find(item => path.includes(item.href));
    return matchingChild?.href || "/admin/settings";
  };

  return (
    <div className="container px-4 md:px-6 py-4 md:py-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Configure your platform settings and integrations
        </p>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={getCurrentTab()} className="w-full">
        <TabsList className="w-full h-auto flex flex-wrap justify-start mb-6 bg-transparent p-0 gap-1">
          {settingsItems.map((item) => (
            <TabsTrigger
              key={item.href}
              value={item.href}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              asChild
            >
              <Link to={item.href} className="flex items-center gap-2">
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Content Area */}
      <div className="bg-card rounded-lg border shadow-sm p-4 md:p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Settings;

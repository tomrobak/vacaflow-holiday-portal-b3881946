
import React from "react";
import { Outlet } from "react-router-dom";

const Settings = () => {
  return (
    <div className="container px-4 md:px-6 py-4 md:py-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Configure your platform settings and integrations
        </p>
      </div>

      {/* Content Area */}
      <div className="bg-card rounded-lg border shadow-sm p-4 md:p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Settings;


import { ReactNode, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileNavigation from "./MobileNavigation";
import DesktopSidebar from "./DesktopSidebar";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Mobile layout
  if (isMobile) {
    return <MobileNavigation>{children}</MobileNavigation>;
  }

  // Desktop layout
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <DesktopSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;

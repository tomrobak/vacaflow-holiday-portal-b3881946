
import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigation } from "@/hooks/use-navigation";
import NavigationItem from "./NavigationItem";
import UserProfileButton from "./UserProfileButton";

interface MobileNavigationProps {
  children: ReactNode;
}

const MobileNavigation = ({ children }: MobileNavigationProps) => {
  const { navigationItems, isActive, isChildActive } = useNavigation();
  const navigate = useNavigate();

  const handleNavItemClick = () => {
    const closeButton = document.querySelector('[data-radix-sheet-close]');
    if (closeButton && closeButton instanceof HTMLElement) {
      closeButton.click();
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile header */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0">
            <div className="flex h-full flex-col">
              <div className="flex h-14 items-center border-b px-4">
                <Link to="/" className="flex items-center gap-2 font-bold">
                  <span className="text-primary text-xl">Vacaflow</span>
                </Link>
              </div>
              <nav className="flex-1 overflow-auto p-2 space-y-1">
                {navigationItems.map((item) => (
                  <NavigationItem 
                    key={item.href}
                    item={item} 
                    isActive={isActive}
                    isChildActive={isChildActive}
                    onItemClick={handleNavItemClick}
                  />
                ))}
              </nav>
              <div className="border-t p-4">
                <UserProfileButton onClick={handleNavItemClick} />
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        <Link to="/" className="flex items-center gap-2 font-bold">
          <span className="text-primary text-xl">Vacaflow</span>
        </Link>
        
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => navigate("/settings/profile")}>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <User className="h-4 w-4" />
            </div>
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="min-h-[calc(100vh-3.5rem)] bg-background">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MobileNavigation;

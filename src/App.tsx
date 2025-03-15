
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/layout/MainLayout";

// Pages that will be implemented later
const Calendar = () => <div className="p-6"><h1 className="text-3xl font-bold">Calendar</h1></div>;
const Bookings = () => <div className="p-6"><h1 className="text-3xl font-bold">Bookings</h1></div>;
const Customers = () => <div className="p-6"><h1 className="text-3xl font-bold">Customers</h1></div>;
const Payments = () => <div className="p-6"><h1 className="text-3xl font-bold">Payments</h1></div>;
const Messages = () => <div className="p-6"><h1 className="text-3xl font-bold">Messages</h1></div>;
const Settings = () => <div className="p-6"><h1 className="text-3xl font-bold">Settings</h1></div>;

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Routes with MainLayout */}
          <Route
            path="/dashboard"
            element={
              <MainLayout>
                <Dashboard />
              </MainLayout>
            }
          />
          <Route
            path="/properties"
            element={
              <MainLayout>
                <Properties />
              </MainLayout>
            }
          />
          <Route
            path="/calendar"
            element={
              <MainLayout>
                <Calendar />
              </MainLayout>
            }
          />
          <Route
            path="/bookings"
            element={
              <MainLayout>
                <Bookings />
              </MainLayout>
            }
          />
          <Route
            path="/customers"
            element={
              <MainLayout>
                <Customers />
              </MainLayout>
            }
          />
          <Route
            path="/payments"
            element={
              <MainLayout>
                <Payments />
              </MainLayout>
            }
          />
          <Route
            path="/messages"
            element={
              <MainLayout>
                <Messages />
              </MainLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <MainLayout>
                <Settings />
              </MainLayout>
            }
          />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

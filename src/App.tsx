import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import NewProperty from "./pages/NewProperty";
import PropertyCalendar from "./pages/PropertyCalendar";
import Customers from "./pages/Customers";
import NewCustomer from "./pages/NewCustomer";
import CustomerDetail from "./pages/CustomerDetail";
import EditCustomer from "./pages/EditCustomer";
import Bookings from "./pages/Bookings";
import BookingDetail from "./pages/BookingDetail";
import NewBooking from "./pages/NewBooking";
import EditBooking from "./pages/EditBooking";
import Calendar from "./pages/Calendar";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/layout/MainLayout";

// Pages that will be implemented later
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

          {/* Property Routes */}
          <Route
            path="/properties"
            element={
              <MainLayout>
                <Properties />
              </MainLayout>
            }
          />
          <Route
            path="/properties/new"
            element={
              <MainLayout>
                <NewProperty />
              </MainLayout>
            }
          />
          <Route
            path="/properties/:id"
            element={
              <MainLayout>
                <PropertyDetail />
              </MainLayout>
            }
          />
          <Route
            path="/properties/:id/calendar"
            element={
              <MainLayout>
                <PropertyCalendar />
              </MainLayout>
            }
          />

          {/* Customer Routes */}
          <Route
            path="/customers"
            element={
              <MainLayout>
                <Customers />
              </MainLayout>
            }
          />
          <Route
            path="/customers/new"
            element={
              <MainLayout>
                <NewCustomer />
              </MainLayout>
            }
          />
          <Route
            path="/customers/:id"
            element={
              <MainLayout>
                <CustomerDetail />
              </MainLayout>
            }
          />
          <Route
            path="/customers/:id/edit"
            element={
              <MainLayout>
                <EditCustomer />
              </MainLayout>
            }
          />

          {/* Booking Routes */}
          <Route
            path="/bookings"
            element={
              <MainLayout>
                <Bookings />
              </MainLayout>
            }
          />
          <Route
            path="/bookings/new"
            element={
              <MainLayout>
                <NewBooking />
              </MainLayout>
            }
          />
          <Route
            path="/bookings/:id"
            element={
              <MainLayout>
                <BookingDetail />
              </MainLayout>
            }
          />
          <Route
            path="/bookings/:id/edit"
            element={
              <MainLayout>
                <EditBooking />
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

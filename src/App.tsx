
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import Customers from "@/pages/Customers";
import NewCustomer from "@/pages/NewCustomer";
import Properties from "@/pages/Properties";
import Bookings from "@/pages/Bookings";
import Payments from "@/pages/Payments";
import Calendar from "@/pages/Calendar";
import NotFound from "@/pages/NotFound";
import NewPayment from "@/pages/NewPayment";
import PaymentDetail from "@/pages/PaymentDetail";
import Messages from "@/pages/Messages";
import NewProperty from "@/pages/NewProperty";
import PropertyDetail from "@/pages/PropertyDetail";
import PropertyCalendar from "@/pages/PropertyCalendar";
import { Toaster } from "sonner";

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<MainLayout><Outlet /></MainLayout>}>
          <Route index element={<Dashboard />} />
          <Route path="customers/*" element={<Customers />} />
          <Route path="customers/new" element={<NewCustomer />} />
          <Route path="properties/*" element={<Properties />} />
          <Route path="properties/new" element={<NewProperty />} />
          <Route path="properties/:id" element={<PropertyDetail />} />
          <Route path="properties/:id/calendar" element={<PropertyCalendar />} />
          <Route path="bookings/*" element={<Bookings />} />
          <Route path="payments" element={<Payments />} />
          <Route path="payments/new" element={<NewPayment />} />
          <Route path="payments/:id" element={<PaymentDetail />} />
          <Route path="calendar/*" element={<Calendar />} />
          <Route path="messages/*" element={<Messages />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

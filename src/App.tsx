
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import Customers from "@/pages/Customers";
import NewCustomer from "@/pages/NewCustomer";
import Properties from "@/pages/Properties";
import Bookings from "@/pages/Bookings";
import NewBooking from "@/pages/NewBooking";
import Payments from "@/pages/Payments";
import Calendar from "@/pages/Calendar";
import NotFound from "@/pages/NotFound";
import NewPayment from "@/pages/NewPayment";
import PaymentDetail from "@/pages/PaymentDetail";
import Messages from "@/pages/Messages";
import MessagesSms from "@/pages/MessagesSms";
import NewProperty from "@/pages/NewProperty";
import PropertyDetail from "@/pages/PropertyDetail";
import PropertyCalendar from "@/pages/PropertyCalendar";
import CustomerDashboard from "@/pages/CustomerDashboard";
import CustomerDetail from "@/pages/CustomerDetail";
import { Toaster } from "sonner";
import CustomerLayout from "@/components/layout/CustomerLayout";
import CustomerLogin from "@/pages/CustomerLogin";
import CustomerDashboardPage from "@/pages/customer/CustomerDashboard";
import CustomerBookings from "@/pages/customer/CustomerBookings";
import CustomerPayments from "@/pages/customer/CustomerPayments";
import CustomerMessages from "@/pages/customer/CustomerMessages";
import Settings from "@/pages/Settings";
import GeneralSettings from "@/pages/settings/GeneralSettings";
import MailSettings from "@/pages/settings/MailSettings";
import PaymentSettings from "@/pages/settings/PaymentSettings";
import StorageSettings from "@/pages/settings/StorageSettings";
import EmailSettings from "@/pages/settings/EmailSettings";
import ImageSettings from "@/pages/settings/ImageSettings";
import PortalSettings from "@/pages/settings/PortalSettings";
import AdminProfile from "@/pages/settings/AdminProfile";
import SmsSettings from "@/pages/settings/SmsSettings";
import SmsTemplatesPage from "@/pages/settings/SmsTemplatesPage";

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Customer routes */}
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/customer" element={<CustomerLayout><Outlet /></CustomerLayout>}>
          <Route path="dashboard" element={<CustomerDashboardPage />} />
          <Route path="bookings" element={<CustomerBookings />} />
          <Route path="payments" element={<CustomerPayments />} />
          <Route path="messages" element={<CustomerMessages />} />
        </Route>

        {/* Admin routes */}
        <Route path="/" element={<MainLayout><Outlet /></MainLayout>}>
          <Route index element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route path="customers/new" element={<NewCustomer />} />
          <Route path="customers/dashboard/:id" element={<CustomerDashboard />} />
          <Route path="customers/:id" element={<CustomerDetail />} />
          <Route path="properties/*" element={<Properties />} />
          <Route path="properties/new" element={<NewProperty />} />
          <Route path="properties/:id" element={<PropertyDetail />} />
          <Route path="properties/:id/calendar" element={<PropertyCalendar />} />
          <Route path="bookings/*" element={<Bookings />} />
          <Route path="bookings/new" element={<NewBooking />} />
          <Route path="payments" element={<Payments />} />
          <Route path="payments/new" element={<NewPayment />} />
          <Route path="payments/:id" element={<PaymentDetail />} />
          <Route path="calendar/*" element={<Calendar />} />
          <Route path="messages/*" element={<Messages />} />
          <Route path="messages/sms" element={<MessagesSms />} />
          
          {/* Settings routes */}
          <Route path="settings" element={<Settings />}>
            <Route index element={<GeneralSettings />} />
            <Route path="general" element={<GeneralSettings />} />
            <Route path="mail" element={<MailSettings />} />
            <Route path="payment" element={<PaymentSettings />} />
            <Route path="storage" element={<StorageSettings />} />
            <Route path="email" element={<EmailSettings />} />
            <Route path="images" element={<ImageSettings />} />
            <Route path="portal" element={<PortalSettings />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="sms" element={<SmsSettings />} />
            <Route path="sms/templates" element={<SmsTemplatesPage />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

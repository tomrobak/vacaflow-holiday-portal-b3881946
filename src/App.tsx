
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
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
import PropertyListing from "@/pages/PropertyListing";
import Checkout from "@/pages/Checkout";
import BookingConfirmation from "@/pages/BookingConfirmation";
import Index from "@/pages/Index";
import EditProperty from "@/pages/EditProperty";
import EditBooking from "@/pages/EditBooking";
import EditCustomer from "@/pages/EditCustomer";
import AddonsSettings from "@/pages/settings/AddonsSettings";
import BookingDetail from "@/pages/BookingDetail";
import Addons from "@/pages/Addons";
import LoginRegister from "@/pages/LoginRegister";

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Main login/register page for all users */}
        <Route path="/" element={<LoginRegister />} />

        {/* Property listing page - accessible to everyone */}
        <Route path="/property/:id" element={<PropertyListing />} />
        
        {/* Checkout flow */}
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/confirmation" element={<BookingConfirmation />} />

        {/* Admin dashboard and routes */}
        <Route path="/admin" element={<MainLayout><Outlet /></MainLayout>}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="properties" element={<Properties />} />
          <Route path="properties/:id" element={<PropertyDetail />} />
          <Route path="properties/:id/edit" element={<EditProperty />} />
          <Route path="properties/:id/calendar" element={<PropertyCalendar />} />
          <Route path="new-property" element={<NewProperty />} />
          <Route path="addons" element={<Addons />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="bookings/:id" element={<BookingDetail />} />
          <Route path="bookings/:id/edit" element={<EditBooking />} />
          <Route path="new-booking" element={<NewBooking />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="customers" element={<Customers />} />
          <Route path="customers/:id" element={<CustomerDetail />} />
          <Route path="customers/:id/edit" element={<EditCustomer />} />
          <Route path="new-customer" element={<NewCustomer />} />
          <Route path="payments" element={<Payments />} />
          <Route path="payments/:id" element={<PaymentDetail />} />
          <Route path="new-payment" element={<NewPayment />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/sms" element={<MessagesSms />} />
          <Route path="settings" element={<Settings />}>
            <Route index element={<GeneralSettings />} />
            <Route path="addons" element={<AddonsSettings />} />
            <Route path="admin" element={<AdminProfile />} />
            <Route path="email" element={<EmailSettings />} />
            <Route path="payment" element={<PaymentSettings />} />
            <Route path="sms" element={<SmsSettings />} />
            <Route path="sms-templates" element={<SmsTemplatesPage />} />
            <Route path="portal" element={<PortalSettings />} />
            <Route path="mail" element={<MailSettings />} />
            <Route path="storage" element={<StorageSettings />} />
            <Route path="images" element={<ImageSettings />} />
          </Route>
        </Route>

        {/* Customer dashboard and routes */}
        <Route path="/customer" element={<CustomerLayout><Outlet /></CustomerLayout>}>
          <Route index element={<CustomerDashboardPage />} />
          <Route path="dashboard" element={<CustomerDashboardPage />} />
          <Route path="bookings" element={<CustomerBookings />} />
          <Route path="payments" element={<CustomerPayments />} />
          <Route path="messages" element={<CustomerMessages />} />
        </Route>

        {/* Catch-all and redirects */}
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Loyalty from "./pages/Loyalty";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminMenuItems from "./pages/admin/MenuItems";
import AdminOrders from "./pages/admin/Orders";
import AdminLoyalty from "./pages/admin/LoyaltyProgram";
import AdminCoupons from "./pages/admin/Coupons";
import AdminCustomers from "./pages/admin/Customers";
import AdminDelivery from "./pages/admin/Delivery";
import AdminSettings from "./pages/admin/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/loyalty" element={<Loyalty />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/menu" element={<ProtectedRoute><AdminMenuItems /></ProtectedRoute>} />
              <Route path="/admin/orders" element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
              <Route path="/admin/loyalty" element={<ProtectedRoute><AdminLoyalty /></ProtectedRoute>} />
              <Route path="/admin/coupons" element={<ProtectedRoute><AdminCoupons /></ProtectedRoute>} />
              <Route path="/admin/customers" element={<ProtectedRoute><AdminCustomers /></ProtectedRoute>} />
              <Route path="/admin/delivery" element={<ProtectedRoute><AdminDelivery /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

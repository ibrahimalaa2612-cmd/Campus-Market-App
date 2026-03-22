import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Profile from "./pages/profile/Profile";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CompleteProfile from "./pages/profile/CompleteProfile";
import Sell from "./pages/Sell";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import ForgotPassword from "./pages/ForgotPassword";
import Settings from "./pages/Settings";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import AddProductPage from "./pages/admin/AddProductPage";
import ViewProductsPage from "./pages/admin/ViewProductsPage";

// Context & Routes
import { AuthProvider } from "./context/AuthContext";
import PrivateRouteComplete from "./routes/PrivateRouteComplete";
import AdminRoute from "./routes/AdminRoute";

function AppContent() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/complete-profile" element={
          <PrivateRouteComplete>
            <CompleteProfile />
          </PrivateRouteComplete>
        } />

        {/* User */}
        <Route path="/" element={<PrivateRouteComplete><Home /></PrivateRouteComplete>} />
        <Route path="/home" element={<Navigate to="/" />} />
        <Route path="/profile" element={<PrivateRouteComplete><Profile /></PrivateRouteComplete>} />
        <Route path="/settings" element={<PrivateRouteComplete><Settings /></PrivateRouteComplete>} />
        <Route path="/sell" element={<PrivateRouteComplete><Sell /></PrivateRouteComplete>} />
        <Route path="/orders" element={<PrivateRouteComplete><Orders /></PrivateRouteComplete>} />
        <Route path="/cart" element={<PrivateRouteComplete><Cart /></PrivateRouteComplete>} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
        <Route path="/admin/add-product" element={<AdminRoute><AddProductPage /></AdminRoute>} />
        <Route path="/admin/view-products" element={<AdminRoute><ViewProductsPage /></AdminRoute>} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
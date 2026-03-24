import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Sell from "./pages/Sell";
import MyProducts from "./pages/MyProducts";
import ForgotPassword from "./pages/ForgotPassword";
import Settings from "./pages/Settings";
import ProductDetail from "./pages/ProductDetail";
import SellerProducts from "./pages/SellerProducts";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";

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

        {/* User */}
        <Route path="/" element={<PrivateRouteComplete><Home /></PrivateRouteComplete>} />
        <Route path="/home" element={<Navigate to="/" />} />
        <Route path="/profile" element={<PrivateRouteComplete><Profile /></PrivateRouteComplete>} />
        <Route path="/settings" element={<PrivateRouteComplete><Settings /></PrivateRouteComplete>} />
        <Route path="/sell" element={<PrivateRouteComplete><Sell /></PrivateRouteComplete>} />
        <Route path="/myProducts" element={<PrivateRouteComplete><MyProducts /></PrivateRouteComplete>} />
        <Route path="/product/:id" element={<PrivateRouteComplete><ProductDetail /></PrivateRouteComplete>} />
        <Route path="/seller/:sellerId" element={<PrivateRouteComplete><SellerProducts /></PrivateRouteComplete>} />

        {/* Admin */}
        <Route 
          path="/dashboard" 
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          } 
        />

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
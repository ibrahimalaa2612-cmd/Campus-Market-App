import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Sell from "./pages/Sell";
import MyProducts from "./pages/MyProducts";
import Settings from "./pages/Settings";
import ProductDetail from "./pages/ProductDetail";
import SellerProducts from "./pages/SellerProducts";
import SellerProfile from "./pages/SellerProfile";
import Dashboard from "./pages/admin/Dashboard";
import Cart from "./pages/Cart";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import PrivateRouteComplete from "./routes/PrivateRouteComplete";
import AdminRoute from "./routes/AdminRoute";
import Chatbot from "./components/Chatbot";

function AppContent() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/" element={<PrivateRouteComplete><Home /></PrivateRouteComplete>} />
        <Route path="/home" element={<Navigate to="/" />} />
        <Route path="/profile" element={<PrivateRouteComplete><Profile /></PrivateRouteComplete>} />
        <Route path="/settings" element={<PrivateRouteComplete><Settings /></PrivateRouteComplete>} />
        <Route path="/sell" element={<PrivateRouteComplete><Sell /></PrivateRouteComplete>} />
        <Route path="/myProducts" element={<PrivateRouteComplete><MyProducts /></PrivateRouteComplete>} />
        <Route path="/product/:id" element={<PrivateRouteComplete><ProductDetail /></PrivateRouteComplete>} />
        <Route path="/seller/:sellerId" element={<PrivateRouteComplete><SellerProducts /></PrivateRouteComplete>} />
        <Route path="/sellerProfile/:sellerId" element={<PrivateRouteComplete><SellerProfile /></PrivateRouteComplete>} />
        <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Chatbot />
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
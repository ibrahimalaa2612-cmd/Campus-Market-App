import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CompleteProfile from "./pages/CompleteProfile";
import Sell from "./pages/Sell";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import ForgotPassword from "./pages/ForgotPassword";
import Settings from "./pages/Settings";
import { AuthProvider } from "./context/AuthContext";
import PrivateRouteComplete from "./components/PrivateRouteComplete";
//import PrivateRouteAdmin from "./components/PrivateRouteAdmin";
import Dashboard from "./pages/admin/Dashboard";
import AddProductPage from "./pages/admin/AddProductPage";
import ViewProductsPage from "./pages/admin/ViewProductsPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* User Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/complete" element={<CompleteProfile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/" element={<PrivateRouteComplete><Home /></PrivateRouteComplete>} />
          <Route path="/profile" element={<PrivateRouteComplete><Profile /></PrivateRouteComplete>} />
          <Route path="/settings" element={<PrivateRouteComplete><Settings /></PrivateRouteComplete>} />
          <Route path="/sell" element={<PrivateRouteComplete><Sell /></PrivateRouteComplete>} />
          <Route path="/orders" element={<PrivateRouteComplete><Orders /></PrivateRouteComplete>} />
          <Route path="/cart" element={<PrivateRouteComplete><Cart /></PrivateRouteComplete>} />

          {/* Admin Routes */}
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/add-product" element={<AddProductPage />} />
          <Route path="/admin/view-products" element={<ViewProductsPage />} />  
         {/* <Route path="/admin/add-product" element={<PrivateRouteAdmin><Products /></PrivateRouteAdmin>} />
          <Route path="/admin/view-products" element={<PrivateRouteAdmin><Products /></PrivateRouteAdmin>} />
         */}</Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
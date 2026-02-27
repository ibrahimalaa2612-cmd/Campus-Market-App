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
import { AuthProvider } from "./context/AuthContext";
import PrivateRouteComplete from "./components/PrivateRouteComplete";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar /> {/* Navbar موجودة طول الوقت */}
        <Routes>
          {/* صفحات عامة */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/complete" element={<CompleteProfile />} />

          {/* الصفحة الرئيسية */}
          <Route
            path="/"
            element={
              <PrivateRouteComplete>
                <Home />
              </PrivateRouteComplete>
            }
          />

          {/* صفحات محمية */}
          <Route
            path="/profile"
            element={
              <PrivateRouteComplete>
                <Profile />
              </PrivateRouteComplete>
            }
          />
          <Route
            path="/sell"
            element={
              <PrivateRouteComplete>
                <Sell />
              </PrivateRouteComplete>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRouteComplete>
                <Orders />
              </PrivateRouteComplete>
            }
          />
          <Route
            path="/cart"
            element={
              <PrivateRouteComplete>
                <Cart />
              </PrivateRouteComplete>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { signOut } from 'firebase/auth';
import { auth } from './firebase';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CompleteProfile from './pages/profile/CompleteProfile';

import Dashboard from './pages/admin/Dashboard';
import AdminRoute from './routes/AdminRoute';
import Products from "./pages/admin/Products";
function Home() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login'); 
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
    Campus Market 🎉اهلا بك في 
      </h2>

      <button
        onClick={handleLogout}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          padding: "15px 25px",
          fontSize: "18px",
          fontWeight: "bold",
          backgroundColor: "#f44336",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
          zIndex: 1000
        }}
      >
        Logout
      </button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/home" element={<Home />} /> 
          <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/admin/products"element={<AdminRoute>  <Products /></AdminRoute>}/>

        </Routes>
      </div>
    </Router>
  );
}

export default App;

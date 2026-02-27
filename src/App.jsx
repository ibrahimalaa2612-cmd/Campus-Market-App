/*
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import AdminRoute from "./routes/AdminRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/login" />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;*/
/*
import React, { useState } from 'react';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CompleteProfile from './pages/profile/CompleteProfile';

function App() {
  const [view, setView] = useState('login'); // login, register, complete

  return (
    <div className="App" style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      {view === 'login' && <Login onSwitch={() => setView('register')} onSuccess={() => setView('complete')} />}
      {view === 'register' && <Register onBack={() => setView('login')} onSuccess={() => setView('complete')} />}
      {view === 'complete' && <CompleteProfile />}
    </div>
  );
}

export default App;*/

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CompleteProfile from './pages/profile/CompleteProfile';

// صفحة مؤقتة لحد ما تعمل Home حقيقي
function Home() {
  return <h2 style={{ textAlign: "center", marginTop: "50px" }}>أهلاً بيك في Campus Market 🎉</h2>;
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
        </Routes>

      </div>
    </Router>
  );
}

export default App;


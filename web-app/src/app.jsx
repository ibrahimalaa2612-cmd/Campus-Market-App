import { BrowserRouter, Routes, Route } from "react-router-dom"
import RoleGuard from "./components/RoleGuard"
import Dashboard from "./pages/Dashboard"
import Home from "./pages/Home"
import Login from "./pages/Login"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <RoleGuard allowedRole="admin">
              <Dashboard />
            </RoleGuard>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
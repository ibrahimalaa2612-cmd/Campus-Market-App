import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, role, loading } = useAuth();

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;

  if (!user || role !== "admin") return <Navigate to="/login" />;

  return children;
}
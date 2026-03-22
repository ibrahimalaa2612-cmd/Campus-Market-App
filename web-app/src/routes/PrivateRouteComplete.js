import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRouteComplete({ children }) {
  const { user, role, loading } = useAuth();

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;

  if (!user) return <Navigate to="/login" />;
  if (role !== "user") return <Navigate to="/admin/dashboard" />; // لو admin دخل هنا

  return children;
}
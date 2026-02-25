import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function RoleGuard({ allowedRole, children }) {
  const { user, role } = useAuth()

  if (!user) return <Navigate to="/login" />
  if (role !== allowedRole) return <Navigate to="/" />

  return children
}
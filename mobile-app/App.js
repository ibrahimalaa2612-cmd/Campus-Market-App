import { AuthProvider } from "./constants/AuthContext"
import Navigation from "./navigation"

export default function App() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  )
}
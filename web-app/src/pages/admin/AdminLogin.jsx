import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
     e.preventDefault();
  setLoading(true);
  try {
    // eslint-disable-next-line no-unused-vars
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    navigate("/admin/dashboard");
     } catch (error) {
    alert("Login Failed");
                     } finally {
    setLoading(false);
                   }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} />
       <button type="submit" disabled={loading}>
             {loading ? "Logging..." : "Login"}
       </button>
      </form>
    </div>
  );

  
};

export default AdminLogin;
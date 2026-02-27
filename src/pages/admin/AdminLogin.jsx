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

  /*
  return (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#f4f4f4",
    }}
  >
    <form
      onSubmit={handleLogin}
      style={{
        background: "white",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        width: "300px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Admin Login</h2>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: "8px" }}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: "8px" }}
      />

      <button
        type="submit"
        style={{
          padding: "8px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Login
      </button>
    </form>
  </div>
);*/
};

export default AdminLogin;
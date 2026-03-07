import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); 
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const adminDoc = await getDoc(doc(db, "admins", user.email));

      if (adminDoc.exists() && adminDoc.data().role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("بيانات الدخول غير صحيحة");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>تسجيل الدخول</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="primary">دخول</button>
          {error && <p className="error-msg">{error}</p>}
          <p style={{ marginTop: "15px", textAlign: "center" }}>
            ليس لديك حساب؟ <Link to="/register">إنشاء حساب</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
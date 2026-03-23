import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) return setError("يرجى إدخال البريد الإلكتروني وكلمة المرور");

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) return setError("يرجى تأكيد البريد الإلكتروني أولاً.");

      const adminDoc = await getDoc(doc(db, "admins", user.email));
      if (adminDoc.exists() && adminDoc.data().role === "admin") navigate("/admin/dashboard", { replace: true });
      else navigate("/home", { replace: true });
    } catch (err) {
      console.error(err);
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") setError("بيانات الدخول غير صحيحة");
      else setError("حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>تسجيل الدخول</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="primary" disabled={loading}>{loading ? "جاري الدخول..." : "دخول"}</button>
          {error && <p className="error-msg">{error}</p>}
          <div style={{ marginTop: "15px", textAlign: "center" }}>
            <Link to="/forgot-password" style={{ color: "#3498db", textDecoration: "none", fontSize: "14px" }}>نسيت كلمة السر؟</Link>
          </div>
          <p style={{ marginTop: "15px", textAlign: "center" }}>
            ليس لديك حساب؟ <Link to="/register">إنشاء حساب</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
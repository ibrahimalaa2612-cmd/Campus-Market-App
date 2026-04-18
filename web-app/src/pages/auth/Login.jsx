import { useState, useEffect } from "react";
import { 
  signInWithEmailAndPassword, 
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  sendPasswordResetEmail
} from "firebase/auth";
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/home", { replace: true });
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) return setError("يرجى إدخال البريد الإلكتروني وكلمة المرور");

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const adminDoc = await getDoc(doc(db, "admins", user.email));
      if (adminDoc.exists() && adminDoc.data().role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    } catch (err) {
      console.error(err);
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") setError("بيانات الدخول غير صحيحة");
      else setError("حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError("حدث خطأ أثناء تسجيل الدخول بجوجل");
    }
  };

  const handleFacebookLogin = async () => {
    const provider = new FacebookAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError("حدث خطأ أثناء تسجيل الدخول بفيسبوك");
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("يرجى إدخال البريد الإلكتروني في الحقل أولاً لإرسال رابط التعيين");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.");
      setError("");
    } catch (err) {
      setError("تأكد من كتابة البريد الإلكتروني بشكل صحيح وأنه مسجل لدينا.");
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
          <button type="submit" className="primary" disabled={loading}>
            {loading ? "جاري الدخول..." : "دخول"}
          </button>
          
          {error && <p className="error-msg">{error}</p>}
          
          <div style={{ marginTop: "15px", textAlign: "center" }}>
            <span 
              onClick={handleResetPassword} 
              style={{ color: "#3498db", textDecoration: "none", fontSize: "14px", cursor: "pointer" }}
            >
              نسيت كلمة السر؟
            </span>
          </div>
          
          <p style={{ marginTop: "15px", textAlign: "center" }}>
            ليس لديك حساب؟ <Link to="/register">إنشاء حساب</Link>
          </p>
        </form>

        <div className="social-login" style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <button 
            onClick={handleGoogleLogin} 
            style={{ background: "#db4437", color: "white", padding: "10px", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
          >
            الدخول باستخدام Google
          </button>
          <button 
            onClick={handleFacebookLogin} 
            style={{ background: "#4267B2", color: "white", padding: "10px", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
          >
            الدخول باستخدام Facebook
          </button>
        </div>
      </div>
    </div>
  );
}

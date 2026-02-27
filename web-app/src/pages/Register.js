import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Auth.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      
      await setDoc(doc(db, "users", userCred.user.uid), {
        role: "user",
        email: email,
        createdAt: new Date()
      });

      navigate("/complete"); 
    } catch (err) {
      setError("حدث خطأ أثناء إنشاء الحساب");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>إنشاء حساب جديد</h2>

        <form onSubmit={handleRegister}>
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

          <input
            type="password"
            placeholder="تأكيد كلمة المرور"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" className="secondary">
            تسجيل
          </button>

          {error && <p className="error-msg">{error}</p>}

          <p style={{ marginTop: "15px" }}>
            لديك حساب بالفعل؟{" "}
            <Link to="/login">تسجيل الدخول</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
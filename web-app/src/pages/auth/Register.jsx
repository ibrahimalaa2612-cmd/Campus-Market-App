import React, { useState } from 'react';
import { auth, db } from "../../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../../styles/Auth.css";

function Register({ onBack }) {

  const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!passwordRegex.test(password)) {
      setError("كلمة المرور غير مطابقة للشروط");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email,
        createdAt: new Date()
      });

      alert("تم تسجيل الحساب بنجاح ✅");

      navigate("/login", { replace: true });

    } catch (error) {
      console.log(error.message);
      setError("حدث خطأ أثناء التسجيل");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h2>إنشاء حساب جديد</h2>

        <form onSubmit={handleRegister}>

          <input
            type="text"
            placeholder="الاسم الكامل"
            onChange={e => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="الإيميل"
            onChange={e => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="كلمة السر"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <small style={{ color: "#666", fontSize: "12px" }}>
            يجب أن تحتوي كلمة المرور على:
            حرف كبير + رقم + رمز + 8 أحرف على الأقل
          </small>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="primary">
            سجل الآن
          </button>
        </form>

        <p>لديك حساب بالفعل؟</p>

        <button type="button" className="secondary" onClick={() => navigate("/login", { replace: true })}
>
          تسجيل دخول
        </button>

      </div>
    </div>
  );
}

export default Register;

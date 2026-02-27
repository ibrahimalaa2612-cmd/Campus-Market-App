/*
import React, { useState } from 'react';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import './Auth.css';

function Login({ onSwitch, onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (onSuccess) onSuccess();
    } catch {
      setError("خطأ في الإيميل أو كلمة السر");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Campus Market</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="الإيميل الجامعي" onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="كلمة السر" onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="primary">دخول</button>
        </form>
        <p>ليس لديك حساب؟</p>
        <button type="button" className="secondary" onClick={onSwitch}>إنشاء حساب جديد</button>
        {error && <p className="error-msg">{error}</p>}
      </div>
    </div>
  );
}

export default Login;*/

import React, { useState } from 'react';
import { auth, db } from '../../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import './Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      const profileRef = doc(db, "userProfiles", userCredential.user.uid);
      const profileSnap = await getDoc(profileRef);

      if (!profileSnap.exists()) {
        navigate("/complete-profile");
      } else {
        navigate("/home");
      }

    } catch {
      setError("خطأ في الإيميل أو كلمة السر");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Campus Market</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="الإيميل الجامعي"
            onChange={e => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="كلمة السر"
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="primary">
            دخول
          </button>
        </form>

        <p>ليس لديك حساب؟</p>

        {/* 🔥 ده التعديل المهم */}
        <button
          type="button"
          className="secondary"
          onClick={() => navigate("/register")}
        >
          إنشاء حساب جديد
        </button>

        {error && <p className="error-msg">{error}</p>}
      </div>
    </div>
  );
}

export default Login;
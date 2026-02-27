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

export default Login;
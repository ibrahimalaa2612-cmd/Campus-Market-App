import React, { useState } from 'react';
import { auth } from './firebaseConfig';
import { signInWithEmailAndPassword } from "firebase/auth";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("تم تسجيل الدخول بنجاح!");
      // هنا ممكن تنقله لصفحة الـ Home
    } catch (err) {
      setError("خطأ في الإيميل أو كلمة السر");
    }
  };

  return (
  <div className="login-container">
    <h2>Campus Market</h2>
    <form onSubmit={handleLogin}>
      <input 
        type="email" 
        placeholder="الإيميل الجامعي" 
        onChange={(e) => setEmail(e.target.value)} 
        required 
      />
      <input 
        type="password" 
        placeholder="كلمة السر" 
        onChange={(e) => setPassword(e.target.value)} 
        required 
      />
      <button type="submit">دخول</button>
    </form>
    {error && <p className="error-msg">{error}</p>}
  </div>
);
}

export default Login;
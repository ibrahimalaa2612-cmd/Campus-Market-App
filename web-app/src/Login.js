import React, { useState } from 'react';
import { auth } from './firebase'; // التعديل هنا: اسم ملفك firebase.js
import { signInWithEmailAndPassword } from "firebase/auth";

function Login(props) { // لازم (props) هنا عشان التبديل يشتغل
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("تم تسجيل الدخول بنجاح!");
    } catch (err) {
      setError("خطأ في الإيميل أو كلمة السر");
    }
  };

  return (
    <div className="login-container" style={{ textAlign: 'center', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', width: '350px' }}>
      <h2>Campus Market</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="الإيميل الجامعي" onChange={(e) => setEmail(e.target.value)} required style={{ width: '90%', padding: '10px', marginBottom: '10px' }} />
        <input type="password" placeholder="كلمة السر" onChange={(e) => setPassword(e.target.value)} required style={{ width: '90%', padding: '10px', marginBottom: '10px' }} />
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#1877f2', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>دخول</button>
      </form>
      <hr style={{ margin: '20px 0' }} />
      <p>ليس لديك حساب؟</p>
      <button type="button" onClick={props.onSwitch} style={{ backgroundColor: '#42b72a', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
        إنشاء حساب جديد
      </button>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
}

export default Login;
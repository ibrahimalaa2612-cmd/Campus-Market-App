import React, { useState } from 'react';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import './Auth.css';

function Register({ onBack, onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email,
        createdAt: new Date()
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>إنشاء حساب جديد</h2>
        <form onSubmit={handleRegister}>
          <input type="text" placeholder="الاسم الكامل" onChange={e => setName(e.target.value)} required />
          <input type="email" placeholder="الإيميل الجامعي" onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="كلمة السر" onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="primary">سجل الآن</button>
        </form>
        <p>لديك حساب بالفعل؟</p>
        <button type="button" className="secondary" onClick={onBack}>تسجيل دخول</button>
      </div>
    </div>
  );
}

export default Register;
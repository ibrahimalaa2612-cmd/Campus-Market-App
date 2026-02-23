import React, { useState } from 'react';
import { auth, db } from './firebase'; // التعديل هنا: اسم ملفك firebase.js
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

function Register(props) { // لازم (props) هنا
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name, email, createdAt: new Date()
      });
      alert("تم إنشاء الحساب بنجاح!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="register-container" style={{ textAlign: 'center', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', width: '350px' }}>
      <h2>إنشاء حساب جديد</h2>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="الاسم الكامل" onChange={(e) => setName(e.target.value)} required style={{ width: '90%', padding: '10px', marginBottom: '10px' }} />
        <input type="email" placeholder="الإيميل" onChange={(e) => setEmail(e.target.value)} required style={{ width: '90%', padding: '10px', marginBottom: '10px' }} />
        <input type="password" placeholder="الباسورد" onChange={(e) => setPassword(e.target.value)} required style={{ width: '90%', padding: '10px', marginBottom: '10px' }} />
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#42b72a', color: 'white', border: 'none', borderRadius: '6px' }}>سجل الآن</button>
      </form>
      <hr style={{ margin: '20px 0' }} />
      <button type="button" onClick={props.onBack} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}>
        لديك حساب بالفعل؟ سجل دخولك
      </button>
    </div>
  );
}

export default Register;
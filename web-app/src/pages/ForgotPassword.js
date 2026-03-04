import React, { useState } from 'react';
import { sendPasswordResetEmail } from "firebase/auth";
import { Link } from 'react-router-dom';
import { auth } from "../firebase/firebase";
import "../styles/Auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('تم إرسال الرابط. تفقد صندوق الوارد أو الـ Spam.');
      setError('');
    } catch (err) {
      setError('حدث خطأ: تأكد أن البريد مسجل لدينا.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>استرجاع كلمة المرور</h2>
        
        {message && <p style={{ color: '#2ecc71', marginBottom: '15px', textAlign: 'center' }}>{message}</p>}
        {error && <p className="error-msg" style={{ marginBottom: '15px', textAlign: 'center' }}>{error}</p>}
        
        <form onSubmit={handleReset}>
          <input 
            type="email" 
            placeholder="أدخل بريدك الجامعي" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <button type="submit" className="primary">إرسال الرابط</button>
        </form>
        
        <p style={{ marginTop: "20px", textAlign: "center" }}>
          <Link to="/login" style={{ textDecoration: "none" }}>تذكرت كلمة السر؟ سجل دخول</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
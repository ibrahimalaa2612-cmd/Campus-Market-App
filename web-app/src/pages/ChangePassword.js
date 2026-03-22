import React, { useState } from 'react';
import { updatePassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import "../styles/Auth.css"; 

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      return setError('كلمتا المرور غير متطابقتين!');
    }

    if (newPassword.length < 6) {
      return setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل.');
    }

    const user = auth.currentUser;

    if (user) {
      try {
        await updatePassword(user, newPassword);
        setMessage('تم تحديث كلمة المرور بنجاح!');
        setNewPassword('');
        setConfirmPassword('');
      } catch (err) {
        if (err.code === 'auth/requires-recent-login') {
          setError('لأسباب أمنية، يرجى تسجيل الخروج والدخول مرة أخرى لتتمكن من تغيير كلمة المرور.');
        } else {
          setError('حدث خطأ أثناء تغيير كلمة المرور.');
          console.error(err);
        }
      }
    } else {
      setError('لا يوجد مستخدم مسجل الدخول حالياً.');
    }
  };

  return (
    <div className="auth-card" style={{ marginTop: '20px', padding: '20px' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>تغيير كلمة المرور</h3>
      
      {message && <p style={{ color: '#2ecc71', marginBottom: '10px', textAlign: 'center' }}>{message}</p>}
      {error && <p className="error-msg" style={{ marginBottom: '10px', textAlign: 'center' }}>{error}</p>}
      
      <form onSubmit={handleChangePassword}>
        <input 
          type="password" 
          placeholder="كلمة المرور الجديدة" 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)} 
          required 
          style={{ marginBottom: '10px' }}
        />
        <input 
          type="password" 
          placeholder="تأكيد كلمة المرور الجديدة" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          required 
          style={{ marginBottom: '15px' }}
        />
        <button type="submit" className="primary">حفظ كلمة المرور</button>
      </form>
    </div>
  );
};

export default ChangePassword;
import { useState } from "react";
import { auth, db } from "../firebase/firebase"; 
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const adminDoc = await getDoc(doc(db, "admins", user.email));

      if (adminDoc.exists() && adminDoc.data().role === "admin") {
        alert("مرحباً بك أيها المسؤول");
        navigate("/admin/dashboard"); 
      } else {
        await auth.signOut();
        alert("هذا الحساب ليس له صلاحيات دخول للإدارة");
        navigate("/login");
      }
    } catch (error) {
      alert("خطأ في البريد الإلكتروني أو كلمة المرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "50px", textAlign: "center", color: "#fff", direction: "rtl" }}>
      <h2>تسجيل دخول لوحة التحكم</h2>
      <form onSubmit={handleLogin} style={{ marginTop: "20px" }}>
        <input 
          type="email" 
          placeholder="بريد الأدمن" 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          style={{ display: "block", margin: "10px auto", padding: "12px", width: "300px", borderRadius: "5px" }}
          required
        />
        <input 
          type="password" 
          placeholder="كلمة المرور" 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          style={{ display: "block", margin: "10px auto", padding: "12px", width: "300px", borderRadius: "5px" }}
          required
        />
        <button 
          type="submit" 
          disabled={loading} 
          style={{ padding: "12px 40px", backgroundColor: "#2ecc71", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
        >
          {loading ? "جاري التحقق..." : "دخول الإدارة"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
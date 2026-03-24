import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import "../styles/Navbar.css";

export default function Navbar() {
  const { user, role, loading } = useAuth(); // 👈 خدنا role هنا
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [profileImage, setProfileImage] = useState("/avatar-placeholder.png");

  // جلب صورة البروفايل من Firestore
  useEffect(() => {
    if (!user) return;

    const fetchProfileImage = async () => {
      try {
        const docRef = doc(db, "userProfiles", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileImage(data.imageUrl || "/avatar-placeholder.png");
        }
      } catch (err) {
        console.error("Error fetching profile image:", err);
      }
    };

    fetchProfileImage();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  // غلق dropdown عند الضغط خارجه
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) return null;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img
            src="/logo-campus-market.png"
            alt="Campus Market Logo"
            className="logo-img"
          />
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">الرئيسية</Link>

          {user ? (
            <>
            
              {/* يظهر بس للـ admin 

              {role === "admin" && (
                <Link to="/dashboard" className="nav-link">لوحة التحكم</Link>
              )}
                
                */}

              <Link to="/sell" className="nav-link">بيع منتج</Link>
              <Link to="/myProducts" className="nav-link">منتجاتي</Link>

              <div className="profile-dropdown" ref={dropdownRef}>
                <img
                  src={profileImage}
                  alt="Profile"
                  className="profile-img"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                />

                <div className={`dropdown-menu ${dropdownOpen ? "open" : ""}`}>
                  <Link to="/profile" className="dropdown-item">الملف الشخصي</Link>

                  {/* Dashboard جوه dropdown */}
                  {role === "admin" && (
                    <Link to="/dashboard" className="dropdown-item">لوحة التحكم</Link>
                  )}

                  <Link to="/settings" className="dropdown-item">الإعدادات</Link>

                  <button
                    className="dropdown-item logout-btn"
                    onClick={handleLogout}
                  >
                    تسجيل الخروج
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">تسجيل الدخول</Link>
              <Link to="/register" className="nav-link">إنشاء حساب</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
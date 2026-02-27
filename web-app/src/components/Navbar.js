import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import "../styles/Navbar.css";

export default function Navbar() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

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
              <Link to="/sell" className="nav-link">بيع منتج</Link>
              <Link to="/orders" className="nav-link">الطلبات</Link>
              <Link to="/cart" className="nav-link">سلة المشتريات</Link>

              <div className="profile-dropdown" ref={dropdownRef}>
                <img
                  src={user.photoURL || "/avatar-placeholder.png"}
                  alt="Profile"
                  className="profile-img"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                />
                <div className={`dropdown-menu ${dropdownOpen ? "open" : ""}`}>
                  <Link to="/profile" className="dropdown-item">الملف الشخصي</Link>
                  <Link to="/settings" className="dropdown-item">الإعدادات</Link>
                  <button className="dropdown-item logout-btn" onClick={handleLogout}>
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
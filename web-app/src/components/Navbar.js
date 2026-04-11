import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import "../styles/Navbar.css";

export default function Navbar() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [profileImage, setProfileImage] = useState("/avatar-placeholder.png");

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(items);
    };

    fetchProducts();
  }, []);

  /* ================= PROFILE IMAGE ================= */
  useEffect(() => {
    if (!user) return;

    const fetchProfileImage = async () => {
      const docRef = doc(db, "userProfiles", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProfileImage(docSnap.data().imageUrl || "/avatar-placeholder.png");
      }
    };

    fetchProfileImage();
  }, [user]);

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  /* ================= OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= SEARCH ================= */
  const suggestions = useMemo(() => {
    if (!search.trim()) return [];

    return products
      .filter((p) =>
        p.name?.toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, 5); // limit 5 results
  }, [search, products]);

  const handleSearchEnter = (e) => {
    if (e.key === "Enter") {
      navigate(`/?search=${search}`);
      setShowSuggestions(false);
    }
  };

  if (loading) return null;

  return (
    <nav className="navbar">
      <div className="navbar-inner">

        {/* LOGO */}
        <Link to="/" className="logo">
          <img src="/logo-campus-market.png" alt="logo" />
        </Link>

        {/* SEARCH */}
        <div className="search-wrapper">

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={handleSearchEnter}
            onFocus={() => setShowSuggestions(true)}
          />

          {/* SUGGESTIONS */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions">
              {suggestions.map((item) => (
                <div
                  key={item.id}
                  className="suggestion-item"
                  onClick={() => {
                    navigate(`/product/${item.id}`);
                    setSearch("");
                    setShowSuggestions(false);
                  }}
                >
                  {item.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* LINKS */}
        <div className="nav-links">
          <Link to="/" className="link">Home</Link>

          {user && (
            <Link to="/myProducts" className="link">
              My Ads
            </Link>
          )}
        </div>

        {/* ACTIONS */}
        <div className="actions">

          {user && (
            <Link to="/sell" className="sell-btn">
              + Sell
            </Link>
          )}

          {!user ? (
            <>
              <Link to="/login" className="link">Login</Link>
              <Link to="/register" className="link primary">
                Sign Up
              </Link>
            </>
          ) : (
            <div className="profile" ref={dropdownRef}>
              <img
                src={profileImage}
                className="avatar"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />

              <div className={`dropdown ${dropdownOpen ? "open" : ""}`}>
                <Link to="/profile">Profile</Link>

                {role === "admin" && (
                  <Link to="/dashboard">Dashboard</Link>
                )}

                <Link to="/settings">Settings</Link>

                <button onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
}
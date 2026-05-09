import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getSellerReviews } from "../utils/reviewService";
import { formatDate } from "../utils/formatDate";
import "../styles/SellerProfile.css";

function StarRating({ value, readonly = true }) {
  return (
    <div className="sp-stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={`sp-star ${s <= value ? "filled" : ""}`}>★</span>
      ))}
    </div>
  );
}

export default function SellerProfile() {
  const { sellerId } = useParams();
  const navigate = useNavigate();

  const [seller, setSeller] = useState(null);
  const [activeProducts, setActiveProducts] = useState([]);
  const [soldProducts, setSoldProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [tab, setTab] = useState("active"); // active | sold | reviews
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // بيانات البائع
        const sellerSnap = await getDoc(doc(db, "userProfiles", sellerId));
        if (sellerSnap.exists()) setSeller(sellerSnap.data());

        // منتجاته
        const q = query(
          collection(db, "products"),
          where("sellerId", "==", sellerId),
          where("status", "==", "approved")
        );
        const snap = await getDocs(q);
        const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setActiveProducts(all.filter((p) => !p.sold));
        setSoldProducts(all.filter((p) => p.sold));

        // تقييماته
        const revs = await getSellerReviews(sellerId);
        setReviews(revs);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    load();
  }, [sellerId]);

  if (loading) return <div className="sp-loading">Loading...</div>;
  if (!seller) return <div className="sp-loading">البائع غير موجود</div>;

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const currentProducts = tab === "active" ? activeProducts : tab === "sold" ? soldProducts : [];

  return (
    <div className="sp-page">
      {/* HEADER */}
      <div className="sp-header">
        <img
          src={seller.imageUrl || "https://i.postimg.cc/FKMdfByG/download.jpg"}
          className="sp-avatar"
          alt="seller"
        />
        <div className="sp-info">
          <h1 className="sp-name">{seller.fullName}</h1>
          <p className="sp-meta">🏫 {seller.university || "—"}</p>
          <p className="sp-meta">📅 عضو منذ {formatDate(seller.createdAt)}</p>
          {avgRating && (
            <div className="sp-rating-row">
              <StarRating value={Math.round(avgRating)} />
              <span className="sp-rating-text">{avgRating} ({reviews.length} تقييم)</span>
            </div>
          )}
          <div className="sp-stats">
            <div className="sp-stat">
              <span className="sp-stat-num">{activeProducts.length}</span>
              <span className="sp-stat-label">معروض</span>
            </div>
            <div className="sp-stat">
              <span className="sp-stat-num">{soldProducts.length}</span>
              <span className="sp-stat-label">تم البيع</span>
            </div>
            <div className="sp-stat">
              <span className="sp-stat-num">{reviews.length}</span>
              <span className="sp-stat-label">تقييم</span>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="sp-tabs">
        <button className={`sp-tab ${tab === "active" ? "active" : ""}`} onClick={() => setTab("active")}>
          المنتجات المعروضة ({activeProducts.length})
        </button>
        <button className={`sp-tab ${tab === "sold" ? "active" : ""}`} onClick={() => setTab("sold")}>
          تم بيعها ({soldProducts.length})
        </button>
        <button className={`sp-tab ${tab === "reviews" ? "active" : ""}`} onClick={() => setTab("reviews")}>
          التقييمات ({reviews.length})
        </button>
      </div>

      {/* CONTENT */}
      {tab !== "reviews" ? (
        currentProducts.length === 0 ? (
          <p className="sp-empty">لا يوجد منتجات</p>
        ) : (
          <div className="sp-grid">
            {currentProducts.map((p) => (
              <div key={p.id} className="sp-card" onClick={() => navigate(`/product/${p.id}`)}>
                <div className="sp-card-img-wrap">
                  <img src={p.image || p.images?.[0]} alt={p.name} />
                  {p.sold && <span className="sp-sold-badge">تم البيع</span>}
                </div>
                <div className="sp-card-body">
                  <h3>{p.name}</h3>
                  <p>{p.price} EGP</p>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="sp-reviews">
          {reviews.length === 0 && <p className="sp-empty">لا يوجد تقييمات بعد</p>}
          {reviews.map((r) => (
            <div key={r.id} className="sp-review-item">
              <img
                src={r.userImage || "https://i.postimg.cc/FKMdfByG/download.jpg"}
                className="sp-review-avatar"
                alt="user"
              />
              <div>
                <div className="sp-review-header">
                  <span className="sp-review-name">{r.userName}</span>
                  <StarRating value={r.rating} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

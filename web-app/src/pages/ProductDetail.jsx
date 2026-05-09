import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { formatDate } from "../utils/formatDate";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { addProductReview, getProductReviews, addSellerReview, getSellerReviews } from "../utils/reviewService";
import "../styles/ProductDetail.css";

function StarRating({ value, onChange, readonly = false }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="stars-row">
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className={`star ${s <= (hovered || value) ? "filled" : ""} ${readonly ? "readonly" : ""}`}
          onClick={() => !readonly && onChange && onChange(s)}
          onMouseEnter={() => !readonly && setHovered(s)}
          onMouseLeave={() => !readonly && setHovered(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

const DEFAULT_IMAGE = "https://i.postimg.cc/FKMdfByG/download.jpg";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { cart, addToCart } = useCart();

  // هل المنتج موجود في السلة؟
  const isInCart = cart?.some((item) => item.id === id);

  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [sellerId, setSellerId] = useState(null);
  const [showPhone, setShowPhone] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const [productReviews, setProductReviews] = useState([]);
  const [productRating, setProductRating] = useState(0);
  const [productComment, setProductComment] = useState("");
  const [productReviewError, setProductReviewError] = useState("");
  const [productReviewLoading, setProductReviewLoading] = useState(false);

  const [sellerReviews, setSellerReviews] = useState([]);
  const [sellerRating, setSellerRating] = useState(0);
  const [sellerReviewError, setSellerReviewError] = useState("");
  const [sellerReviewLoading, setSellerReviewLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const snap = await getDoc(doc(db, "products", id));
      if (!snap.exists()) return;
      const data = { ...snap.data(), id: snap.id };
      setProduct(data);
      if (data.sellerId) {
        setSellerId(data.sellerId);
        const sellerSnap = await getDoc(doc(db, "userProfiles", data.sellerId));
        if (sellerSnap.exists()) setSeller(sellerSnap.data());
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    getProductReviews(id).then(setProductReviews);
  }, [id]);

  useEffect(() => {
    if (!sellerId) return;
    getSellerReviews(sellerId).then(setSellerReviews);
  }, [sellerId]);

  const avgProductRating = productReviews.length
    ? (productReviews.reduce((s, r) => s + r.rating, 0) / productReviews.length).toFixed(1)
    : null;

  const avgSellerRating = sellerReviews.length
    ? (sellerReviews.reduce((s, r) => s + r.rating, 0) / sellerReviews.length).toFixed(1)
    : null;

  const handleAddToCart = () => {
    if (isInCart) return;
    addToCart({
      id: id,
      name: product.name || product.title || "منتج",
      price: product.price || 0,
      image: product.images?.[0] || product.image || "",
      sellerName: seller?.fullName || "Unknown",
      category: product.category || "",
      condition: product.condition || "",
    });
  };

  const handleProductReview = async () => {
    setProductReviewError("");
    if (!currentUser) return setProductReviewError("يجب تسجيل الدخول أولاً");
    if (!productRating) return setProductReviewError("اختر عدد النجوم");
    if (!productComment.trim()) return setProductReviewError("اكتب تعليقاً");
    setProductReviewLoading(true);
    try {
      const userProfile = await getDoc(doc(db, "userProfiles", currentUser.uid));
      const fullName = userProfile?.data()?.fullName || currentUser.displayName || "مستخدم";
      await addProductReview({
        productId: id,
        userId: currentUser.uid,
        userName: fullName,
        userImage: currentUser.photoURL || "",
        rating: productRating,
        comment: productComment.trim(),
      });
      const updated = await getProductReviews(id);
      setProductReviews(updated);
      setProductRating(0);
      setProductComment("");
    } catch (e) {
      setProductReviewError(e.message);
    }
    setProductReviewLoading(false);
  };

  const handleSellerReview = async () => {
    setSellerReviewError("");
    if (!currentUser) return setSellerReviewError("يجب تسجيل الدخول أولاً");
    if (currentUser.uid === sellerId) return setSellerReviewError("لا يمكنك تقييم نفسك");
    if (!sellerRating) return setSellerReviewError("اختر عدد النجوم");
    setSellerReviewLoading(true);
    try {
      const userProfile = await getDoc(doc(db, "userProfiles", currentUser.uid));
      const fullName = userProfile?.data()?.fullName || currentUser.displayName || "مستخدم";
      await addSellerReview({
        sellerId,
        userId: currentUser.uid,
        userName: fullName,
        userImage: currentUser.photoURL || "",
        rating: sellerRating,
      });
      const updated = await getSellerReviews(sellerId);
      setSellerReviews(updated);
      setSellerRating(0);
    } catch (e) {
      setSellerReviewError(e.message);
    }
    setSellerReviewLoading(false);
  };

  if (!product) return <div className="loading">Loading...</div>;

  const images = product.images?.length > 0 ? product.images : product.image ? [product.image] : [];
  const nextImage = () => setCurrentImage((p) => (p === images.length - 1 ? 0 : p + 1));
  const prevImage = () => setCurrentImage((p) => (p === 0 ? images.length - 1 : p - 1));

  return (
    <div className="page">
      <div className="left">
        <div className="box image-box">
          {images.length > 0 ? (
            <>
              <img src={images[currentImage]} className="main-img" alt="product" />
              {images.length > 1 && (
                <>
                  <button className="img-btn left" onClick={prevImage}>❮</button>
                  <button className="img-btn right" onClick={nextImage}>❯</button>
                  <div className="dots">
                    {images.map((_, i) => (
                      <span key={i} className={i === currentImage ? "dot active" : "dot"} onClick={() => setCurrentImage(i)} />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <img src={DEFAULT_IMAGE} className="main-img" alt="default" />
          )}
        </div>

        <div className="box">
          <h1 className="price-inline">{product.price} EGP</h1>
          <h2>{product.name}</h2>
          {avgProductRating && (
            <div className="avg-rating-row">
              <StarRating value={Math.round(avgProductRating)} readonly />
              <span className="avg-rating-text">{avgProductRating} ({productReviews.length} تقييم)</span>
            </div>
          )}
          <div className="meta-line">
            <span>📅 {formatDate(product.createdAt)}</span>
            <span>🏫 {seller?.university || "—"}</span>
          </div>
          <div className="meta-tags">
            <span>{product.category}</span>
            <span>{product.condition}</span>
          </div>
        </div>

        <div className="box">
          <h3>الوصف</h3>
          <p>{product.description}</p>
        </div>

        <div className="box">
          <h3 className="review-title">تقييمات المنتج</h3>
          {currentUser && currentUser.uid !== sellerId && (
            <div className="review-form">
              <StarRating value={productRating} onChange={setProductRating} />
              <textarea
                className="review-textarea"
                placeholder="اكتب تعليقك على المنتج..."
                value={productComment}
                onChange={(e) => setProductComment(e.target.value)}
                rows={3}
                dir="rtl"
              />
              {productReviewError && <p className="review-error">{productReviewError}</p>}
              <button className="review-btn" onClick={handleProductReview} disabled={productReviewLoading}>
                {productReviewLoading ? "جاري الإرسال..." : "إرسال التقييم"}
              </button>
            </div>
          )}

          <div className="reviews-list">
            {productReviews.length === 0 && <p className="no-reviews">لا يوجد تقييمات بعد</p>}
            {productReviews.map((r) => (
              <div key={r.id} className="review-item">
                <img
                  src={r.userImage || DEFAULT_IMAGE}
                  className="review-avatar"
                  alt="user"
                  onError={(e) => (e.target.src = DEFAULT_IMAGE)}
                />
                <div className="review-content">
                  <div className="review-header">
                    <span className="review-name">{r.userName}</span>
                    <StarRating value={r.rating} readonly />
                  </div>
                  <p className="review-comment">{r.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="right">
        <div className="box seller-box">
          <img
            src={seller?.imageUrl || DEFAULT_IMAGE}
            className="seller-img"
            alt="seller"
            onClick={() => sellerId && navigate(`/seller/${sellerId}`)}
            style={{ cursor: "pointer" }}
            onError={(e) => (e.target.src = DEFAULT_IMAGE)}
          />
          <h3>{seller?.fullName}</h3>
          <p className="muted">عضو منذ {formatDate(seller?.createdAt)}</p>

          {avgSellerRating && (
            <div className="avg-rating-row centered">
              <StarRating value={Math.round(avgSellerRating)} readonly />
              <span className="avg-rating-text">{avgSellerRating} ({sellerReviews.length})</span>
            </div>
          )}

          {!product.sold ? (
            <>
              {currentUser?.uid !== sellerId && (
                <button
                  className={`add-to-cart-btn ${isInCart ? "added" : ""}`}
                  onClick={handleAddToCart}
                  disabled={isInCart}
                >
                  {isInCart ? "✓ في السلة" : "🛒 إضافة للسلة"}
                </button>
              )}
              <button className="phone-btn" onClick={() => setShowPhone(!showPhone)}>
                {showPhone ? seller?.phone : "إظهار رقم الهاتف"}
              </button>
            </>
          ) : (
            <p className="sold">تم البيع</p>
          )}

          {currentUser && currentUser.uid !== sellerId && (
            <div className="seller-rate-box">
              <p className="seller-rate-label">قيّم البائع</p>
              <StarRating value={sellerRating} onChange={setSellerRating} />
              {sellerReviewError && <p className="review-error">{sellerReviewError}</p>}
              <button className="review-btn" onClick={handleSellerReview} disabled={sellerReviewLoading}>
                {sellerReviewLoading ? "جاري الإرسال..." : "إرسال"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

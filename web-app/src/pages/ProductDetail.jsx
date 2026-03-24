import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import "../styles/ProductDetail.css";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [showPhone, setShowPhone] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setProduct(docSnap.data());
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div className="product-page-container">جاري تحميل المنتج...</div>;

  const images = product.images || [product.image];

  const getTimeSince = () => {
    if (!product.createdAt) return "";
    const now = new Date();
    const created = product.createdAt.toDate();
    const diff = Math.floor((now - created) / 1000);
    if (diff < 60) return `${diff} ثانية مضت`;
    if (diff < 3600) return `${Math.floor(diff / 60)} دقيقة مضت`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ساعة مضت`;
    return `${Math.floor(diff / 86400)} يوم مضت`;
  };

  return (
    <div className="product-page-container">

      {/* Top Section */}
      <div className="top-section">
        {/* Left: Images */}
        <div className="image-section">
          <img src={images[currentImage]} alt={`صورة ${currentImage + 1}`} className="main-image" />
          {images.length > 1 && (
            <div className="thumbnail-section">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`thumb ${idx}`}
                  className={`thumbnail ${currentImage === idx ? "active" : ""}`}
                  onClick={() => setCurrentImage(idx)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="product-info">
          <h2 className="product-name">{product.name}</h2>

          {/* Sold Badge */}
          {product.sold === true && <span className="sold-badge">تم البيع</span>}

          <p className="price">السعر: {product.price} EGP</p>

          {/* Seller Info */}
          {product.sellerName && (
            <p className="seller-name">
              البائع:{" "}
              <span
                className="seller-link"
                onClick={() => window.location.href = `/seller/${product.sellerId || product.sellerEmail}`}
              >
                {product.sellerName}
              </span>
            </p>
          )}
          {/* University */}
          {product.sellerUniversity && (
            <p className="seller-university">
              الجامعة: {product.sellerUniversity}
            </p>
          )}

          {product.condition && <p className="condition">الحالة: {product.condition}</p>}
          {product.category && <p className="category">التصنيف: {product.category}</p>}
          {product.createdAt && <p className="posted-time">منذ: {getTimeSince()}</p>}

          {product.sellerPhone && product.sold !== true && (
            <button className="btn phone-btn" onClick={() => setShowPhone(!showPhone)}>
              {showPhone ? product.sellerPhone : "إظهار رقم الهاتف"}
            </button>
          )}
          {product.sold === true && <p className="sold-text">هذا المنتج تم بيعه ولا يمكن التواصل مع البائع</p>}
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="description-section">
          <h3>وصف المنتج</h3>
          <p>{product.description}</p>
        </div>
      )}
    </div>
  );
}
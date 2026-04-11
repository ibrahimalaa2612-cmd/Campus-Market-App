import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { formatDate } from "../utils/formatDate";
import "../styles/ProductDetail.css";

export default function ProductPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [showPhone, setShowPhone] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      const snap = await getDoc(doc(db, "products", id));

      if (!snap.exists()) return;

      const data = snap.data();
      setProduct(data);

      if (data.sellerId) {
        const sellerSnap = await getDoc(
          doc(db, "userProfiles", data.sellerId)
        );

        if (sellerSnap.exists()) {
          setSeller(sellerSnap.data());
        }
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <div className="loading">Loading...</div>;

  // الصور
  const images =
    product.images?.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : [];

  const nextImage = () => {
    setCurrentImage((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div className="page">

      {/* LEFT */}
      <div className="left">

        {/* IMAGE SLIDER */}
        <div className="box image-box">

          {images.length > 0 ? (
            <>
              <img
                src={images[currentImage]}
                className="main-img"
                alt="product"
              />

              {images.length > 1 && (
                <>
                  <button
                    className="img-btn left"
                    onClick={prevImage}
                    aria-label="Previous image"
                  >
                    ❮
                  </button>

                  <button
                    className="img-btn right"
                    onClick={nextImage}
                    aria-label="Next image"
                  >
                    ❯
                  </button>

                  <div className="dots">
                    {images.map((_, i) => (
                      <span
                        key={i}
                        className={i === currentImage ? "dot active" : "dot"}
                        onClick={() => setCurrentImage(i)}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <img
              src="https://i.postimg.cc/FKMdfByG/download.jpg"
              className="main-img"
              alt="default"
            />
          )}
        </div>

        {/* INFO */}
        <div className="box">
          <h1 className="price-inline">{product.price} EGP</h1>
          <h2>{product.name}</h2>

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

      </div>

      {/* RIGHT */}
      <div className="right">

        <div className="box seller-box">

          <img
            src={seller?.imageUrl}
            className="seller-img"
            alt="seller"
          />

          <h3>{seller?.fullName}</h3>

          <p className="muted">
            عضو منذ {formatDate(seller?.createdAt)}
          </p>

          {!product.sold ? (
            <button
              className="phone-btn"
              onClick={() => setShowPhone(!showPhone)}
            >
              {showPhone ? seller?.phone : "إظهار رقم الهاتف"}
            </button>
          ) : (
            <p className="sold">تم البيع</p>
          )}

        </div>

      </div>
    </div>
  );
}
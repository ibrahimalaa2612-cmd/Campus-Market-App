import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import "../styles/SellerProducts.css";

export default function SellerProducts() {
  const { sellerId } = useParams();
  const [products, setProducts] = useState([]);
  const [sellerName, setSellerName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, "products"), where("sellerId", "==", sellerId));
        const querySnapshot = await getDocs(q);
        const sellerProducts = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(product => product.status === "approved");

        setProducts(sellerProducts);

        if (sellerProducts.length > 0) {
          setSellerName(sellerProducts[0].sellerName || sellerProducts[0].sellerEmail || "البائع");
        }
      } catch (err) {
        console.error("Error fetching seller products:", err);
      }
    };
    fetchProducts();
  }, [sellerId]);

  if (!products.length)
    return (
      <div className="product-page-container">
        <h2 className="product-name">
          منتجات البائع {sellerName && `(${sellerName})`}
        </h2>
        <p>لا يوجد منتجات للبائع.</p>
      </div>
    );

  return (
    <div className="product-page-container">
      <h2 className="product-name">
        منتجات البائع {sellerName && `(${sellerName})`}
      </h2>

      <div className="seller-products-grid">
        {products.map(product => (
          <div
            key={product.id}
            className="seller-product-card"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <div className="image-wrapper">
              <img src={product.image || product.images?.[0]} alt={product.name} />
              {product.sold === true && <span className="sold-badge-card">تم البيع</span>}
            </div>
            <h3>{product.name}</h3>
            <p>السعر: {product.price} EGP</p>
          </div>
        ))}
      </div>
    </div>
  );
}
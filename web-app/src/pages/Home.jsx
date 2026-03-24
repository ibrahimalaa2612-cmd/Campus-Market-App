import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const navigate = useNavigate();

const categories = [
  "كل التصنيفات",
  "كتب و مراجع",
  "أجهزة إلكترونية",
  "ملابس و إكسسوارات",
  "أدوات مدرسية",
  "أدوات منزلية صغيرة",
  "مستلزمات رياضية",
  "معدات كمبيوتر",
  "أجهزة منزلية",
  "خدمات",
  "أخرى"
];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));
        let items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // approved only
        items = items.filter(item => item.status === "approved");

        // search
        if (search) {
          items = items.filter(item =>
            item.name?.toLowerCase().includes(search.toLowerCase())
          );
        }

        // category
        if (category && category !== "كل التصنيفات") {
          items = items.filter(item => item.category === category);
        }

        // price
        if (minPrice) {
          items = items.filter(item => item.price >= Number(minPrice));
        }

        if (maxPrice) {
          items = items.filter(item => item.price <= Number(maxPrice));
        }

        setProducts(items);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, [search, category, minPrice, maxPrice]);

  return (
    <div className="home-container">
      <h2 className="home-title">Campus Market 🎉 أهلا بك</h2>

      {/* Filters */}
      <div className="filter-container">
        <input
          type="text"
          placeholder="ابحث عن منتج..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="السعر الأدنى"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="السعر الأعلى"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      {/* Products */}
      <div className="products-grid">
        {products.map(product => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <img src={product.image} alt={product.name} />

            <h3>{product.name}</h3>

            <p className="price">{product.price} EGP</p>

            {/* الحالة */}
            <p className="condition">{product.condition}</p>

            {/* البائع */}
            {product.sellerName && (
              <p className="seller">بائع: {product.sellerName}</p>
            )}

            {/* تم البيع */}
            {product.sold && (
              <span className="sold-badge">تم البيع</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
import { useEffect, useState, useMemo } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/Home.css";

const DEFAULT_IMAGE = "https://i.postimg.cc/FKMdfByG/download.jpg";

export default function Home() {
  const [products, setProducts] = useState([]);

  const [params] = useSearchParams();
  const urlSearch = params.get("search") || "";

  const [search, setSearch] = useState(urlSearch);
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const navigate = useNavigate();

  const categories = [
    "كل التصنيفات",

    "كتب و مراجع",
    "كتب دراسية",
    "كورسات و تدريب",
    "أدوات مدرسية",

    "أجهزة إلكترونية",
    "موبايلات و تابلت",
    "لابتوبات و كمبيوتر",
    "إكسسوارات إلكترونية",
    "مكونات كمبيوتر",
    "شاشات و أجهزة عرض",

    "ملابس و إكسسوارات",
    "ملابس رجالي",
    "ملابس حريمي",
    "أحذية",
    "حقائب و شنط",
    "ساعات و مجوهرات",

    "أدوات منزلية",
    "أثاث و ديكور",
    "أدوات مطبخ",
    "أجهزة منزلية",
    "تنظيف و مستلزمات منزل",

    "ألعاب فيديو",
    "رياضة و لياقة",
    "مستلزمات رياضية",

    "سيارات و موتوسيكلات",
    "قطع غيار",
    "إكسسوارات سيارات",

    "خدمات",
    "خدمات برمجة",
    "تصميم جرافيك",
    "تسويق إلكتروني",
    "خدمات تعليمية",

    "أخرى",
  ];

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

  /* ================= FIX SEARCH SYNC ================= */
  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  /* ================= FILTERING ================= */
  const filteredProducts = useMemo(() => {
    let items = [...products];

    items = items.filter((p) => p.status === "approved");

    if (search.trim()) {
      items = items.filter((p) =>
        p.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category && category !== "كل التصنيفات") {
      items = items.filter(
        (p) =>
          (p.category || "").trim().toLowerCase() ===
          category.trim().toLowerCase()
      );
    }

    if (minPrice !== "") {
      items = items.filter((p) => p.price >= Number(minPrice));
    }

    if (maxPrice !== "") {
      items = items.filter((p) => p.price <= Number(maxPrice));
    }

    return items;
  }, [products, search, category, minPrice, maxPrice]);

  return (
    <div className="home">

      {/* PAGE HEADER */}
      <div className="page-header">
        <h2>Latest Products</h2>
        <p>Discover what students are selling</p>
      </div>

      {/* LAYOUT */}
      <div className="layout">

        {/* FILTERS */}
        <aside className="sidebar">
          <h3>Filters</h3>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />

          <input
            type="number"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />

          <button
            className="clear-btn"
            onClick={() => {
              setCategory("");
              setMinPrice("");
              setMaxPrice("");
              setSearch("");
              navigate("/");
            }}
          >
            Clear Filters
          </button>
        </aside>

        {/* PRODUCTS GRID */}
        <section className="grid">
          {filteredProducts.length === 0 ? (
            <div className="empty">
              No products found 😢
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="card"
                onClick={() =>
                  navigate(`/product/${product.id}`)
                }
              >
                {product.sold && (
                  <span className="badge">SOLD</span>
                )}

                <img
                  src={product.image || DEFAULT_IMAGE}
                  alt={product.name}
                  onError={(e) =>
                    (e.target.src = DEFAULT_IMAGE)
                  }
                />

                <div className="card-body">
                  <h3>{product.name}</h3>

                  <p className="price">
                    {product.price} EGP
                  </p>

                  <p className="meta">
                    {product.sellerName}
                  </p>

                  <p className="meta">
                    {product.condition}
                  </p>
                </div>
              </div>
            ))
          )}
        </section>

      </div>
    </div>
  );
}
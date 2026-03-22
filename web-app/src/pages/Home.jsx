import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import "../styles/Home.css";

export default function Home() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null); // Popup state
  const [loadingCart, setLoadingCart] = useState(false);

  const categories = ["كل التصنيفات", "كتب", "أجهزة", "ملابس", "أدوات", "أخرى"];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));
        let items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        items = items.filter(item => item.status === "approved");

        if (search) items = items.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
        if (category && category !== "كل التصنيفات") items = items.filter(item => item.category === category);
        if (minPrice) items = items.filter(item => item.price >= Number(minPrice));
        if (maxPrice) items = items.filter(item => item.price <= Number(maxPrice));

        setProducts(items);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, [search, category, minPrice, maxPrice]);

  const handleAddToCart = async (product) => {
    if (!user) return alert("يرجى تسجيل الدخول لإضافة المنتجات للسلة");
    setLoadingCart(true);

    try {
      await addDoc(collection(db, "carts"), {
        productId: product.id,
        userId: user.uid,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        addedAt: serverTimestamp(),
      });

      alert("تمت إضافة المنتج للسلة بنجاح!");
      setSelectedProduct(null);
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("حدث خطأ أثناء إضافة المنتج للسلة");
    } finally {
      setLoadingCart(false);
    }
  };

  return (
    <div className="home-container">
      <h2 className="home-title">Campus Market 🎉 أهلا بك</h2>

      <div className="filter-container">
        <input
          type="text"
          placeholder="ابحث عن منتج..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
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

      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card" onClick={() => setSelectedProduct(product)}>
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p className="price">{product.price} EGP</p>
            {product.sellerName && <p className="seller">بائع: {product.sellerName}</p>}
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className="popup-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedProduct(null)}>×</button>
            <img src={selectedProduct.image} alt={selectedProduct.name} />
            <h3>{selectedProduct.name}</h3>
            <p className="price">{selectedProduct.price} EGP</p>
            {selectedProduct.sellerName && <p className="seller">بائع: {selectedProduct.sellerName}</p>}
            {selectedProduct.category && <p className="category">تصنيف: {selectedProduct.category}</p>}
            {selectedProduct.description && <p className="desc">{selectedProduct.description}</p>}

            <button
              className="add-cart-btn"
              onClick={() => handleAddToCart(selectedProduct)}
              disabled={loadingCart}
            >
              {loadingCart ? "جارٍ الإضافة..." : "أضف إلى السلة"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
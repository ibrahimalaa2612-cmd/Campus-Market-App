import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";
import "../../styles/AdminDashboard.css";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "products"));
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
        status: docSnap.data().status || "pending"
      }));
      setProducts(items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, "products", id), { status });
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("هل تريد حذف المنتج؟")) return;
    await deleteDoc(doc(db, "products", id));
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = products
    .filter((p) => (activeTab === "all" ? true : p.status === activeTab))
    .filter((p) =>
      p.name?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="dashboard-container">
      <h2>لوحة التحكم</h2>

      {/* Tabs */}
      <div className="tabs">
        {["pending", "approved", "rejected", "all"].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="بحث عن منتج..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {loading ? (
        <p>جاري التحميل...</p>
      ) : (
        <div className="products-grid">
          {filtered.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt="" />
              <h3>{product.name}</h3>
              <p>{product.price} EGP</p>
              <p>{product.category}</p>
              <p className={`status ${product.status}`}>
                {product.status}
              </p>

              <div className="actions">
                {product.status === "pending" && (
                  <>
                    <button onClick={() => updateStatus(product.id, "approved")}>
                      قبول
                    </button>
                    <button onClick={() => updateStatus(product.id, "rejected")}>
                      رفض
                    </button>
                  </>
                )}

                <button onClick={() => deleteProduct(product.id)}>
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import "../../styles/AdminDashboard.css";

const categories = ["All", "كتب", "أجهزة", "ملابس", "أدوات", "أخرى"];
const statuses = ["All", "pending", "approved", "rejected"];

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "products"));
      const items = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.name,
          price: data.price,
          image: data.image,
          description: data.description || "-",
          category: data.category || "-",
          condition: data.condition || "-",
          status: data.status || "pending",
          seller: data.sellerName || data.sellerEmail || "Unknown",
        };
      });
      setProducts(items);
      setFilteredProducts(items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, "products", id), { status });
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status } : p))
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let temp = [...products];
    if (categoryFilter !== "All") {
      temp = temp.filter((p) => p.category === categoryFilter);
    }
    if (statusFilter !== "All") {
      temp = temp.filter((p) => p.status === statusFilter);
    }
    setFilteredProducts(temp);
  }, [categoryFilter, statusFilter, products]);

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">لوحة تحكم المنتجات</h2>

      {/* Filters */}
      <div className="filters">
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          {statuses.map((st) => <option key={st} value={st}>{st}</option>)}
        </select>
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>جاري التحميل...</p>
      ) : (
        <table className="products-table">
          <thead>
            <tr>
              <th>الصورة</th>
              <th>الاسم</th>
              <th>السعر</th>
              <th>الوصف</th>
              <th>التصنيف</th>
              <th>الحالة</th>
              <th>البائع</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <img src={product.image} alt={product.name} className="product-image" />
                </td>
                <td>{product.name}</td>
                <td>{product.price} EGP</td>
                <td>{product.description}</td>
                <td>{product.category} - {product.condition}</td>
                <td>{product.status}</td>
                <td>{product.seller}</td>
                <td>
                  {product.status === "pending" && (
                    <>
                      <button
                        className="action-button approve"
                        onClick={() => updateStatus(product.id, "approved")}
                      >
                        ✅ قبول
                      </button>
                      <button
                        className="action-button reject"
                        onClick={() => updateStatus(product.id, "rejected")}
                      >
                        ❌ رفض
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
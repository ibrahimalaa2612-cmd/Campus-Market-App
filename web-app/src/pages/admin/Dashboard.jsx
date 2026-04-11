import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import "../../styles/AdminDashboard.css";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    setLoading(true);

    const snapshot = await getDocs(collection(db, "products"));

    const items = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      status: d.data().status || "pending",
    }));

    setProducts(items);
    setLoading(false);
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
    .filter((p) =>
      activeTab === "all" ? true : p.status === activeTab
    )
    .filter((p) =>
      p.name?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="admin">

      {/* HEADER */}
      <div className="admin-header">
        <h2>لوحة التحكم</h2>
        <p>إدارة المنتجات</p>
      </div>

      {/* TABS */}
      <div className="tabs">
        {["pending", "approved", "rejected", "all"].map(
          (tab) => (
            <button
              key={tab}
              className={
                activeTab === tab ? "active" : ""
              }
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {/* SEARCH */}
      <input
        className="search"
        placeholder="ابحث عن منتج..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* GRID */}
      {loading ? (
        <p className="empty">Loading...</p>
      ) : (
        <div className="grid">

          {filtered.map((product) => (
            <div
              key={product.id}
              className="card"
            >

              <img
                src={product.image}
                alt=""
              />

              <div className="card-body">

                <h3>{product.name}</h3>

                <p className="price">
                  {product.price} EGP
                </p>

                <span
                  className={`status ${product.status}`}
                >
                  {product.status}
                </span>

                <div className="actions">

                  {product.status === "pending" && (
                    <>
                      <button
                        className="btn green"
                        onClick={() =>
                          updateStatus(
                            product.id,
                            "approved"
                          )
                        }
                      >
                        قبول
                      </button>

                      <button
                        className="btn red"
                        onClick={() =>
                          updateStatus(
                            product.id,
                            "rejected"
                          )
                        }
                      >
                        رفض
                      </button>
                    </>
                  )}

                  <button
                    className="btn gray"
                    onClick={() =>
                      deleteProduct(product.id)
                    }
                  >
                    حذف
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}
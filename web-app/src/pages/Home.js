import { useState, useEffect } from "react";
import { db } from "../firebase/firebase"; 
import { collection, getDocs, query, where } from "firebase/firestore";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApprovedProducts = async () => {
    try {
      const q = query(collection(db, "products"), where("status", "==", "approved"));
      const querySnapshot = await getDocs(q);
      const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(list);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedProducts();
  }, []);

  if (loading) return <h2 style={{ color: "#fff", textAlign: "center", marginTop: "50px" }}>جاري تحميل المعرض...</h2>;

  return (
    <div style={{ padding: "20px", color: "#fff", direction: "rtl" }}>
      <h1 style={{ textAlign: "center", marginBottom: "40px" }}>معرض Campus Market</h1>
      
      {products.length === 0 ? (
        <p style={{ textAlign: "center" }}>لا توجد منتجات معروضة حالياً.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "25px" }}>
          {products.map((product) => (
            <div key={product.id} style={{ backgroundColor: "#1e293b", borderRadius: "12px", padding: "15px", textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.3)" }}>
              <img 
                src={product.image} 
                alt={product.name} 
                style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }} 
              />
              <h3 style={{ marginTop: "15px", fontSize: "20px" }}>{product.name}</h3>
              <p style={{ color: "#2ecc71", fontWeight: "bold", fontSize: "22px", margin: "10px 0" }}>{product.price} ج.م</p>
              <button style={{ width: "100%", padding: "10px", backgroundColor: "#3498db", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
                تفاصيل المنتج
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
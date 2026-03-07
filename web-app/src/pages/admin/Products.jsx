import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from "firebase/firestore";

const Products = () => {
  const [pendingProducts, setPendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingProducts = async () => {
    try {
      const q = query(collection(db, "products"), where("status", "==", "pending"));
      const querySnapshot = await getDocs(q);
      const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPendingProducts(list);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  const handleApprove = async (id) => {
    try {
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, { status: "approved" });
      alert("Approved");
      fetchPendingProducts(); 
    } catch (error) {
      alert("Error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete?")) {
      try {
        await deleteDoc(doc(db, "products", id));
        alert("Deleted");
        fetchPendingProducts(); 
      } catch (error) {
        alert("Error");
      }
    }
  };

  if (loading) return <h2 style={{ color: "#fff", textAlign: "center" }}>Loading...</h2>;

  return (
    <div style={{ padding: "20px", color: "#fff", direction: "rtl" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>طلبات المنتجات المعلقة</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
        {pendingProducts.map((product) => (
          <div key={product.id} style={{ backgroundColor: "#1e293b", padding: "15px", borderRadius: "10px" }}>
            <img src={product.image} alt={product.name} style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "5px" }} />
            <h3>{product.name}</h3>
            <p>السعر: {product.price} ج.م</p>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
              <button onClick={() => handleApprove(product.id)} style={{ backgroundColor: "#2ecc71", color: "#fff", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer" }}>قبول</button>
              <button onClick={() => handleDelete(product.id)} style={{ backgroundColor: "#e74c3c", color: "#fff", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer" }}>حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
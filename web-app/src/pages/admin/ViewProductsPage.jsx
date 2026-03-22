import AdminLayout from "../../layout/AdminLayout";
import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const ViewProductsPage = () => {
  const [products, setProducts] = useState([]);
  const productsCollection = collection(db, "products");

  const fetchProducts = async () => {
    const data = await getDocs(productsCollection);
    const productsList = data.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
    setProducts(productsList);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("هل تريد حذف هذا المنتج؟")) return;
    await deleteDoc(doc(db, "products", id));
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <AdminLayout>
      <h1 style={{ textAlign: "center", marginTop: "20px" }}>View Products</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "20px", padding: "20px" }}>
        {products.map((product) => (
          <div key={product.id} style={{ border: "1px solid #ddd", borderRadius: "12px", padding: "15px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <img src={product.image} alt={product.name} style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px" }} />
            <h3 style={{ marginTop: "10px" }}>{product.name}</h3>
            <p style={{ fontWeight: "bold" }}>{product.price} EGP</p>
            <p style={{ fontStyle: "italic", fontSize: "0.9rem" }}>By: {product.sellerName || product.sellerEmail}</p>
            <button onClick={() => handleDeleteProduct(product.id)} style={{ backgroundColor: "#968b8b", color: "white", border: "none", padding: "8px 15px", borderRadius: "6px", cursor: "pointer" }}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default ViewProductsPage;
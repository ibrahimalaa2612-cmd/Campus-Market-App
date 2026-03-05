// src/pages/admin/Products.jsx
import AdminLayout from "../../layout/AdminLayout";
import { db, storage } from "../../firebase/firebase";
import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  const productsCollection = collection(db, "products");

  const fetchProducts = async () => {
    const data = await getDocs(productsCollection);
    setProducts(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    fetchProducts();
  });

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!name || !price || !image) return alert("Please fill all fields");

    try {
      const imageRef = ref(storage, "products/" + image.name);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      const docRef = await addDoc(productsCollection, {
        name,
        price: Number(price),
        image: imageUrl,
        createdAt: serverTimestamp(),
      });

      setProducts(prev => [...prev, { id: docRef.id, name, price: Number(price), image: imageUrl }]);

      setName("");
      setPrice("");
      setImage(null);
      document.getElementById("productImage").value = null;
    } catch (error) {
      console.log(error);
      alert("Error adding product");
    }
  };

  const handleDeleteProduct = async (id) => {
    await deleteDoc(doc(db, "products", id));
    fetchProducts();
  };

  return (
    <AdminLayout>
      <h1>Products</h1>
      <form onSubmit={handleAddProduct}>
        <input type="text" placeholder="Product Name" value={name} onChange={e => setName(e.target.value)} />
        <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
        <input id="productImage" type="file" onChange={e => setImage(e.target.files[0])} />
        <button type="submit">Add Product</button>
      </form>

      <div>
        {products.map(product => (
          <div key={product.id} style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
           <img
  src={product.image}
  alt={product.name} // ✅
  style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px" }}
/>
            <div>
              <h3>{product.name}</h3>
              <p>${product.price}</p>
            </div>
            <button onClick={() => handleDeleteProduct(product.id)} style={{ marginLeft: "auto", backgroundColor: "#f44336", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default Products;

/*
import AdminLayout from "../../layout/AdminLayout";
import { auth, db, storage } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { doc, getDoc, collection, addDoc, getDocs, deleteDoc, serverTimestamp} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Dashboard = () => {

  const navigate = useNavigate();

  // eslint-disable-next-line no-unused-vars
  const [userName, setUserName] = useState("");
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  const productsCollection = collection(db, "products");

  // eslint-disable-next-line no-unused-vars
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };


  const fetchUserName = async () => {

    const uid = auth.currentUser?.uid;

    if (!uid) return;

    const docRef = doc(db, "userProfiles", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUserName(docSnap.data().name);
    } else {
      setUserName("User");
    }
  };

  const fetchProducts = async () => {

    const data = await getDocs(productsCollection);

    const productsList = data.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    setProducts(productsList);
  };

  useEffect(() => {
    fetchUserName();
    fetchProducts();
  });

  
  // eslint-disable-next-line no-unused-vars
  const handleAddProduct = async (e) => {

    e.preventDefault();

    if (!name || !price || !image) {
      alert("Please fill all fields");
      return;
    }

    try {

      const imageRef = ref(storage, "products/" + image.name);

      await uploadBytes(imageRef, image);

      const imageUrl = await getDownloadURL(imageRef);

      await addDoc(productsCollection, {
        name,
        price: Number(price),
        image: imageUrl,
        createdAt: serverTimestamp()
      });

      alert("Product Added");

      setName("");
      setPrice("");
      setImage(null);

      fetchProducts();

    } catch (error) {
      console.log(error);
      alert("Error adding product");
    }
  };

  const handleDeleteProduct = async (id) => {

    const confirmDelete = window.confirm("Delete this product?");

    if (!confirmDelete) return;

    await deleteDoc(doc(db, "products", id));

    fetchProducts();
  };

  return (

   <AdminLayout>
  <div style={{ marginTop: "40px" }}>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
        gap: "20px",
        padding: "20px"
      }}
    >
      {products.map((product) => (
        <div
          key={product.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "15px",
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: "100%",
              height: "150px",
              objectFit: "cover",
              borderRadius: "8px"
            }}
          />
          <h3 style={{ marginTop: "10px" }}>{product.name}</h3>
          <p style={{ fontWeight: "bold" }}>{product.price} EGP</p>
          <button
            onClick={() => handleDeleteProduct(product.id)}
            style={{
              backgroundColor: "#968b8b",
              color: "white",
              border: "none",
              padding: "8px 15px",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  </div>
</AdminLayout>
  );
};

export default Dashboard;
*/

import AdminLayout from "../../layout/AdminLayout";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { db, storage,auth } from "../../firebase/firebase";
// eslint-disable-next-line no-unused-vars
import { doc, getDoc, collection, getDocs, deleteDoc, serverTimestamp } from "firebase/firestore";
// eslint-disable-next-line no-unused-vars
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Dashboard = () => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [products, setProducts] = useState([]);

  const productsCollection = collection(db, "products");

  
  const fetchUserName = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const docRef = doc(db, "userProfiles", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUserName(docSnap.data().name);
    } else {
      setUserName("Admin");
    }
  };

  const fetchProducts = async () => {
    const data = await getDocs(productsCollection);
    const productsList = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProducts(productsList);
  };

  useEffect(() => {
    fetchUserName();
    fetchProducts();
  },);

  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm("Delete this product?");
    if (!confirmDelete) return;
    await deleteDoc(doc(db, "products", id));
    fetchProducts();
  };

  return (
    <AdminLayout>
    <div style={{ minHeight: "100vh", backgroundColor: "#2c3e50", padding: "30px" }}>
        <h1 style={{ textAlign: "center", color: "#f1c40f", marginBottom: "30px" }}>
        Welcome_Admin {userName}
        </h1>

        
        <div style={{ marginTop: "30px", display: "flex", justifyContent: "center", gap: "20px" }}>
          <button
            onClick={() => navigate("/admin/add-product")}
            style={{
              padding: "12px 25px",
              fontSize: "16px",
              fontWeight: "bold",
              backgroundColor: "#3498db",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Add Product
          </button>

          <button
            onClick={() => navigate("/admin/view-products")}
            style={{
              padding: "12px 25px",
              fontSize: "16px",
              fontWeight: "bold",
              backgroundColor: "#2ecc71",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            View Products
          </button>
        </div>

        
        <div style={{ marginTop: "40px", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "20px", padding: "20px" }}>
          {products.map((product) => (
            <div key={product.id} style={{ border: "1px solid #ddd", borderRadius: "12px", padding: "15px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <img src={product.image} alt={product.name} style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px" }} />
              <h3 style={{ marginTop: "10px" }}>{product.name}</h3>
              <p style={{ fontWeight: "bold" }}>{product.price} EGP</p>
              <button onClick={() => handleDeleteProduct(product.id)} style={{ backgroundColor: "#e74c3c", color: "white", border: "none", padding: "8px 15px", borderRadius: "6px", cursor: "pointer" }}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;

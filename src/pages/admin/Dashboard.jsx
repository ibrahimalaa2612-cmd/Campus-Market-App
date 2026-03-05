import AdminLayout from "../../layout/AdminLayout";
import { auth, db, storage } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  doc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  serverTimestamp
} from "firebase/firestore";

import { signOut } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Dashboard = () => {

  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  const productsCollection = collection(db, "products");

  // logout
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  // get admin name
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

  // get products
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
  }, []);

  // add product
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

  // delete product
  const handleDeleteProduct = async (id) => {

    const confirmDelete = window.confirm("Delete this product?");

    if (!confirmDelete) return;

    await deleteDoc(doc(db, "products", id));

    fetchProducts();
  };

  return (

    <AdminLayout>

      {/* logout button */}

      <button
        onClick={handleLogout}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          padding: "12px 20px",
          fontSize: "16px",
          fontWeight: "bold",
          backgroundColor: "#f44336",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
          zIndex: 1000
        }}
      >
        Logout
      </button>

      {/* welcome */}

      <h1 style={{ textAlign: "center", marginTop: "70px" }}>
        Welcome {userName}
      </h1>

      {/* products */}

      <div style={{ marginTop: "40px" }}>

        <h2 style={{ textAlign: "center" }}>Products</h2>

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

              <h3 style={{ marginTop: "10px" }}>
                {product.name}
              </h3>

              <p style={{ fontWeight: "bold" }}>
                {product.price} EGP
              </p>

              <button
                onClick={() => handleDeleteProduct(product.id)}
                style={{
                  backgroundColor: "#e53935",
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
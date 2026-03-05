/*
import AdminLayout from "../../layout/AdminLayout";
import { useState } from "react";
import { db, storage } from "../../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AddProductPage = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  const productsCollection = collection(db, "products");

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!name || !price || !image) {
      alert("يرجى ملء كل الحقول");
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

      alert("تم الإضافة بنجاح");

      setName("");
      setPrice("");
      setImage(null);
    } catch (err) {
      console.log(err);
      alert("حدث خطأ أثناء الإضافة");
    }
  };

  return (
    <AdminLayout>
      <h1 style={{ textAlign: "center", marginTop: "20px" }}>Add Product</h1>
      <div style={{ margin: "20px auto", maxWidth: "500px", textAlign: "center" }}>
        <input
          type="text"
          placeholder="اسم المنتج"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px",backgroundColor: "transparent", border: "1px solid #000000",borderRadius: "5px",color:"#000" }}
        />
        <input
          type="number"
          placeholder="السعر"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{width: "100%", padding: "8px", marginBottom: "10px",backgroundColor: "transparent", border: "1px solid #000000",borderRadius: "5px",color:"#000"  }}
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          style={{width: "100%", padding: "8px", marginBottom: "10px",backgroundColor: "transparent", border: "1px solid #000000",borderRadius: "5px",color:"#000"  }}
        />
        <button type="button"
          onClick={handleAddProduct}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Add Product
        </button>
      </div>
    </AdminLayout>
  );
};

export default AddProductPage;*/

import AdminLayout from "../../layout/AdminLayout";
import { useState } from "react";
import { db, storage } from "../../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AddProductPage = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  const productsCollection = collection(db, "products");

  const handleAddProduct = async (e) => {
    e.preventDefault();
    console.log("handleAddProduct running"); 

    if (!name || !price || !image) {
      alert("يرجى ملء كل الحقول");
      return;
    }

    try {
  
      const imageRef = ref(storage, "products/" + image.name);
      const uploadResult = await uploadBytes(imageRef, image);
      console.log("Image uploaded:", uploadResult);

      const imageUrl = await getDownloadURL(imageRef);
      console.log("Image URL:", imageUrl);

      
      await addDoc(productsCollection, {
        name,
        price: Number(price),
        image: imageUrl,
        createdAt: serverTimestamp()
      });

      alert("تم الإضافة بنجاح");

      setName("");
      setPrice("");
      setImage(null);
    } catch (err) {
      console.log("Error:", err);
    //  alert("حدث خطأ أثناء الإضافة");
    }
  };

  return (
    <AdminLayout>
      <h1 style={{ textAlign: "center", marginTop: "20px" }}>Add Product</h1>
      <div style={{ margin: "20px auto", maxWidth: "500px", textAlign: "center" }}>
        <input
          type="text"
          placeholder="اسم المنتج"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px", backgroundColor: "transparent", border: "1px solid #000000", borderRadius: "5px", color:"#000" }}
        />
        <input
          type="number"
          placeholder="السعر"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px", backgroundColor: "transparent", border: "1px solid #000000", borderRadius: "5px", color:"#000" }} />

      
        <div style={{ position: "relative", marginBottom: "10px" }}>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            style={{
              width: "100%",
              height: "40px",
              opacity: 0,
              position: "absolute",
              left: 0,
              top: 0,
              cursor: "pointer",
            }}
          />
          <div style={{
            border: "1px solid #000",
            borderRadius: "5px",
            padding: "8px",
            textAlign: "center",
            color: "#000",
            backgroundColor: "transparent",
            cursor: "pointer"
          }}>
            {image ? image.name : "اختر ملف"}
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddProduct}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Add Product
        </button>
      </div>
    </AdminLayout>
  );
};

export default AddProductPage;
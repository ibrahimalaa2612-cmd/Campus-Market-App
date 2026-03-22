import AdminLayout from "../../layout/AdminLayout";
import { useState } from "react";
import { db, storage } from "../../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../../context/AuthContext";

const AddProductPage = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const { user } = useAuth();

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
        createdAt: serverTimestamp(),
        sellerEmail: user.email,
        sellerName: user.displayName || "", // الاسم الكامل
        status: "pending"
      });

      alert("تم الإضافة بنجاح");
      setName("");
      setPrice("");
      setImage(null);
    } catch (err) {
      console.error(err);
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
        />
        <input
          type="number"
          placeholder="السعر"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button onClick={handleAddProduct}>Add Product</button>
      </div>
    </AdminLayout>
  );
};

export default AddProductPage;
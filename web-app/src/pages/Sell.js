import { useState } from "react";
import { db } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import "../styles/Sell.css";

export default function Sell() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [driveLink, setDriveLink] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const categories = ["كتب", "أجهزة", "ملابس", "أدوات", "أخرى"];

  const convertToDirectLink = (url) => {
    if (url.includes("drive.google.com")) {
      const fileId = url.split("/d/")[1]?.split("/")[0];
      return `https://lh3.googleusercontent.com/u/0/d/${fileId}`;
    }
    return url;
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!name || !price || !driveLink || !category) {
      alert("يرجى إدخال اسم المنتج والسعر والصورة والتصنيف");
      return;
    }

    setLoading(true);
    try {
      const finalImageUrl = convertToDirectLink(driveLink);

      await addDoc(collection(db, "products"), {
        name,
        price: Number(price),
        image: finalImageUrl,
        status: "pending",
        createdAt: serverTimestamp(),
        sellerId: user.uid,
        sellerName: user.displayName || user.email,
        description,
        category,
      });

      alert("تم الإرسال بنجاح! تأكد أن رابط الدرايف 'عام'");
      setName("");
      setPrice("");
      setDriveLink("");
      setDescription("");
      setCategory("");
    } catch (err) {
      alert("حدث خطأ أثناء الحفظ");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sell-container">
      <div className="sell-card">
        <h2>إضافة منتج جديد</h2>
        <form onSubmit={handleAddProduct}>
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
            type="text"
            placeholder="رابط الصورة من Google Drive"
            value={driveLink}
            onChange={(e) => setDriveLink(e.target.value)}
          />
          <textarea
            placeholder="وصف المنتج (اختياري)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">اختر التصنيف</option>
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <button type="submit" disabled={loading}>
            {loading ? "جاري الإرسال..." : "إرسال للمراجعة"}
          </button>
        </form>
      </div>
    </div>
  );
}
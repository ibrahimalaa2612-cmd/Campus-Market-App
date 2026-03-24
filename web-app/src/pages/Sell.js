import { useState } from "react";
import { db } from "../firebase/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import "../styles/Sell.css";

export default function Sell() {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [driveLink, setDriveLink] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [loading, setLoading] = useState(false);

  const categories = [
  "كل التصنيفات",
  "كتب و مراجع",
  "أجهزة إلكترونية",
  "ملابس و إكسسوارات",
  "أدوات مدرسية",
  "أدوات منزلية صغيرة",
  "مستلزمات رياضية",
  "معدات كمبيوتر",
  "أجهزة منزلية",
  "خدمات",
  "أخرى"
];
  const conditions = ["جديد", "مستعمل", "مستعمل - يشبه الجديد"];

  const convertToDirectLink = (url) => {
    if (url.includes("drive.google.com")) {
      const fileId = url.split("/d/")[1]?.split("/")[0];
      return `https://lh3.googleusercontent.com/u/0/d/${fileId}`;
    }
    return url;
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!name || !price || !driveLink || !category || !condition) {
      alert("يرجى إدخال كل الحقول المطلوبة");
      return;
    }

    if (!user) {
      alert("يجب تسجيل الدخول أولاً");
      return;
    }

    setLoading(true);

    try {
      const finalImageUrl = convertToDirectLink(driveLink);

      // 🔥 نجيب بيانات المستخدم
      const userDoc = await getDoc(doc(db, "userProfiles", user.uid));

      if (!userDoc.exists()) {
        alert("بيانات المستخدم غير موجودة");
        setLoading(false);
        return;
      }

      const userData = userDoc.data();

      await addDoc(collection(db, "products"), {
        name,
        price: Number(price),
        image: finalImageUrl,
        status: "pending",
        condition,
        createdAt: serverTimestamp(),

        sellerId: user.uid,
        sellerName: userData.fullName || "مستخدم",
        sellerPhone: userData.phone || "",
        university: userData.university || "",

        description,
        category,
        sold: false
      });

      alert("تم الإرسال بنجاح! سيتم مراجعة المنتج من الأدمن");

      // Reset
      setName("");
      setPrice("");
      setDriveLink("");
      setDescription("");
      setCategory("");
      setCondition("");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الحفظ");
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

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">اختر التصنيف</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          >
            <option value="">اختر حالة المنتج</option>
            {conditions.map((cond) => (
              <option key={cond} value={cond}>
                {cond}
              </option>
            ))}
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "جاري الإرسال..." : "إرسال للمراجعة"}
          </button>
        </form>
      </div>
    </div>
  );
}
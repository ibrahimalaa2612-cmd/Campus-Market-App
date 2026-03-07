import { useState } from "react";
import { db } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const Sell = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [driveLink, setDriveLink] = useState("");
  const [loading, setLoading] = useState(false);

  // دالة لتحويل رابط الدرايف العادي لرابط مباشر يظهر في الموقع
  const convertToDirectLink = (url) => {
    if (url.includes("drive.google.com")) {
      const fileId = url.split("/d/")[1]?.split("/")[0];
      return `https://lh3.googleusercontent.com/u/0/d/${fileId}`;
    }
    return url; // لو الرابط مش درايف سيبه زي ما هو
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!name || !price || !driveLink) {
      alert("يرجى إدخال اسم المنتج والسعر ورابط الصورة من الدرايف");
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
        createdAt: serverTimestamp()
      });

      alert("تم الإرسال بنجاح! تأكد أن رابط الدرايف 'عام' (Anyone with the link)");
      setName("");
      setPrice("");
      setDriveLink("");
    } catch (err) {
      alert("حدث خطأ أثناء الحفظ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ margin: "50px auto", maxWidth: "500px", textAlign: "center", color: "#fff" }}>
      <h2>إضافة منتج (عبر جوجل درايف)</h2>
      <form onSubmit={handleAddProduct} style={{ backgroundColor: "#1e293b", padding: "30px", borderRadius: "10px" }}>
        <input
          type="text"
          placeholder="اسم المنتج"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "90%", padding: "12px", marginBottom: "15px", backgroundColor: "#334155", border: "1px solid #475569", borderRadius: "5px", color: "#fff" }}
        />
        <input
          type="number"
          placeholder="السعر"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{ width: "90%", padding: "12px", marginBottom: "15px", backgroundColor: "#334155", border: "1px solid #475569", borderRadius: "5px", color: "#fff" }}
        />
        <input
          type="text"
          placeholder="انسخ رابط مشاركة الصورة من الدرايف هنا"
          value={driveLink}
          onChange={(e) => setDriveLink(e.target.value)}
          style={{ width: "90%", padding: "12px", marginBottom: "25px", backgroundColor: "#334155", border: "1px solid #475569", borderRadius: "5px", color: "#fff" }}
        />
        <button type="submit" disabled={loading} style={{ padding: "12px 25px", backgroundColor: "#2ecc71", color: "white", border: "none", borderRadius: "6px", width: "90%" }}>
          {loading ? "جاري الإرسال..." : "إرسال للمراجعة"}
        </button>
      </form>
    </div>
  );
};

export default Sell;
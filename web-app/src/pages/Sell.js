import { useState } from "react";
import { db } from "../firebase/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import "../styles/Sell.css";

const DEFAULT_IMAGE =
  "https://i.postimg.cc/FKMdfByG/download.jpg";

/* =========================
   CLOUDINARY UPLOAD
========================= */
const uploadToCloudinary = async (file) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "market_upload"); // لازم يكون Unsigned
  formData.append("cloud_name", "dkytpqkgd");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dkytpqkgd/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  if (!data.secure_url) {
    throw new Error("Upload failed");
  }

  return data.secure_url;
};

export default function Sell() {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [mainIndex, setMainIndex] = useState(0);

  const [loading, setLoading] = useState(false);

  const categories = [
    "كل التصنيفات",

    "كتب و مراجع",
    "كتب دراسية",
    "كورسات و تدريب",
    "أدوات مدرسية",

    "أجهزة إلكترونية",
    "موبايلات و تابلت",
    "لابتوبات و كمبيوتر",
    "إكسسوارات إلكترونية",
    "مكونات كمبيوتر",
    "شاشات و أجهزة عرض",

    "ملابس و إكسسوارات",
    "ملابس رجالي",
    "ملابس حريمي",
    "أحذية",
    "حقائب و شنط",
    "ساعات و مجوهرات",

    "أدوات منزلية",
    "أثاث و ديكور",
    "أدوات مطبخ",
    "أجهزة منزلية",
    "تنظيف و مستلزمات منزل",

    "ألعاب فيديو",
    "رياضة و لياقة",
    "مستلزمات رياضية",

    "سيارات و موتوسيكلات",
    "قطع غيار",
    "إكسسوارات سيارات",

    "خدمات",
    "خدمات برمجة",
    "تصميم جرافيك",
    "تسويق إلكتروني",
    "خدمات تعليمية",

    "أخرى",
  ];

  const conditions = ["جديد", "مستعمل", "مستعمل - يشبه الجديد"];

  /* =========================
     ADD IMAGES
  ========================= */
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (imageFiles.length + files.length > 5) {
      return alert("أقصى عدد صور 5");
    }

    setImageFiles([...imageFiles, ...files]);
    setImagePreviews([
      ...imagePreviews,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
  };

  /* =========================
     REMOVE IMAGE
  ========================= */
  const removeImage = (index) => {
    const newFiles = [...imageFiles];
    const newPreviews = [...imagePreviews];

    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);

    setImageFiles(newFiles);
    setImagePreviews(newPreviews);

    if (mainIndex === index) setMainIndex(0);
  };

  /* =========================
     SET MAIN IMAGE
  ========================= */
  const setMainImage = (index) => {
    setMainIndex(index);
  };

  /* =========================
     SUBMIT PRODUCT
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return alert("يجب تسجيل الدخول");
    if (!name || !price || !category || !condition)
      return alert("اكمل البيانات");

    if (loading) return;

    setLoading(true);

    try {
      let imageUrls = [];

      /* 🚀 UPLOAD TO CLOUDINARY */
      if (imageFiles.length > 0) {
        imageUrls = await Promise.all(
          imageFiles.map((file) => uploadToCloudinary(file))
        );
      } else {
        imageUrls = [DEFAULT_IMAGE];
      }

      /* 💾 SAVE TO FIRESTORE */
      await addDoc(collection(db, "products"), {
        name,
        price: Number(price),
        description,
        category,
        condition,

        images: imageUrls,
        image: imageUrls[mainIndex] || imageUrls[0],

        sellerId: user.uid,
        sellerEmail: user.email,

        createdAt: serverTimestamp(),
        status: "pending",
        sold: false,
      });

      alert("تم نشر المنتج بنجاح 🎉");

      /* RESET */
      setName("");
      setPrice("");
      setDescription("");
      setCategory("");
      setCondition("");
      setImageFiles([]);
      setImagePreviews([]);
      setMainIndex(0);
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء رفع الصور");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="sell-page">

      <div className="sell-header">
        <h2>Sell Your Product</h2>
        <p>Post your item instantly</p>
      </div>

      <div className="sell-card">

        <form className="sell-form" onSubmit={handleSubmit}>

          <input
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />

          {/* PREVIEW */}
          <div className="preview-grid">
            {imagePreviews.map((img, i) => (
              <div
                key={i}
                className={`preview-item ${
                  i === mainIndex ? "active" : ""
                }`}
              >
                <img src={img} alt="" />

                {i === mainIndex && (
                  <span className="main-badge">Main</span>
                )}

                <button
                  type="button"
                  className="main-btn"
                  onClick={() => setMainImage(i)}
                >
                  ⭐
                </button>

                <button
                  type="button"
                  className="remove-img"
                  onClick={() => removeImage(i)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="grid-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Category</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            >
              <option value="">Condition</option>
              {conditions.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <button disabled={loading}>
            {loading ? "Posting..." : "Post Product"}
          </button>

        </form>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import "../styles/MyProducts.css";

export default function MyProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    condition: "",
    image: ""
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "products"));
      const items = snapshot.docs
        .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
        .filter(
          (p) =>
            p.sellerId === user.uid &&
            (p.status === "approved" || p.status === "rejected")
        );
      setProducts(items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsSold = async (id) => {
    await updateDoc(doc(db, "products", id), { sold: true });
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      await deleteDoc(doc(db, "products", id));
      fetchProducts();
    }
  };

  // فتح الـ Modal
  const openModal = (product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      condition: product.condition,
      image: product.image
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentProduct(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!currentProduct) return;

    await updateDoc(doc(db, "products", currentProduct.id), {
      ...formData,
      status: "pending"
    });
    fetchProducts();
    closeModal();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="my-products-container">
      <h2>منتجاتي</h2>
      {loading ? (
        <p>جاري التحميل...</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p className="price">{product.price} EGP</p>
              <p className="category">{product.category} - {product.condition}</p>
              <p className="date">تاريخ الإضافة: {product.createdAt?.toDate().toLocaleDateString()}</p>

              {product.status === "rejected" && <span className="rejected-badge">تم الرفض</span>}
              {product.sold && <span className="sold-badge">تم البيع</span>}

              <div className="actions">
                {!product.sold && (
                  <>
                    <button onClick={() => markAsSold(product.id)} className="sold-btn">تم البيع</button>
                    <button onClick={() => openModal(product)} className="edit-btn">تعديل</button>
                    <button onClick={() => deleteProduct(product.id)} className="delete-btn">حذف</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>تعديل المنتج</h3>

            <label>الاسم:</label>
            <input name="name" value={formData.name} onChange={handleChange} />

            <label>السعر:</label>
            <input name="price" value={formData.price} onChange={handleChange} type="number" />

            <label>الفئة:</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="">اختر الفئة</option>
              <option value="كتب و مراجع">كتب و مراجع</option>
              <option value="أجهزة إلكترونية">أجهزة إلكترونية</option>
              <option value="ملابس و إكسسوارات">ملابس و إكسسوارات</option>
              <option value="أدوات مدرسية">أدوات مدرسية</option>
              <option value="أدوات منزلية صغيرة">أدوات منزلية صغيرة</option>
              <option value="مستلزمات رياضية">مستلزمات رياضية</option>
              <option value="معدات كمبيوتر">معدات كمبيوتر</option>
              <option value="أجهزة منزلية">أجهزة منزلية</option>
              <option value="خدمات">خدمات</option>
              <option value="أخرى">أخرى</option>
            </select>

            <label>الحالة الفيزيائية:</label>
            <select name="condition" value={formData.condition} onChange={handleChange}>
              <option value="">اختر الحالة</option>
              <option value="جديد">جديد</option>
              <option value="مستعمل">مستعمل</option>
              <option value="مستعمل - يشبه الجديد">مستعمل - يشبه الجديد</option>
            </select>

            <label>رابط الصورة:</label>
            <input name="image" value={formData.image} onChange={handleChange} type="url" />

            <div className="modal-actions">
              <button onClick={handleUpdate} className="edit-btn">حفظ التعديلات</button>
              <button onClick={closeModal} className="delete-btn">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
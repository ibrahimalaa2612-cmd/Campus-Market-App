import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import "../styles/MyProducts.css";

const DEFAULT_IMAGE =
  "https://i.postimg.cc/FKMdfByG/download.jpg";

export default function MyProducts() {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    condition: "",
    images: [],
    newImages: [],
    previews: [],
  });

  /* ================= FETCH ================= */
  const fetchProducts = async () => {
    setLoading(true);

    try {
      const snap = await getDocs(collection(db, "products"));

      const items = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter(
          (p) =>
            p.sellerId === user.uid &&
            (p.status === "approved" || p.status === "rejected")
        );

      setProducts(items);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (window.confirm("Delete product?")) {
      await deleteDoc(doc(db, "products", id));
      fetchProducts();
    }
  };

  /* ================= SOLD ================= */
  const handleSold = async (id) => {
    await updateDoc(doc(db, "products", id), {
      sold: true,
    });

    fetchProducts();
  };

  /* ================= OPEN MODAL ================= */
  const openModal = (product) => {
    setSelectedProduct(product);

    setForm({
      name: product.name || "",
      price: product.price || "",
      description: product.description || "",
      category: product.category || "",
      condition: product.condition || "",
      images: product.images || [],
      newImages: [],
      previews: [],
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= ADD NEW IMAGES ================= */
  const handleAddImages = (e) => {
    const files = Array.from(e.target.files);

    setForm((prev) => ({
      ...prev,
      newImages: [...prev.newImages, ...files],
      previews: [
        ...prev.previews,
        ...files.map((f) => URL.createObjectURL(f)),
      ],
    }));
  };

  /* ================= REMOVE OLD IMAGE ================= */
  const removeOldImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  /* ================= REMOVE NEW IMAGE ================= */
  const removeNewImage = (index) => {
    setForm((prev) => {
      const files = [...prev.newImages];
      const prevs = [...prev.previews];

      files.splice(index, 1);
      prevs.splice(index, 1);

      return {
        ...prev,
        newImages: files,
        previews: prevs,
      };
    });
  };

  /* ================= CLOUDINARY ================= */
  const uploadToCloudinary = async (file) => {
    const data = new FormData();

    data.append("file", file);
    data.append("upload_preset", "market_upload");
    data.append("cloud_name", "dkytpqkgd");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dkytpqkgd/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const result = await res.json();
    return result.secure_url;
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async () => {
    let finalImages = [...form.images];

    if (form.newImages.length > 0) {
      const uploaded = await Promise.all(
        form.newImages.map(uploadToCloudinary)
      );

      finalImages = [...finalImages, ...uploaded];
    }

    await updateDoc(doc(db, "products", selectedProduct.id), {
      name: form.name,
      price: Number(form.price),
      description: form.description,
      category: form.category,
      condition: form.condition,
      images: finalImages,
      image: finalImages[0] || DEFAULT_IMAGE,
      status: "pending",
    });

    fetchProducts();
    closeModal();
  };

  /* ================= UI ================= */
  return (
    <div className="home">

      <div className="page-header">
        <h2>My Products</h2>
        <p>Manage your listings</p>
      </div>

      <div className="layout">
        <section className="grid">

          {loading ? (
            <div className="empty">Loading...</div>
          ) : (
            products.map((p) => (
              <div className="card" key={p.id}>

                {p.sold && (
                  <span className="badge">SOLD</span>
                )}

                <img
                  src={p.image || DEFAULT_IMAGE}
                  alt=""
                />

                <div className="card-body">

                  <h3>{p.name}</h3>

                  <p className="price">
                    {p.price} EGP
                  </p>

                  <p className="meta">
                    {p.category}
                  </p>

                  <p className="meta">
                    {p.condition}
                  </p>

                  <div className="actions">

                    {!p.sold && (
                      <>
                        <button
                          className="btn green"
                          onClick={() =>
                            handleSold(p.id)
                          }
                        >
                          Sold
                        </button>

                        <button
                          className="btn blue"
                          onClick={() =>
                            openModal(p)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="btn red"
                          onClick={() =>
                            handleDelete(p.id)
                          }
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>

                </div>
              </div>
            ))
          )}
        </section>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={closeModal}
        >
          <div
            className="modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <h3>Edit Product</h3>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
            />

            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
            />

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
            />

            {/* OLD IMAGES */}
            <div className="img-row">
              {form.images.map((img, i) => (
                <div key={i} className="img-box">
                  <img src={img} />
                  <button
                    onClick={() =>
                      removeOldImage(i)
                    }
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* NEW IMAGES */}
            <input
              type="file"
              multiple
              onChange={handleAddImages}
            />

            <div className="img-row">
              {form.previews.map((img, i) => (
                <div key={i} className="img-box">
                  <img src={img} />
                  <button
                    onClick={() =>
                      removeNewImage(i)
                    }
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="modal-actions">

              <button
                className="btn green"
                onClick={handleUpdate}
              >
                Save
              </button>

              <button
                className="btn red"
                onClick={closeModal}
              >
                Cancel
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
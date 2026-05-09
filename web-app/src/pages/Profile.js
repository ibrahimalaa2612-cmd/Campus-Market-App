import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import "../styles/Profile.css";

const DEFAULT_IMAGE = "https://i.postimg.cc/FKMdfByG/download.jpg";

/* ── نجوم التقييم ── */
const StarRating = ({ rating }) => (
  <div className="star-rating">
    {[1, 2, 3, 4, 5].map((star) => (
      <span key={star} className={star <= Math.round(rating) ? "star filled" : "star"}>
        ★
      </span>
    ))}
  </div>
);

export default function Profile() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [university, setUniversity] = useState("");
  const [faculty, setFaculty] = useState("");
  const [studentId, setStudentId] = useState("");
  const [bio, setBio] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const snap = await getDoc(doc(db, "userProfiles", user.uid));
      if (snap.exists()) {
        const data = snap.data();
        setProfile(data);
        setFullName(data.fullName || "");
        setPhone(data.phone || "");
        setUniversity(data.university || "");
        setFaculty(data.faculty || "");
        setStudentId(data.studentId || "");
        setBio(data.bio || "");
        setImageUrl(data.imageUrl || "");
      }
      const q = query(
        collection(db, "products"),
        where("sellerId", "==", user.uid),
        where("status", "==", "approved")
      );
      const pSnap = await getDocs(q);
      setProducts(pSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    load();
  }, [user]);

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "market_upload");
    data.append("cloud_name", "dkytpqkgd");
    const res = await fetch("https://api.cloudinary.com/v1_1/dkytpqkgd/image/upload", {
      method: "POST",
      body: data,
    });
    const result = await res.json();
    return result.secure_url;
  };

  const handleSave = async () => {
    setLoadingSubmit(true);
    try {
      let uploadedImage = imageUrl;
      if (imageFile) uploadedImage = await uploadToCloudinary(imageFile);
      await setDoc(
        doc(db, "userProfiles", user.uid),
        { fullName, phone, university, faculty, studentId, bio, email: user.email, imageUrl: uploadedImage || DEFAULT_IMAGE },
        { merge: true }
      );
      setImageUrl(uploadedImage);
      setProfile((prev) => ({ ...prev, fullName, phone, university, faculty, studentId, bio, imageUrl: uploadedImage }));
      setSuccessMsg("تم الحفظ ✅");
      setEditMode(false);
    } catch (err) {
      console.log(err);
    }
    setLoadingSubmit(false);
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Login required</div>;

  const avgRating = profile?.avgRating || 0;
  const reviewCount = profile?.reviewCount || 0;

  return (
    <div className="profile-page">
      {!editMode ? (
        <div className="public-profile">
          <div className="pub-header">
            <img
              src={imageUrl || DEFAULT_IMAGE}
              className="pub-avatar"
              alt="profile"
              onError={(e) => (e.target.src = DEFAULT_IMAGE)}
            />
            <div className="pub-info">
              <h2>{profile?.fullName || "—"}</h2>
              <p className="pub-uni">
                {profile?.university}
                {profile?.faculty && ` - ${profile.faculty}`}
              </p>
              {profile?.bio && <p className="pub-bio">{profile.bio}</p>}

              {/* ── التقييم ── */}
              <div className="pub-rating">
                {reviewCount > 0 ? (
                  <>
                    <StarRating rating={avgRating} />
                    <span className="rating-value">{avgRating.toFixed(1)}</span>
                    <span className="rating-count">({reviewCount} تقييم)</span>
                  </>
                ) : (
                  <span className="no-rating">لا يوجد تقييمات بعد</span>
                )}
              </div>

              <p className="pub-date">عضو منذ {formatDate(profile?.createdAt)}</p>
            </div>
            <button className="edit-profile-btn" onClick={() => setEditMode(true)}>
              ✏️ تعديل الملف الشخصي
            </button>
          </div>

          <div className="pub-products">
            <h3>منتجاتي ({products.length})</h3>
            <div className="pub-grid">
              {products.map((p) => (
                <div key={p.id} className="pub-card" onClick={() => navigate(`/product/${p.id}`)}>
                  <img src={p.image || DEFAULT_IMAGE} alt={p.name} onError={(e) => (e.target.src = DEFAULT_IMAGE)} />
                  <div className="pub-card-body">
                    <h4>{p.name}</h4>
                    <p>{p.price} EGP</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="profile-card">
          <div className="profile-header">
            <h2>تعديل الملف الشخصي</h2>
            <button className="back-edit-btn" onClick={() => setEditMode(false)}>← رجوع</button>
          </div>
          <img
            src={imageFile ? URL.createObjectURL(imageFile) : imageUrl || DEFAULT_IMAGE}
            alt="profile"
            className="profile-image"
          />
          <div style={{ textAlign: "center", marginBottom: 15 }}>
            <input type="file" id="upload" hidden onChange={(e) => setImageFile(e.target.files[0])} />
            <label htmlFor="upload" className="save-btn">Upload Photo</label>
          </div>
          <div className="profile-form">
            <div className="grid-2">
              <div className="field"><label>Full Name</label><input value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
              <div className="field"><label>Phone</label><input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
              <div className="field"><label>Student ID</label><input value={studentId} onChange={(e) => setStudentId(e.target.value)} /></div>
              <div className="field"><label>University</label><input value={university} onChange={(e) => setUniversity(e.target.value)} /></div>
              <div className="field"><label>Faculty</label><input value={faculty} onChange={(e) => setFaculty(e.target.value)} /></div>
            </div>
            <div className="field full"><label>Bio</label><textarea value={bio} onChange={(e) => setBio(e.target.value)} /></div>
            {successMsg && <p className="success">{successMsg}</p>}
            <button className="save-btn" onClick={handleSave}>{loadingSubmit ? "Saving..." : "Save Changes"}</button>
          </div>
        </div>
      )}
    </div>
  );
}
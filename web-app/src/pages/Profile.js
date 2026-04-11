import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import "../styles/Profile.css";

/* ================= UNIVERSITIES ================= */
const universitiesData = {
  "جامعة القاهرة": [
    "الهندسة",
    "الطب",
    "الصيدلة",
    "العلوم",
    "التجارة",
    "الحقوق",
    "الآداب",
    "الإعلام",
    "الحاسبات والذكاء الاصطناعي",
    "الزراعة",
    "التمريض",
    "طب الأسنان",
  ],

  "جامعة عين شمس": [
    "الهندسة",
    "الطب",
    "الصيدلة",
    "العلوم",
    "التجارة",
    "الحقوق",
    "الآداب",
    "الحاسبات والمعلومات",
    "التمريض",
    "طب الأسنان",
  ],

  "جامعة الإسكندرية": [
    "الهندسة",
    "الطب",
    "الصيدلة",
    "العلوم",
    "الآداب",
    "التجارة",
    "الحقوق",
    "الزراعة",
    "التربية",
  ],

  "جامعة حلوان": [
    "الهندسة",
    "الفنون الجميلة",
    "الفنون التطبيقية",
    "التربية",
    "الآداب",
    "السياحة والفنادق",
    "الحاسبات والذكاء الاصطناعي",
  ],

  "جامعة المنصورة": [
    "الهندسة",
    "الطب",
    "الصيدلة",
    "العلوم",
    "الآداب",
    "الحقوق",
    "التجارة",
    "الزراعة",
  ],

  "جامعة أسيوط": [
    "الهندسة",
    "الطب",
    "الصيدلة",
    "العلوم",
    "الآداب",
    "الحقوق",
    "التجارة",
  ],

  "جامعة الزقازيق": [
    "الهندسة",
    "الطب",
    "الصيدلة",
    "العلوم",
    "الآداب",
    "التجارة",
    "الحقوق",
  ],

  "جامعة طنطا": [
    "الهندسة",
    "الطب",
    "الصيدلة",
    "العلوم",
    "الآداب",
    "التجارة",
    "الحقوق",
  ],

  "جامعة بني سويف": [
    "الهندسة",
    "الطب",
    "الصيدلة",
    "العلوم",
    "الآداب",
    "التجارة",
  ],

  "جامعة المنيا": [
    "الهندسة",
    "الطب",
    "الصيدلة",
    "العلوم",
    "الآداب",
  ],

  "جامعة كفر الشيخ": [
    "الهندسة",
    "الطب",
    "العلوم",
    "الآداب",
    "التجارة",
    "الزراعة",
  ],

  "جامعة الفيوم": [
    "الهندسة",
    "العلوم",
    "الآداب",
    "التربية",
    "الخدمة الاجتماعية",
  ],
};

export default function Profile() {
  const { user, loading } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [university, setUniversity] = useState("");
  const [faculty, setFaculty] = useState("");
  const [studentId, setStudentId] = useState("");
  const [bio, setBio] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const defaultImage =
    "https://i.ibb.co/4pDNDk1/default-profile.png";

  /* ================= CLOUDINARY ================= */
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "market_upload");
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

  /* ================= LOAD ================= */
  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      const ref = doc(db, "userProfiles", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();

        setFullName(data.fullName || "");
        setEmail(data.email || user.email);
        setDob(data.dob || "");
        setPhone(data.phone || "");
        setUniversity(data.university || "");
        setFaculty(data.faculty || "");
        setStudentId(data.studentId || "");
        setBio(data.bio || "");
        setImageUrl(data.imageUrl || "");
      } else {
        setEmail(user.email);
      }
    };

    loadProfile();
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Login required</div>;

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMsg("");
    setSuccessMsg("");
    setLoadingSubmit(true);

    try {
      let uploadedImage = imageUrl;

      if (imageFile) {
        uploadedImage = await uploadToCloudinary(imageFile);
      }

      await setDoc(
        doc(db, "userProfiles", user.uid),
        {
          fullName,
          dob,
          phone,
          university,
          faculty,
          studentId,
          bio: bio || "",
          email,
          imageUrl: uploadedImage || defaultImage,
        },
        { merge: true }
      );

      setSuccessMsg("Profile updated successfully ✅");
      setImageFile(null);
    } catch (err) {
      console.log(err);
      setErrorMsg("Something went wrong");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="profile-page">

      {/* HEADER */}
      <div className="profile-header">
        <h2>Your Profile</h2>
        <p>Update your personal information</p>
      </div>

      <div className="profile-card">

        {/* IMAGE */}
        <img
          src={
            imageFile
              ? URL.createObjectURL(imageFile)
              : imageUrl || defaultImage
          }
          alt="profile"
          className="profile-image"
        />

        {/* UPLOAD */}
        <div style={{ textAlign: "center", marginBottom: 15 }}>
          <input
            type="file"
            id="upload"
            hidden
            onChange={(e) =>
              setImageFile(e.target.files[0])
            }
          />

          <label htmlFor="upload" className="save-btn">
            Upload Photo
          </label>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">

          <div className="grid-2">

            <div className="field">
              <label>Email</label>
              <input value={email} readOnly />
            </div>

            <div className="field">
              <label>Full Name</label>
              <input
                value={fullName}
                onChange={(e) =>
                  setFullName(e.target.value)
                }
              />
            </div>

            <div className="field">
              <label>Phone</label>
              <input
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
              />
            </div>

            <div className="field">
              <label>Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) =>
                  setDob(e.target.value)
                }
              />
            </div>

            <div className="field">
              <label>Student ID</label>
              <input
                value={studentId}
                onChange={(e) =>
                  setStudentId(e.target.value)
                }
              />
            </div>

            {/* UNIVERSITY */}
            <div className="field">
              <label>University</label>
              <select
                value={university}
                onChange={(e) => {
                  setUniversity(e.target.value);
                  setFaculty("");
                }}
              >
                <option value="">Select university</option>

                {Object.keys(universitiesData).map(
                  (u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* FACULTY */}
            <div className="field">
              <label>Faculty</label>
              <select
                value={faculty}
                disabled={!university}
                onChange={(e) =>
                  setFaculty(e.target.value)
                }
              >
                <option value="">Select faculty</option>

                {universitiesData[university]?.map(
                  (f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  )
                )}
              </select>
            </div>

          </div>

          <div className="field full">
            <label>Bio</label>
            <textarea
              value={bio}
              onChange={(e) =>
                setBio(e.target.value)
              }
            />
          </div>

          {errorMsg && (
            <p className="error">{errorMsg}</p>
          )}
          {successMsg && (
            <p className="success">{successMsg}</p>
          )}

          <button className="save-btn">
            {loadingSubmit
              ? "Saving..."
              : "Save Changes"}
          </button>

        </form>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/CompleteProfile.css";

export default function CompleteProfile() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [university, setUniversity] = useState("");
  const [faculty, setFaculty] = useState("");
  const [studentId, setStudentId] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [bio, setBio] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const [errorMsg, setErrorMsg] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [progress, setProgress] = useState(0);

  const facultiesByUniversity = {
    "جامعة القاهرة": ["الهندسة","التجارة","الطب","الصيدلة","القانون","العلوم","الآداب","التربية","علوم الحاسوب","الزراعة","التمريض"],
    "جامعة عين شمس": ["الهندسة","التجارة","الطب","الصيدلة","القانون","العلوم","الآداب","التربية"],
    "جامعة الإسكندرية": ["الهندسة","التجارة","الطب","الصيدلة","القانون","العلوم","الآداب","التربية"],
    "جامعة حلوان": ["الهندسة","التجارة","الآداب","التربية","علوم الحاسوب"],
    "جامعة المنصورة": ["الهندسة","الطب","الصيدلة","القانون","العلوم","الآداب"],
    "جامعة أسيوط": ["الهندسة","الطب","القانون","العلوم","الآداب","التربية"],
    "جامعة طنطا": ["الهندسة","الطب","القانون","العلوم","الآداب","التربية"],
    "جامعة الزقازيق": ["الهندسة","الطب","القانون","العلوم","الآداب","التربية"],
    "جامعة قناة السويس": ["الهندسة","الطب","القانون","العلوم","الآداب","التربية"],
    "جامعة الفيوم": ["الهندسة","العلوم","الآداب","التربية"],
    "جامعة بني سويف": ["الهندسة","الطب","القانون","العلوم","الآداب","التربية"],
    "جامعة المنيا": ["الهندسة","الطب","القانون","العلوم","الآداب","التربية"],
    "جامعة سوهاج": ["الهندسة","الطب","القانون","العلوم","الآداب","التربية"]
  };

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      try {
        const docRef = doc(db, "userProfiles", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFullName(data.fullName || "");
          setUniversity(data.university || "");
          setFaculty(data.faculty || "");
          setStudentId(data.studentId || "");
          setPhone(data.phone || "");
          setWhatsapp(data.whatsapp || "");
          setBio(data.bio || "");
          setImageUrl(data.imageUrl || null);
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };

    loadProfile();
  }, [user]);

  if (loading) return <div className="loading">جاري التحقق من تسجيل الدخول...</div>;
  if (!user) return <div className="loading">يجب تسجيل الدخول أولاً</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoadingSubmit(true);
    setProgress(0);

    // Validation
    if (fullName.trim().length < 3) { setErrorMsg("الاسم الكامل يجب أن يكون 3 أحرف على الأقل."); setLoadingSubmit(false); return; }
    if (!university) { setErrorMsg("اختر الجامعة"); setLoadingSubmit(false); return; }
    if (!faculty) { setErrorMsg("اختر الكلية"); setLoadingSubmit(false); return; }
    if (!studentId.trim()) { setErrorMsg("الرقم الجامعي مطلوب"); setLoadingSubmit(false); return; }
    if (!/^01[0-9]{9}$/.test(phone)) { setErrorMsg("رقم الهاتف غير صالح"); setLoadingSubmit(false); return; }
    if (whatsapp && !/^01[0-9]{9}$/.test(whatsapp)) { setErrorMsg("رقم واتساب غير صالح"); setLoadingSubmit(false); return; }

    let finalImageUrl = imageUrl;

    if (imageFile) {
      try {
        const storageRef = ref(storage, `profileImages/${user.uid}_${Date.now()}_${imageFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              setProgress(percent);
            },
            (error) => reject(error),
            () => resolve()
          );
        });

        finalImageUrl = await getDownloadURL(ref(storage, storageRef.fullPath));
      } catch (err) {
        setErrorMsg("حدث خطأ أثناء رفع الصورة");
        setLoadingSubmit(false);
        return;
      }
    }

    try {
      const userProfile = {
        fullName,
        university,
        faculty,
        studentId,
        phone,
        whatsapp: whatsapp || null,
        bio: bio || null,
        imageUrl: finalImageUrl || null
      };

      await setDoc(doc(db, "userProfiles", user.uid), userProfile, { merge: true });

      navigate("/");
    } catch (err) {
      console.error(err);
      setErrorMsg("حدث خطأ أثناء حفظ البيانات");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="container">
  <div className="profile-header">
    <h2>أكمل بياناتك الشخصية</h2>
    <p>قم بتحديث معلوماتك لتجربة أفضل</p>
  </div>

  {imageUrl && !imageFile && <img src={imageUrl} alt="Profile" className="profile-image" />}
  {imageFile && <img src={URL.createObjectURL(imageFile)} alt="Profile" className="profile-image" />}

  <form className="profile-edit-form" onSubmit={handleSubmit}>
    <div>
      <label>الاسم الكامل</label>
      <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required />
    </div>

    <div>
      <label>اختر الجامعة</label>
      <select value={university} onChange={e => { setUniversity(e.target.value); setFaculty(""); }} required>
        <option value="">-- اختر الجامعة --</option>
        {Object.keys(facultiesByUniversity).map(uni => <option key={uni} value={uni}>{uni}</option>)}
      </select>
    </div>

    <div>
      <label>اختر الكلية</label>
      <select value={faculty} onChange={e => setFaculty(e.target.value)} required disabled={!university}>
        <option value="">-- اختر الكلية --</option>
        {university && facultiesByUniversity[university]?.map(f => <option key={f} value={f}>{f}</option>)}
      </select>
    </div>

    <div>
      <label>الرقم الجامعي</label>
      <input type="text" value={studentId} onChange={e => setStudentId(e.target.value)} required />
    </div>

    <div>
      <label>رقم الهاتف</label>
      <input type="text" value={phone} onChange={e => setPhone(e.target.value)} required />
    </div>

    <div>
      <label>واتساب (اختياري)</label>
      <input type="text" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
    </div>

    <div>
      <label>نبذة عنك (اختياري)</label>
      <textarea value={bio} onChange={e => setBio(e.target.value)} />
    </div>

    <div>
      <label>صورة الملف الشخصي</label>
      <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
    </div>

    {errorMsg && <p className="errorMsg">{errorMsg}</p>}
    {loadingSubmit && imageFile && (
      <div className="progressContainer">
        <div className="progressBar" style={{ width: `${progress}%` }}>{progress}%</div>
      </div>
    )}

    <button type="submit" className="primary">
      {loadingSubmit ? `جاري الحفظ${progress > 0 ? ` ${progress}%` : ""}` : "حفظ البيانات"}
    </button>
  </form>
</div>
  );
}
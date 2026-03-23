import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import "../styles/Profile.css";

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
  const [imageUrl, setImageUrl] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const defaultImage = "https://i.ibb.co/4pDNDk1/default-profile.png";

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
          setEmail(data.email || "");
          setDob(data.dob || "");
          setPhone(data.phone || "");
          setUniversity(data.university || "");
          setFaculty(data.faculty || "");
          setStudentId(data.studentId || "");
          setBio(data.bio || "");
          setImageUrl(data.imageUrl || defaultImage);
        } else {
          setImageUrl(defaultImage);
          setEmail(user.email);
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };

    loadProfile();
  }, [user]);

  if (loading) return <div className="loading">جاري التحميل...</div>;
  if (!user) return <div className="loading">يجب تسجيل الدخول أولاً</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoadingSubmit(true);

    try {
      await setDoc(doc(db, "userProfiles", user.uid), {
        fullName,
        dob,
        phone,
        university,
        faculty,
        studentId,
        bio: bio || "",
        email, // الايميل غير قابل للتعديل
        imageUrl
      }, { merge: true });

      setSuccessMsg("تم حفظ البيانات ✅");
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
      <h2>بياناتك الشخصية</h2>
      <p>يمكنك تعديل أي حقل مباشرة وحفظ التغييرات</p>
    </div>

    {/* عرض الصورة */}
    <img src={imageUrl || defaultImage} alt="Profile" className="profile-image" />

    <form className="profile-edit-form" onSubmit={handleSubmit}>
      {/* خانة لتغيير رابط الصورة */}
      <div>
        <label>رابط الصورة</label>
        <input
          type="text"
          value={imageUrl}
          placeholder="ادخل رابط الصورة"
          onChange={e => setImageUrl(e.target.value)}
        />
      </div>

      <div>
        <label>الإيميل</label>
        <input type="email" value={email} readOnly />
      </div>

      <div>
        <label>الاسم الكامل</label>
        <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} />
      </div>

      <div>
        <label>تاريخ الميلاد</label>
        <input type="date" value={dob} onChange={e => setDob(e.target.value)} />
      </div>

      <div>
        <label>رقم الهاتف</label>
        <input type="text" value={phone} onChange={e => setPhone(e.target.value)} />
      </div>

      <div>
        <label>اختر الجامعة</label>
        <select value={university} onChange={e => { setUniversity(e.target.value); setFaculty(""); }}>
          <option value="">-- اختر الجامعة --</option>
          {Object.keys(facultiesByUniversity).map(uni => <option key={uni} value={uni}>{uni}</option>)}
        </select>
      </div>

      <div>
        <label>اختر الكلية</label>
        <select value={faculty} onChange={e => setFaculty(e.target.value)} disabled={!university}>
          <option value="">-- اختر الكلية --</option>
          {university && facultiesByUniversity[university]?.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      <div>
        <label>الرقم الجامعي</label>
        <input type="text" value={studentId} onChange={e => setStudentId(e.target.value)} />
      </div>

      <div>
        <label>نبذة عنك (اختياري)</label>
        <textarea value={bio} onChange={e => setBio(e.target.value)} />
      </div>

      {errorMsg && <p className="errorMsg">{errorMsg}</p>}
      {successMsg && <p className="successMsg">{successMsg}</p>}

      <button type="submit" className="primary">
        {loadingSubmit ? "جاري الحفظ..." : "حفظ البيانات"}
      </button>
    </form>
  </div>
);
}
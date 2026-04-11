import React, { useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../../styles/Auth.css";

/* ================= UNIVERSITIES FULL ================= */
const universities = [
  "جامعة القاهرة",
  "جامعة عين شمس",
  "جامعة الإسكندرية",
  "جامعة حلوان",
  "جامعة المنصورة",
  "جامعة الزقازيق",
  "جامعة طنطا",
  "جامعة بنها",
  "جامعة كفر الشيخ",
  "جامعة قناة السويس",
  "جامعة أسيوط",
  "جامعة المنيا",
  "جامعة سوهاج",
  "جامعة بني سويف",
  "جامعة الفيوم",
  "جامعة دمياط",
  "جامعة جنوب الوادي",
  "جامعة بورسعيد",
  "جامعة السويس",
];

const facultiesMap = {
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
    "طب الأسنان",
    "التمريض",
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
    "طب الأسنان",
    "التمريض",
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

  "جامعة بنها": [
    "الهندسة",
    "الطب البيطري",
    "العلوم",
    "التجارة",
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

  "جامعة أسيوط": [
    "الهندسة",
    "الطب",
    "الصيدلة",
    "العلوم",
    "الآداب",
    "الحقوق",
    "التجارة",
  ],

  "جامعة المنيا": [
    "الهندسة",
    "الطب",
    "الصيدلة",
    "العلوم",
    "الآداب",
  ],

  "جامعة سوهاج": [
    "الهندسة",
    "الطب",
    "العلوم",
    "الآداب",
    "التجارة",
  ],

  "جامعة بني سويف": [
    "الهندسة",
    "الطب",
    "الصيدلة",
    "العلوم",
    "الآداب",
    "التجارة",
  ],

  "جامعة الفيوم": [
    "الهندسة",
    "العلوم",
    "الآداب",
    "التربية",
    "الخدمة الاجتماعية",
  ],
};

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [animCard, setAnimCard] = useState("slide-in-right");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    phone: "",
    university: "",
    faculty: "",
    studentId: "",
    agreeTerms: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;

  const phoneRegex = /^01[0-9]{9}$/;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* STEP 1 */
  const handleNext = (e) => {
    e.preventDefault();
    setError("");

    if (!email) return setError("الإيميل مطلوب");

    if (!passwordRegex.test(password)) {
      return setError(
        "كلمة المرور: حرف كبير + رقم + رمز + 8 أحرف"
      );
    }

    setAnimCard("slide-out-left");

    setTimeout(() => {
      setStep(2);
      setAnimCard("slide-in-right");
    }, 200);
  };

  /* REGISTER */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const {
      fullName,
      dob,
      phone,
      university,
      faculty,
      studentId,
      agreeTerms,
    } = form;

    if (!fullName) return setError("الاسم مطلوب");
    if (!dob) return setError("تاريخ الميلاد مطلوب");
    if (!phoneRegex.test(phone))
      return setError("رقم الهاتف غير صحيح");
    if (!university) return setError("اختر الجامعة");
    if (!faculty) return setError("اختر الكلية");
    if (!studentId) return setError("الرقم الجامعي مطلوب");
    if (!agreeTerms)
      return setError("يجب الموافقة على الشروط");

    try {
      setLoading(true);

      const userCred =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      const uid = userCred.user.uid;

      await setDoc(doc(db, "userProfiles", uid), {
        fullName,
        email: email.toLowerCase(),
        phone,
        university,
        faculty,
        studentId,
        imageUrl:
          "https://i.ibb.co/4pDNDk1/default-profile.png",
        role: "user",
        createdAt: serverTimestamp(),
      });

      navigate("/home", { replace: true });
    } catch (err) {
      if (err.code === "auth/email-already-in-use")
        setError("الإيميل مستخدم");
      else if (err.code === "auth/invalid-email")
        setError("الإيميل غير صحيح");
      else if (err.code === "auth/weak-password")
        setError("كلمة المرور ضعيفة");
      else setError("حدث خطأ أثناء التسجيل");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setAnimCard("slide-out-right");

    setTimeout(() => {
      setStep(1);
      setAnimCard("slide-in-left");
    }, 200);
  };

  return (
    <div className="auth-container">
      <div className={`auth-card ${animCard}`}>

        {/* STEP PROGRESS */}
        <div className="progress-bar">
          <div className={`progress-step ${step >= 1 ? "active" : ""}`} />
          <div className={`progress-step ${step >= 2 ? "active" : ""}`} />
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <form onSubmit={handleNext}>
            <h2>إنشاء حساب</h2>

            <input
              type="email"
              placeholder="الإيميل"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <small>
              حرف كبير + رقم + رمز + 8 أحرف
            </small>

            {error && <p className="error-msg">{error}</p>}

            <button className="primary">التالي</button>
          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form onSubmit={handleSubmit}>
            <h2>أكمل بياناتك</h2>

            <input
              name="fullName"
              placeholder="الاسم الكامل"
              value={form.fullName}
              onChange={handleChange}
            />

            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
            />

            <input
              name="phone"
              placeholder="رقم الهاتف"
              value={form.phone}
              onChange={handleChange}
            />

            {/* UNIVERSITY */}
            <select
              name="university"
              value={form.university}
              onChange={(e) => {
                handleChange(e);
                setForm((p) => ({
                  ...p,
                  faculty: "",
                }));
              }}
            >
              <option value="">اختر الجامعة</option>
              {universities.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>

            {/* FACULTY */}
            <select
              name="faculty"
              value={form.faculty}
              onChange={handleChange}
              disabled={!form.university}
            >
              <option value="">اختر الكلية</option>

              {(facultiesMap[form.university] ||
                []).map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>

            <input
              name="studentId"
              placeholder="الرقم الجامعي"
              value={form.studentId}
              onChange={handleChange}
            />

            <label>
              <input
                type="checkbox"
                name="agreeTerms"
                checked={form.agreeTerms}
                onChange={handleChange}
              />
              أوافق على الشروط
            </label>

            {error && <p className="error-msg">{error}</p>}

            <button disabled={loading} className="primary">
              {loading ? "جاري التسجيل..." : "إنهاء التسجيل"}
            </button>

            <button
              type="button"
              className="secondary"
              onClick={handleBack}
            >
              رجوع
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
import React, { useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../../styles/Auth.css";

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [animCard, setAnimCard] = useState("slide-in-right");

  // Step1
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Step2
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [university, setUniversity] = useState("");
  const [faculty, setFaculty] = useState("");
  const [studentId, setStudentId] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
  const phoneRegex = /^01[0-9]{9}$/;

  // ===== Step 1 Next =====
  const handleNext = (e) => {
    e.preventDefault();
    setError("");

    if (!email) return setError("الإيميل مطلوب.");
    if (!passwordRegex.test(password))
      return setError("كلمة المرور يجب أن تحتوي على حرف كبير + رقم + رمز + 8 أحرف على الأقل.");

    setAnimCard("slide-out-left");
    setTimeout(() => {
      setStep(2);
      setAnimCard("slide-in-right");
    }, 300);
  };

  // ===== Step 2 Submit =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (fullName.trim().length < 3) return setError("الاسم الكامل يجب أن يكون 3 أحرف على الأقل.");
    if (!dob) return setError("تاريخ الميلاد مطلوب.");
    if (!phoneRegex.test(phone)) return setError("رقم الهاتف يجب أن يكون 11 رقمًا ويبدأ بـ 01.");
    if (!university) return setError("الرجاء اختيار الجامعة.");
    if (!faculty) return setError("الرجاء اختيار الكلية.");
    if (!studentId) return setError("الرقم الجامعي مطلوب.");
    if (!agreeTerms) return setError("يجب الموافقة على الشروط والأحكام.");

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const defaultImage = "https://i.ibb.co/4pDNDk1/default-profile.png";

      await setDoc(doc(db, "userProfiles", userCredential.user.uid), {
        email: email.toLowerCase(),
        fullName: fullName.trim(),
        dob,
        phone,
        university,
        faculty,
        studentId,
        imageUrl: defaultImage,
        role: "user", // 👈 مهم
        createdAt: serverTimestamp()
      });

      alert("تم إنشاء الحساب بنجاح!");
      navigate("/home", { replace: true });
    } catch (err) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") setError("الإيميل مستخدم بالفعل.");
      else if (err.code === "auth/invalid-email") setError("الإيميل غير صالح.");
      else if (err.code === "auth/weak-password") setError("كلمة المرور ضعيفة.");
      else setError("حدث خطأ أثناء التسجيل.");
    } finally {
      setLoading(false);
    }
  };

  // ===== Back Button =====
  const handleBack = () => {
    setAnimCard("slide-out-right");
    setTimeout(() => {
      setStep(1);
      setAnimCard("slide-in-left");
    }, 300);
  };

  return (
    <div className="auth-container">
      <div className={`auth-card ${animCard}`}>
        {/* Progress bar */}
        <div className="progress-bar">
          <div className={`progress-step ${step >= 1 ? "active" : ""}`}></div>
          <div className={`progress-step ${step >= 2 ? "active" : ""}`}></div>
        </div>

        {step === 1 && (
          <form onSubmit={handleNext}>
            <h2>الخطوة 1: إنشاء الحساب</h2>
            <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <small style={{ color: "#666", fontSize: "12px" }}>
              كلمة المرور يجب أن تحتوي على: حرف كبير + رقم + رمز + 8 أحرف على الأقل
            </small>
            {error && <p className="error-msg">{error}</p>}
            <button type="submit" className="primary">التالي</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit}>
            <h2>الخطوة 2: أكمل بياناتك</h2>
            <input type="text" placeholder="الاسم الكامل" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            <input type="date" placeholder="تاريخ الميلاد" value={dob} onChange={(e) => setDob(e.target.value)} required />
            <input type="text" placeholder="رقم الهاتف" value={phone} onChange={(e) => setPhone(e.target.value)} required />

            <select value={university} onChange={(e) => { setUniversity(e.target.value); setFaculty(""); }} required>
              <option value="">اختر الجامعة</option>
              <option value="جامعة القاهرة">جامعة القاهرة</option>
              <option value="جامعة عين شمس">جامعة عين شمس</option>
              <option value="جامعة الإسكندرية">جامعة الإسكندرية</option>
              <option value="جامعة حلوان">جامعة حلوان</option>
              <option value="جامعة المنصورة">جامعة المنصورة</option>
              <option value="جامعة الزقازيق">جامعة الزقازيق</option>
              <option value="جامعة طنطا">جامعة طنطا</option>
              <option value="جامعة بنها">جامعة بنها</option>
              <option value="جامعة قناة السويس">جامعة قناة السويس</option>
              <option value="جامعة أسيوط">جامعة أسيوط</option>
              <option value="جامعة المنيا">جامعة المنيا</option>
              <option value="جامعة سوهاج">جامعة سوهاج</option>
              <option value="جامعة بني سويف">جامعة بني سويف</option>
              <option value="جامعة الفيوم">جامعة الفيوم</option>
            </select>

            <select value={faculty} onChange={(e) => setFaculty(e.target.value)} required disabled={!university}>
              <option value="">اختر الكلية</option>
              {/* Faculties حسب الجامعة */}
              {university === "جامعة القاهرة" && ["الهندسة","التجارة","الطب","الصيدلة","القانون","العلوم","الآداب","التربية","علوم الحاسوب","الزراعة","التمريض"].map(f => <option key={f} value={f}>{f}</option>)}
              {university === "جامعة عين شمس" && ["الهندسة","التجارة","الطب","الصيدلة","القانون","العلوم","الآداب","التربية"].map(f => <option key={f} value={f}>{f}</option>)}
              {university === "جامعة الإسكندرية" && ["الهندسة","التجارة","الطب","الصيدلة","القانون","العلوم","الآداب","التربية"].map(f => <option key={f} value={f}>{f}</option>)}
              {university === "جامعة حلوان" && ["الهندسة","التجارة","الآداب","التربية","علوم الحاسوب"].map(f => <option key={f} value={f}>{f}</option>)}
              {/* باقي الجامعات تضيف بنفس الطريقة */}
            </select>

            <input type="text" placeholder="الرقم الجامعي" value={studentId} onChange={(e) => setStudentId(e.target.value)} required />

            <div style={{ margin: "10px 0" }}>
              <label>
                <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} /> أوافق على <a href="/terms" target="_blank">الشروط والأحكام</a>
              </label>
            </div>

            {error && <p className="error-msg">{error}</p>}
            <button type="submit" className="primary" disabled={loading}>{loading ? "جاري التسجيل..." : "إنهاء التسجيل"}</button>
            <button type="button" className="secondary" style={{ marginTop: "10px" }} onClick={handleBack}>عودة للخطوة السابقة</button>
          </form>
        )}
      </div>
    </div>
  );
}
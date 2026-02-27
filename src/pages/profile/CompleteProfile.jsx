import React, { useState } from 'react';
import { auth, db, storage } from '../../firebase';
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import styles from './CompleteProfile.module.css';

function CompleteProfile() {
  const [fullName, setFullName] = useState('');
  const [university, setUniversity] = useState('');
  const [faculty, setFaculty] = useState('');
  const [studentId, setStudentId] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [bio, setBio] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (fullName.length < 3) return setErrorMsg("الاسم الكامل يجب أن يكون 3 أحرف على الأقل.");
    if (!/^01[0-9]{9}$/.test(phone)) return setErrorMsg("رقم الهاتف يجب أن يكون 11 رقمًا ويبدأ بـ 01.");
    if (!faculty) return setErrorMsg("الرجاء اختيار الكلية.");
    if (!studentId) return setErrorMsg("الرقم الجامعي مطلوب.");
    if (whatsapp && !/^01[0-9]{9}$/.test(whatsapp)) return setErrorMsg("رقم واتساب يجب أن يكون 11 رقمًا ويبدأ بـ 01.");

    let imageUrl = null;
    if (imageFile) {
      const storageRef = ref(storage, `profileImages/${auth.currentUser.uid}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(storageRef);
    }

    const userProfile = { fullName, university, faculty, studentId, phone, whatsapp: whatsapp || null, bio: bio || null, imageUrl };
    await setDoc(doc(db, "userProfiles", auth.currentUser.uid), userProfile);

    alert("تم حفظ الملف الشخصي بنجاح ✅");
    setFullName(''); setUniversity(''); setFaculty(''); setStudentId(''); setPhone('');
    setWhatsapp(''); setBio(''); setImageFile(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <h2>أكمل بياناتك الشخصية</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="الاسم الكامل" value={fullName} onChange={e => setFullName(e.target.value)} required />
          <select value={university} onChange={e => setUniversity(e.target.value)} required>
            <option value="">اختر الجامعة</option>
            <option value="Cairo University">جامعة القاهرة</option>
            <option value="Ain Shams University">جامعة عين شمس</option>
          </select>
          <select value={faculty} onChange={e => setFaculty(e.target.value)} required disabled={!university}>
            <option value="">اختر الكلية</option>
            <option value="Engineering">الهندسة</option>
            <option value="Commerce">التجارة</option>
          </select>
          <input type="text" placeholder="الرقم الجامعي" value={studentId} onChange={e => setStudentId(e.target.value)} required />
          <input type="text" placeholder="رقم الهاتف" value={phone} onChange={e => setPhone(e.target.value)} required />
          <input type="text" placeholder="واتساب (اختياري)" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
          <textarea placeholder="نبذة عنك (اختياري)" value={bio} onChange={e => setBio(e.target.value)} />
          <input type="file" onChange={e => setImageFile(e.target.files[0])} />
          {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}
          <button type="submit">حفظ البيانات</button>
        </form>
      </div>
    </div>
  );
}

export default CompleteProfile;
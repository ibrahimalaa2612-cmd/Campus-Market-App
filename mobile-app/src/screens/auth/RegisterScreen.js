import { Picker } from "@react-native-picker/picker";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../../services/firebase";
import styles from "../../styles/authStyles";

const universities = [
  "جامعة القاهرة",
  "جامعة عين شمس",
  "جامعة الإسكندرية",
  "جامعة حلوان",
  "جامعة المنصورة",
  "جامعة أسيوط",
  "جامعة الزقازيق",
  "جامعة طنطا",
  "جامعة بني سويف",
  "جامعة المنيا",
  "جامعة جنوب الوادي",
  "جامعة الفيوم",
  "جامعة كفر الشيخ",
  "جامعة السويس",
  "جامعة بورسعيد",
  "جامعة دمنهور",
];

const facultiesMap = {
  "جامعة القاهرة": [
    "الهندسة",
    "الطب",
    "طب الأسنان",
    "الصيدلة",
    "العلوم",
    "التجارة",
    "الحقوق",
    "الإعلام",
    "الآداب",
    "الحاسبات والذكاء الاصطناعي",
    "الزراعة",
  ],

  "جامعة عين شمس": [
    "الهندسة",
    "الطب",
    "طب الأسنان",
    "الصيدلة",
    "العلوم",
    "التجارة",
    "الحقوق",
    "الآداب",
    "الحاسبات والمعلومات",
    "التمريض",
  ],

  "جامعة الإسكندرية": [
    "الهندسة",
    "الطب",
    "الصيدلة",
    "العلوم",
    "التجارة",
    "الحقوق",
    "الآداب",
    "الزراعة",
    "التمريض",
    "الحاسبات والعلوم",
  ],

  "جامعة حلوان": [
    "الهندسة",
    "الفنون الجميلة",
    "الفنون التطبيقية",
    "التجارة",
    "الحقوق",
    "الآداب",
    "التربية الرياضية",
    "السياحة والفنادق",
    "الاقتصاد المنزلي",
  ],

  "جامعة المنصورة": [
    "الهندسة",
    "الطب",
    "طب الأسنان",
    "الصيدلة",
    "العلوم",
    "التجارة",
    "الحقوق",
    "الآداب",
    "الحاسبات والمعلومات",
    "الطب البيطري",
  ],

  "جامعة أسيوط": [
    "الهندسة",
    "الطب",
    "الصيدلة",
    "العلوم",
    "التجارة",
    "الحقوق",
    "الآداب",
    "الزراعة",
    "التمريض",
  ],

  "جامعة الزقازيق": [
    "الهندسة",
    "الطب",
    "الطب البيطري",
    "الصيدلة",
    "العلوم",
    "التجارة",
    "الحقوق",
    "الآداب",
    "الزراعة",
  ],

  "جامعة طنطا": [
    "الهندسة",
    "الطب",
    "الصيدلة",
    "العلوم",
    "التجارة",
    "الحقوق",
    "الآداب",
    "التمريض",
  ],

  "جامعة بني سويف": [
    "الهندسة",
    "الطب",
    "الصيدلة",
    "العلوم",
    "التجارة",
    "الحقوق",
    "الآداب",
    "الحاسبات والذكاء الاصطناعي",
  ],

  "جامعة المنيا": [
    "الهندسة",
    "الطب",
    "الصيدلة",
    "العلوم",
    "التجارة",
    "الحقوق",
    "الآداب",
    "الزراعة",
  ],

  "جامعة جنوب الوادي": [
    "الهندسة",
    "الطب",
    "العلوم",
    "التجارة",
    "الحقوق",
    "الآداب",
    "الزراعة",
  ],

  "جامعة الفيوم": [
    "الهندسة",
    "الطب",
    "العلوم",
    "التجارة",
    "الحقوق",
    "الآداب",
    "الحاسبات والمعلومات",
  ],

  "جامعة كفر الشيخ": [
    "الهندسة",
    "الطب",
    "العلوم",
    "التجارة",
    "الزراعة",
    "الطب البيطري",
    "الحاسبات والمعلومات",
  ],

  "جامعة السويس": ["الهندسة", "العلوم", "التجارة", "الآداب"],

  "جامعة بورسعيد": ["الهندسة", "التجارة", "العلوم", "التربية", "التمريض"],

  "جامعة دمنهور": [
    "التجارة",
    "العلوم",
    "الآداب",
    "التربية",
    "التمريض",
    "الزراعة",
  ],
};

export default function RegisterScreen({ navigation }) {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    university: "",
    faculty: "",
    studentId: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (!email || !password) {
      return setError("أدخل البيانات");
    }
    setError("");
    setStep(2);
  };

  const handleSubmit = async () => {
    const { fullName, phone, university, faculty, studentId } = form;

    if (!fullName || !phone || !university || !faculty || !studentId) {
      return setError("اكمل البيانات");
    }

    try {
      setLoading(true);

      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const uid = userCred.user.uid;

      await setDoc(doc(db, "userProfiles", uid), {
        ...form,
        email,
        role: "user",
        createdAt: serverTimestamp(),
      });

      navigation.replace("Home");
    } catch (err) {
      setError("خطأ في التسجيل");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>إنشاء حساب</Text>

        {step === 1 && (
          <>
            <TextInput
              placeholder="الإيميل"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              placeholder="كلمة المرور"
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity style={styles.primaryBtn} onPress={handleNext}>
              <Text style={styles.btnText}>التالي</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 2 && (
          <>
            <TextInput
              placeholder="الاسم"
              style={styles.input}
              onChangeText={(v) => setForm({ ...form, fullName: v })}
            />

            <TextInput
              placeholder="رقم الهاتف"
              style={styles.input}
              onChangeText={(v) => setForm({ ...form, phone: v })}
            />

            <Picker
              selectedValue={form.university}
              onValueChange={(v) =>
                setForm({ ...form, university: v, faculty: "" })
              }
            >
              <Picker.Item label="اختر الجامعة" value="" />
              {universities.map((u) => (
                <Picker.Item key={u} label={u} value={u} />
              ))}
            </Picker>

            <Picker
              selectedValue={form.faculty}
              onValueChange={(v) => setForm({ ...form, faculty: v })}
            >
              <Picker.Item label="اختر الكلية" value="" />
              {(facultiesMap[form.university] || []).map((f) => (
                <Picker.Item key={f} label={f} value={f} />
              ))}
            </Picker>

            <TextInput
              placeholder="الرقم الجامعي"
              style={styles.input}
              onChangeText={(v) => setForm({ ...form, studentId: v })}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity style={styles.primaryBtn} onPress={handleSubmit}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>إنهاء التسجيل</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setStep(1)}>
              <Text style={styles.link}>رجوع</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

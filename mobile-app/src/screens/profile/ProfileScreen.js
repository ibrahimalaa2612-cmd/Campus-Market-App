import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";

import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../services/firebase";

import styles from "../../styles/ProfileStyles";

const DEFAULT_IMAGE = "https://i.ibb.co/4pDNDk1/default-profile.png";

/* ================= UNIVERSITIES ================= */
const universitiesData = {
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
    "التخطيط الإقليمي والعمراني",
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
    "التربية",
  ],

  "جامعة الإسكندرية": [
    "الهندسة",
    "الطب",
    "طب الأسنان",
    "الصيدلة",
    "العلوم",
    "التجارة",
    "الحقوق",
    "الآداب",
    "الزراعة",
    "التمريض",
    "الحاسبات والعلوم",
    "التربية",
  ],

  "جامعة حلوان": [
    "الهندسة بحلوان",
    "الفنون الجميلة",
    "الفنون التطبيقية",
    "التجارة وإدارة الأعمال",
    "الحقوق",
    "الآداب",
    "السياحة والفنادق",
    "التربية الرياضية",
    "الاقتصاد المنزلي",
    "الحاسبات والذكاء الاصطناعي",
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
    "الطب البيطري",
    "الحاسبات والمعلومات",
    "التربية",
  ],

  "جامعة أسيوط": [
    "الهندسة",
    "الطب",
    "طب الأسنان",
    "الصيدلة",
    "العلوم",
    "التجارة",
    "الحقوق",
    "الآداب",
    "الزراعة",
    "التمريض",
    "التربية",
  ],

  "جامعة الزقازيق": [
    "الهندسة",
    "الطب",
    "طب بيطري",
    "الصيدلة",
    "العلوم",
    "التجارة",
    "الحقوق",
    "الآداب",
    "الزراعة",
    "التربية",
  ],

  "جامعة طنطا": [
    "الهندسة",
    "الطب",
    "طب الأسنان",
    "الصيدلة",
    "العلوم",
    "التجارة",
    "الحقوق",
    "الآداب",
    "التربية",
    "التمريض",
  ],

  "جامعة بني سويف": [
    "الهندسة",
    "الطب",
    "طب الأسنان",
    "الصيدلة",
    "العلوم",
    "التجارة",
    "الحقوق",
    "الآداب",
    "الحاسبات والذكاء الاصطناعي",
    "التربية",
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
    "التربية",
  ],

  "جامعة جنوب الوادي": [
    "الهندسة",
    "الطب",
    "العلوم",
    "التجارة",
    "الحقوق",
    "الآداب",
    "الزراعة",
    "التربية",
  ],

  "جامعة الفيوم": [
    "الهندسة",
    "الطب",
    "الصيدلة",
    "العلوم",
    "التجارة",
    "الحقوق",
    "الآداب",
    "الحاسبات والمعلومات",
    "التربية",
  ],

  "جامعة كفر الشيخ": [
    "الهندسة",
    "الطب",
    "الصيدلة",
    "العلوم",
    "التجارة",
    "الزراعة",
    "الطب البيطري",
    "الحاسبات والمعلومات",
    "التربية",
  ],

  "جامعة السويس": [
    "الهندسة",
    "العلوم",
    "التجارة",
    "الآداب",
    "البترول والتعدين",
  ],

  "جامعة بورسعيد": [
    "الهندسة",
    "التجارة",
    "العلوم",
    "التربية",
    "التمريض",
    "الحاسبات والمعلومات",
  ],

  "جامعة دمنهور": [
    "التجارة",
    "العلوم",
    "الآداب",
    "التربية",
    "التمريض",
    "الزراعة",
  ],

  "جامعة بنها": [
    "الهندسة بشبرا",
    "الهندسة ببنها",
    "الطب",
    "الطب البيطري",
    "الصيدلة",
    "العلوم",
    "التجارة",
    "الحقوق",
    "الآداب",
    "التربية",
  ],
};

export default function ProfileScreen() {
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

  /* ================= IMAGE PICKER ================= */
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageFile(result.assets[0]);
    }
  };

  /* ================= LOAD ================= */
  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const snap = await getDoc(doc(db, "userProfiles", user.uid));

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

    load();
  }, [user]);

  if (loading) return <Text>Loading...</Text>;
  if (!user) return <Text>Login required</Text>;

  /* ================= CLOUDINARY ================= */
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();

    formData.append("file", {
      uri: file.uri,
      type: "image/jpeg",
      name: "profile.jpg",
    });

    formData.append("upload_preset", "market_upload");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dkytpqkgd/image/upload",
      { method: "POST", body: formData },
    );

    const data = await res.json();

    if (!data.secure_url) throw new Error("Upload failed");

    return data.secure_url;
  };

  /* ================= SAVE ================= */
  const handleSubmit = async () => {
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
          bio,
          email,
          imageUrl: uploadedImage || DEFAULT_IMAGE,
        },
        { merge: true },
      );

      setSuccessMsg("Profile updated ✅");
      Alert.alert("Success", "Profile saved");
    } catch (err) {
      setErrorMsg("Something went wrong");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Your Profile</Text>

      {/* IMAGE */}
      <Image
        source={{
          uri: imageFile?.uri || imageUrl || DEFAULT_IMAGE,
        }}
        style={styles.image}
      />

      <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
        <Text style={styles.uploadText}>Upload Photo</Text>
      </TouchableOpacity>

      {/* FORM */}
      <View style={styles.card}>
        <TextInput style={styles.input} value={email} editable={false} />

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
        />

        <TextInput
          style={styles.input}
          placeholder="Date of Birth"
          value={dob}
          onChangeText={setDob}
        />

        <TextInput
          style={styles.input}
          placeholder="Student ID"
          value={studentId}
          onChangeText={setStudentId}
        />

        {/* ================= UNIVERSITY DROPDOWN ================= */}
        <Text style={styles.label}>University</Text>
        <View style={styles.pickerBox}>
          <Picker
            selectedValue={university}
            onValueChange={(value) => {
              setUniversity(value);
              setFaculty("");
            }}
          >
            <Picker.Item label="Select University" value="" />
            {Object.keys(universitiesData).map((u) => (
              <Picker.Item key={u} label={u} value={u} />
            ))}
          </Picker>
        </View>

        {/* ================= FACULTY DROPDOWN ================= */}
        <Text style={styles.label}>Faculty</Text>
        <View style={styles.pickerBox}>
          <Picker
            selectedValue={faculty}
            onValueChange={(value) => setFaculty(value)}
            enabled={!!university}
          >
            <Picker.Item label="Select Faculty" value="" />
            {universitiesData[university]?.map((f) => (
              <Picker.Item key={f} label={f} value={f} />
            ))}
          </Picker>
        </View>

        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Bio"
          value={bio}
          onChangeText={setBio}
          multiline
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
          <Text style={styles.saveText}>
            {loadingSubmit ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>

        {successMsg ? <Text style={styles.success}>{successMsg}</Text> : null}
        {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
      </View>
    </ScrollView>
  );
}

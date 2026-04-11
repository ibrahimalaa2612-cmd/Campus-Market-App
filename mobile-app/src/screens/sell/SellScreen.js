import { useState } from "react";
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

import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

import { useAuth } from "../../context/AuthContext";
import { db } from "../../services/firebase";
import styles from "../../styles/sellStyles";

const DEFAULT_IMAGE = "https://i.postimg.cc/FKMdfByG/download.jpg";

/* ================= CLOUDINARY ================= */
const uploadToCloudinary = async (file) => {
  const formData = new FormData();

  formData.append("file", {
    uri: file.uri,
    type: "image/jpeg",
    name: "upload.jpg",
  });

  formData.append("upload_preset", "market_upload");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dkytpqkgd/image/upload",
    {
      method: "POST",
      body: formData,
    },
  );

  const data = await res.json();

  if (!data.secure_url) throw new Error("Upload failed");

  return data.secure_url;
};

/* ================= SCREEN ================= */
export default function SellScreen({ navigation }) {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [mainIndex, setMainIndex] = useState(0);

  const [loading, setLoading] = useState(false);

  const categories = [
    "كل التصنيفات",

    "كتب و مراجع",
    "كتب دراسية",
    "كورسات و تدريب",
    "أدوات مدرسية",

    "أجهزة إلكترونية",
    "موبايلات و تابلت",
    "لابتوبات و كمبيوتر",
    "إكسسوارات إلكترونية",
    "مكونات كمبيوتر",
    "شاشات و أجهزة عرض",

    "ملابس و إكسسوارات",
    "ملابس رجالي",
    "ملابس حريمي",
    "أحذية",
    "حقائب و شنط",
    "ساعات و مجوهرات",

    "أدوات منزلية",
    "أثاث و ديكور",
    "أدوات مطبخ",
    "أجهزة منزلية",
    "تنظيف و مستلزمات منزل",

    "ألعاب فيديو",
    "رياضة و لياقة",
    "مستلزمات رياضية",

    "سيارات و موتوسيكلات",
    "قطع غيار",
    "إكسسوارات سيارات",

    "خدمات",
    "خدمات برمجة",
    "تصميم جرافيك",
    "تسويق إلكتروني",
    "خدمات تعليمية",

    "أخرى",
  ];
  const conditions = ["جديد", "مستعمل", "مستعمل - يشبه الجديد"];

  /* ================= PICK IMAGES ================= */
  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const assets = result.assets;

      setImageFiles([...imageFiles, ...assets]);
      setImagePreviews([...imagePreviews, ...assets.map((a) => a.uri)]);
    }
  };

  const removeImage = (index) => {
    const newFiles = [...imageFiles];
    const newPrev = [...imagePreviews];

    newFiles.splice(index, 1);
    newPrev.splice(index, 1);

    setImageFiles(newFiles);
    setImagePreviews(newPrev);

    if (mainIndex === index) setMainIndex(0);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!user) return Alert.alert("Error", "Login required");

    if (!name || !price || !category || !condition)
      return Alert.alert("Error", "Fill all required fields");

    setLoading(true);

    try {
      const userSnap = await getDoc(doc(db, "userProfiles", user.uid));

      if (!userSnap.exists()) {
        return Alert.alert("Error", "Profile not found");
      }

      const userProfile = userSnap.data();

      let imageUrls = [];

      if (imageFiles.length > 0) {
        imageUrls = await Promise.all(
          imageFiles.map((img) => uploadToCloudinary(img)),
        );
      } else {
        imageUrls = [DEFAULT_IMAGE];
      }

      await addDoc(collection(db, "products"), {
        name,
        price: Number(price),
        description,
        category,
        condition,

        university: userProfile.university,

        images: imageUrls,
        image: imageUrls[mainIndex] || imageUrls[0],

        sellerId: user.uid,
        sellerName: userProfile.fullName,
        sellerEmail: user.email,

        createdAt: serverTimestamp(),
        status: "pending",
        sold: false,
      });

      Alert.alert("Success", "Product posted 🎉");

      /* RESET */
      setName("");
      setPrice("");
      setDescription("");
      setCategory("");
      setCondition("");
      setImageFiles([]);
      setImagePreviews([]);
      setMainIndex(0);

      /* OPTIONAL NAVIGATION */
      // navigation.navigate("Home");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Sell Product</Text>

        <TextInput
          placeholder="Product Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          style={styles.input}
        />

        {/* CATEGORY */}
        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerBox}>
          <Picker selectedValue={category} onValueChange={setCategory}>
            <Picker.Item label="Select Category" value="" />
            {categories.map((c) => (
              <Picker.Item key={c} label={c} value={c} />
            ))}
          </Picker>
        </View>

        {/* CONDITION */}
        <Text style={styles.label}>Condition</Text>
        <View style={styles.pickerBox}>
          <Picker selectedValue={condition} onValueChange={setCondition}>
            <Picker.Item label="Select Condition" value="" />
            {conditions.map((c) => (
              <Picker.Item key={c} label={c} value={c} />
            ))}
          </Picker>
        </View>

        {/* UPLOAD */}
        <TouchableOpacity style={styles.uploadBox} onPress={pickImages}>
          <Text style={{ fontSize: 30 }}>📸</Text>
          <Text style={styles.uploadText}>Upload Product Images</Text>
          <Text style={styles.uploadHint}>Tap to select multiple images</Text>
        </TouchableOpacity>

        {/* PREVIEW */}
        <View style={styles.grid}>
          {imagePreviews.map((img, i) => (
            <View key={i} style={styles.imgBox}>
              <Image source={{ uri: img }} style={styles.img} />

              <TouchableOpacity onPress={() => setMainIndex(i)}>
                <Text style={{ color: "green" }}>
                  {mainIndex === i ? "Main ⭐" : "Set Main"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => removeImage(i)}>
                <Text style={{ color: "red" }}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* SUBMIT */}
        <TouchableOpacity
          style={[styles.submit, loading && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={{ color: "#fff" }}>
            {loading ? "Posting..." : "Post Product"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

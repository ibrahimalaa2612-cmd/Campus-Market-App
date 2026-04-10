import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db, auth, storage } from '../../firebaseConfig';
import { useRouter } from 'expo-router';
import RNPickerSelect from 'react-native-picker-select';

const DEFAULT_IMAGE = "https://firebasestorage.googleapis.com/v0/b/campus-market-d381e.appspot.com/o/defaults%2Fdefault-product.png?alt=media";

export default function AddProductScreen() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const categories = [
    { label: 'أجهزه إلكترونيه', value: 'أجهزه إلكترونيه' },
    { label: 'كتب ومراجع', value: 'كتب ومراجع' },
    { label: 'أدوات منزليه صغيره', value: 'أدوات منزليه صغيره' },
    { label: 'مستلزمات رياضيه', value: 'مستلزمات رياضيه' },
    { label: 'معدات كمبيوتر', value: 'معدات كمبيوتر' },
    { label: 'أدوات مدرسيه', value: 'أدوات مدرسيه' },
    { label: 'ملابس وإكسسوارات', value: 'ملابس وإكسسوارات' },
    { label: 'خدمات', value: 'خدمات' },
    { label: 'أخرى', value: 'أخرى' },
  ];

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string): Promise<string> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `products/${auth.currentUser?.uid}_${Date.now()}`);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  const handleAddProduct = async () => {
    if (!name || !price || !description) {
      Alert.alert('تنبيه', 'يرجى إكمال البيانات الأساسية');
      return;
    }

    setLoading(true);
    try {
      let finalImage = DEFAULT_IMAGE;

      if (imageUri) {
        finalImage = await uploadImage(imageUri);
      }

      const userDoc = await getDoc(doc(db, "userProfiles", auth.currentUser?.uid || ""));
      const userData = userDoc.exists() ? userDoc.data() : {};

      await addDoc(collection(db, 'products'), {
        name,
        price: Number(price),
        description,
        category,
        image: finalImage,
        status: 'pending',
        sellerEmail: auth.currentUser?.email || "",
        sellerName: userData.fullName || "مستخدم",
        sellerPhone: userData.phone || "",
        university: userData.university || "",
        sellerId: auth.currentUser?.uid || "",
        sold: false,
        createdAt: serverTimestamp()
      });

      setName('');
      setPrice('');
      setDescription('');
      setImageUri(null);
      setCategory('');

      Alert.alert('نجاح', 'تم إرسال المنتج للمراجعة بنجاح', [
        { text: 'موافق', onPress: () => router.replace('/(tabs)') }
      ]);

    } catch (error: any) {
      Alert.alert('خطأ', 'حدث خطأ في السيرفر: ' + (error.message || 'خطأ غير معروف'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>إضافة منتج جديد</Text>

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.imagePickerText}>اضغط لاختيار صورة (اختياري)</Text>
        )}
      </TouchableOpacity>

      <TextInput style={styles.input} placeholder="اسم المنتج" value={name} onChangeText={setName} />

      <TextInput style={styles.input} placeholder="السعر (ج.م)" value={price} onChangeText={setPrice} keyboardType="numeric" />

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>اختر التصنيف</Text>
        <RNPickerSelect
          onValueChange={(value) => setCategory(value)}
          items={categories}
          placeholder={{ label: 'اختر تصنيف المنتج...', value: null }}
          style={pickerSelectStyles}
          value={category}
          fixAndroidTouchableBug={true}
          useNativeAndroidPickerStyle={false}
          Icon={() => {
            return <View style={{ backgroundColor: 'transparent', borderTopWidth: 10, borderTopColor: 'gray', borderRightWidth: 10, borderRightColor: 'transparent', borderLeftWidth: 10, borderLeftColor: 'transparent', width: 0, height: 0, marginTop: 15, marginRight: 10 }} />;
          }}
        />
      </View>

      <TextInput style={[styles.input, styles.textArea]} placeholder="وصف المنتج بالتفصيل" value={description} onChangeText={setDescription} multiline />

      <TouchableOpacity style={styles.button} onPress={handleAddProduct} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>إرسال للمراجعة</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6', padding: 20, paddingTop: 60 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50', textAlign: 'center', marginBottom: 20 },
  imagePicker: { width: '100%', height: 200, backgroundColor: '#e0e6ed', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 20, overflow: 'hidden' },
  imagePreview: { width: '100%', height: '100%' },
  imagePickerText: { color: '#7f8c8d', fontSize: 16 },
  input: { width: '100%', backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12, marginBottom: 15, textAlign: 'right', fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  button: { backgroundColor: '#3498db', width: '100%', height: 50, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 10, marginBottom: 40 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  pickerContainer: { marginBottom: 15 },
  label: { fontSize: 14, color: '#555', marginBottom: 5, textAlign: 'right' },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: { fontSize: 16, paddingVertical: 12, paddingHorizontal: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, color: 'black', paddingRight: 30, backgroundColor: '#fff', textAlign: 'right' },
  inputAndroid: { fontSize: 16, paddingHorizontal: 10, paddingVertical: 8, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, color: 'black', paddingRight: 30, backgroundColor: '#fff', textAlign: 'right', height: 50, width: '100%' },
  iconContainer: { top: 10, right: 12 },
});

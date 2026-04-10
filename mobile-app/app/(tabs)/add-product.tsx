import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import { useRouter } from 'expo-router';
import RNPickerSelect from 'react-native-picker-select';

export default function AddProductScreen() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [externalImageUrl, setExternalImageUrl] = useState('');
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

  const handleAddProduct = async () => {
    if (!name || !price || !description) {
      Alert.alert('تنبيه', 'يرجى إكمال البيانات الأساسية');
      return;
    }

    setLoading(true);
    try {
      const finalImage = externalImageUrl || "https://via.placeholder.com/150?text=Campus+Market";

      await addDoc(collection(db, 'products'), {
        name,
        price: Number(price),
        description,
        category: category,
        image: finalImage,
        status: 'pending',
        sellerEmail: auth.currentUser?.email || "student@market.com",
        createdAt: serverTimestamp()
      });

      setName('');
      setPrice('');
      setDescription('');
      setExternalImageUrl('');
      setImageUri(null);

      Alert.alert('نجاح', 'تم إرسال المنتج للمراجعة بنجاح', [
        { 
          text: 'موافق', 
          onPress: () => router.replace('/(tabs)') 
        }
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

      <TextInput
        style={styles.input}
        placeholder="اسم المنتج"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="السعر (ج.م)"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
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
      <TextInput
        style={styles.input}
        placeholder="رابط صورة خارجي (اختياري)"
        value={externalImageUrl}
        onChangeText={setExternalImageUrl}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="وصف المنتج بالتفصيل"
        value={description}
        onChangeText={setDescription}
        multiline
      />

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
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' }});
  const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#fff',
    textAlign: 'right',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#fff',
    textAlign: 'right',
    height: 50, // لازم نحدد طول ثابت هنا
    width: '100%', // وعرض كامل
  },
  iconContainer: {
    top: 10,
    right: 12,
  },
});

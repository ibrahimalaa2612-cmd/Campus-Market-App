import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../../firebaseConfig';
import { useRouter } from 'expo-router';

export default function AddProductScreen() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleAddProduct = async () => {
    if (!name || !price || !description || !imageUri) {
      Alert.alert('تنبيه', 'يرجى إكمال جميع البيانات واختيار صورة');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const imageName = `products/${Date.now()}_${auth.currentUser?.uid}.jpg`;
      const imageRef = ref(storage, imageName);
      
      await uploadBytes(imageRef, blob);
      const imageUrl = await getDownloadURL(imageRef);

      await addDoc(collection(db, 'products'), {
        name,
        price: Number(price),
        description,
        image: imageUrl,
        status: 'pending',
        sellerEmail: auth.currentUser?.email,
        createdAt: serverTimestamp()
      });

      Alert.alert('نجاح', 'تم إرسال المنتج للإدارة، سيتم نشره بعد الموافقة');
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء رفع المنتج');
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
          <Text style={styles.imagePickerText}>اضغط لاختيار صورة للمنتج</Text>
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
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});
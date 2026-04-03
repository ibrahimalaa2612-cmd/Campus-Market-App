import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import { useRouter } from 'expo-router';

export default function AddProductScreen() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [externalImageUrl, setExternalImageUrl] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});
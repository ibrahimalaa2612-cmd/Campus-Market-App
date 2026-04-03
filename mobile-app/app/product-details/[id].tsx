import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useAuth } from '../../constants/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    try {
      const cartData = await AsyncStorage.getItem('cart');
      let cart = cartData ? JSON.parse(cartData) : [];
      const exists = cart.find((item: any) => item.id === product.id);
      
      if (exists) {
        Alert.alert('تنبيه', 'المنتج موجود بالفعل في السلة');
        return;
      }

      cart.push(product);
      await AsyncStorage.setItem('cart', JSON.stringify(cart));
      Alert.alert('تم', 'أضيف المنتج للسلة بنجاح', [
        { text: 'إكمال التسوق', onPress: () => router.push('/(tabs)') },
        { text: 'ذهاب للسلة', onPress: () => router.push('/cart') }
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <View style={styles.container}><Text>جاري التحميل...</Text></View>;
  if (!product) return <View style={styles.container}><Text>المنتج غير موجود</Text></View>;

  const isSold = product.status === 'sold' || product.isSold === true;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.imageUrl }} style={styles.image} />
      <View style={styles.infoSection}>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>{product.price} EGP</Text>
        <Text style={styles.description}>{product.description}</Text>
        
        <View style={styles.divider} />

        {isSold ? (
          <View style={styles.soldBox}>
            <Text style={styles.soldText}>هذا المنتج تم بيعه ولا يمكن التواصل مع البائع</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.addButton} onPress={addToCart}>
            <Text style={styles.addButtonText}>إضافة إلى السلة</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  image: { width: '100%', height: 300, resizeMode: 'cover' },
  infoSection: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50', textAlign: 'right' },
  price: { fontSize: 20, color: '#27ae60', fontWeight: 'bold', marginVertical: 10, textAlign: 'right' },
  description: { fontSize: 16, color: '#7f8c8d', textAlign: 'right', lineHeight: 24 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 20 },
  soldBox: { padding: 15, backgroundColor: '#fdecea', borderRadius: 10 },
  soldText: { color: '#e74c3c', textAlign: 'center', fontWeight: 'bold' },
  addButton: { backgroundColor: '#3498db', padding: 15, borderRadius: 10, alignItems: 'center' },
  addButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
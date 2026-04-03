import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function CartScreen() {
  const [cartItems, setCartItems] = useState([]);
  const router = useRouter();

  const loadCart = async () => {
    const data = await AsyncStorage.getItem('cart');
    if (data) setCartItems(JSON.parse(data));
  };

  useEffect(() => {
    loadCart();
  }, []);

  const removeItem = async (id: string) => {
    const updatedCart = cartItems.filter((item: any) => item.id !== id);
    setCartItems(updatedCart);
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>السلة فارغة</Text>
        <TouchableOpacity style={styles.shopButton} onPress={() => router.push('/(tabs)')}>
          <Text style={styles.shopButtonText}>أكمل التسوق</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>{item.price} EGP</Text>
            </View>
            <TouchableOpacity onPress={() => removeItem(item.id)}>
              <IconSymbol name="trash.fill" size={24} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={styles.footer}>
        <TouchableOpacity style={styles.checkoutButton} onPress={() => router.push('/checkout')}>
          <Text style={styles.checkoutText}>الدفع</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 15 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#7f8c8d', marginBottom: 20 },
  shopButton: { backgroundColor: '#3498db', padding: 15, borderRadius: 10 },
  shopButtonText: { color: '#fff', fontWeight: 'bold' },
  cartItem: { flexDirection: 'row-reverse', backgroundColor: '#fff', padding: 10, borderRadius: 10, marginBottom: 10, alignItems: 'center' },
  itemImage: { width: 60, height: 60, borderRadius: 5 },
  itemDetails: { flex: 1, marginRight: 15 },
  itemName: { fontSize: 16, fontWeight: 'bold', textAlign: 'right' },
  itemPrice: { color: '#27ae60', textAlign: 'right' },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#eee' },
  checkoutButton: { backgroundColor: '#2ecc71', padding: 15, borderRadius: 10, alignItems: 'center' },
  checkoutText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
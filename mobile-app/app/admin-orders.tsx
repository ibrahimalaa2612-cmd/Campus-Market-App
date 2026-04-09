import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // كود لجلب الأوردرات مرتبة بالأحدث
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const renderOrder = ({ item }: { item: any }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderEmail}>العميل: {item.userEmail}</Text>
      <Text style={styles.orderPrice}>الإجمالي: {item.totalPrice} ج.م</Text>
      <Text style={styles.orderStatus}>الحالة: {item.status === 'pending' ? 'قيد الانتظار ⏳' : 'تم التنفيذ ✅'}</Text>
      
      <View style={styles.itemsList}>
        <Text style={{fontWeight: 'bold'}}>المنتجات:</Text>
        {item.items.map((prod: any, index: number) => (
          <Text key={index}>- {prod.name} ({prod.price} ج.م)</Text>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.callButton} 
        onPress={() => Linking.openURL(`tel:${item.phone}`)}
      >
        <Text style={styles.callText}>اتصال بالعميل: {item.phone}</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" color="#3498db" style={{flex:1}} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>طلبات الشراء الواردة</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        ListEmptyComponent={<Text style={styles.empty}>لا يوجد طلبات حالياً</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6', padding: 15 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, color: '#2c3e50' },
  orderCard: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, elevation: 3 },
  orderEmail: { fontSize: 16, fontWeight: 'bold', color: '#34495e' },
  orderPrice: { fontSize: 16, color: '#27ae60', marginVertical: 5 },
  orderStatus: { fontSize: 14, color: '#e67e22', marginBottom: 10 },
  itemsList: { backgroundColor: '#f9f9f9', padding: 10, borderRadius: 8, marginBottom: 10 },
  callButton: { backgroundColor: '#3498db', padding: 10, borderRadius: 8, alignItems: 'center' },
  callText: { color: '#fff', fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#7f8c8d' }
});
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; 
import { useRouter } from 'expo-router';
const Dashboard = () => {
  const [status, setStatus] = useState('pending');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {setLoading(true);
   const q = status === 'all' 
  ? query(collection(db, 'products')) 
  : query(collection(db, 'products'), where('status', '==', status));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(items);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [status]);

  const handleUpdateStatus = async (id, newStatus) => {
    const productRef = doc(db, 'products', id);
    await updateDoc(productRef, { status: newStatus });
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'products', id));
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.productName}>{item.name || 'No Name'}</Text>
      <Text style={styles.price}>{item.price} EGP</Text>
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.btn, styles.approve]} onPress={() => handleUpdateStatus(item.id, 'approved')}>
          <Text style={styles.btnText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.reject]} onPress={() => handleUpdateStatus(item.id, 'rejected')}>
          <Text style={styles.btnText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.delete]} onPress={() => handleDelete(item.id)}>
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingVertical: 10 }}>
  <Text style={styles.header}>لوحة التحكم</Text>
  <TouchableOpacity 
    style={{ backgroundColor: '#2ecc71', padding: 8, borderRadius: 5 }}
    onPress={() => router.replace('/(tabs)')}
  >
    <Text style={{ color: '#fff', fontWeight: 'bold' }}>🛒 المتجر</Text>
  </TouchableOpacity>
</View>
      <TouchableOpacity 
  style={{
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 10,
    alignItems: 'center'
  }} 
  onPress={() => router.push('/admin-orders')}
>
  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
    عرض طلبات الشراء 🛒
  </Text>
  </TouchableOpacity>
      <View style={styles.tabContainer}>
          {['pending', 'approved', 'rejected', 'all'].map((tab) => (
            <TouchableOpacity 
              key={tab} 
              style={[styles.tab, status === tab && styles.activeTab]} 
              onPress={() => setStatus(tab)}
            >
              <Text style={styles.tabText}>{tab.toUpperCase()}</Text>
            </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 10 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginVertical: 20 },
  tabContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  tab: { padding: 8, borderRadius: 5, backgroundColor: '#334155' },
  activeTab: { backgroundColor: '#10b981' },
  tabText: { color: '#fff', fontWeight: 'bold' },
  list: { paddingBottom: 20 },
  card: { backgroundColor: '#1e293b', flex: 1, margin: 5, borderRadius: 10, padding: 10, alignItems: 'center' },
  image: { width: '100%', height: 100, borderRadius: 8, backgroundColor: '#334155' },
  productName: { color: '#fff', marginTop: 10, fontWeight: 'bold' },
  price: { color: '#10b981', marginVertical: 5 },
  statusBadge: { backgroundColor: '#f59e0b', paddingHorizontal: 10, borderRadius: 15 },
  statusText: { fontSize: 12, color: '#000' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, justifyContent: 'center' },
  btn: { padding: 5, margin: 2, borderRadius: 4 },
  approve: { backgroundColor: '#10b981' },
  reject: { backgroundColor: '#ef4444' },
  delete: { backgroundColor: '#64748b' },
  btnText: { color: '#fff', fontSize: 10 }
});
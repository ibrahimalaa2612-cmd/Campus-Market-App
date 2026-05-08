import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, ScrollView,
  TouchableOpacity, ActivityIndicator,
  Linking, StyleSheet
} from 'react-native';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';

const DEFAULT_IMAGE = 'https://i.postimg.cc/FKMdfByG/download.jpg';

export default function SellerProfileScreen({ route, navigation }) {
  const { sellerId } = route.params;
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPhone, setShowPhone] = useState(false);

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const sellerDoc = await getDoc(doc(db, 'userProfiles', sellerId));
        if (sellerDoc.exists()) setSeller(sellerDoc.data());

        const productsSnap = await getDocs(
          query(collection(db, 'products'), where('sellerId', '==', sellerId))
        );
        setProducts(productsSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        const reviewsSnap = await getDocs(
          query(collection(db, 'reviews'), where('targetId', '==', sellerId))
        );
        setReviews(reviewsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSellerData();
  }, [sellerId]);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1, marginTop: 50 }} />;

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : null;

  return (
    <ScrollView style={styles.container}>

      {/* ====== هيدر البائع ====== */}
      <View style={styles.header}>
        <Image source={{ uri: seller?.imageUrl || DEFAULT_IMAGE }} style={styles.avatar} />
        <Text style={styles.name}>{seller?.fullName}</Text>
        <Text style={styles.university}>🏫 {seller?.university || '—'}</Text>

        {avgRating && (
          <Text style={styles.rating}>⭐ {avgRating} / 5 ({reviews.length} تقييم)</Text>
        )}

        <TouchableOpacity
          style={styles.phoneBtn}
          onPress={() => {
            if (showPhone) Linking.openURL(`tel:${seller?.phone}`);
            else setShowPhone(true);
          }}
        >
          <Text style={styles.phoneText}>
            {showPhone ? seller?.phone : 'Show Phone Number'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ====== المنتجات ====== */}
      <Text style={styles.sectionTitle}>المنتجات ({products.length})</Text>
      {products.length === 0 ? (
        <Text style={styles.empty}>لا توجد منتجات</Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 15 }}>
          {products.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.productCard}
              onPress={() => navigation.push('ProductDetail', { id: item.id })}
            >
              <Image
                source={{ uri: item.images?.[0] || item.image || DEFAULT_IMAGE }}
                style={styles.productImg}
              />
              <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.price} EGP</Text>
              {item.sold && <Text style={styles.soldTag}>SOLD</Text>}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* ====== التقييمات ====== */}
      <Text style={styles.sectionTitle}>التقييمات ({reviews.length})</Text>
      {reviews.length === 0 ? (
        <Text style={styles.empty}>لا توجد تقييمات بعد</Text>
      ) : (
        reviews.map(review => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewerName}>{review.reviewerName || 'مجهول'}</Text>
              <Text style={styles.reviewRating}>{'⭐'.repeat(review.rating || 0)}</Text>
            </View>
            {review.comment ? (
              <Text style={styles.reviewComment}>{review.comment}</Text>
            ) : null}
          </View>
        ))
      )}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { alignItems: 'center', padding: 24, backgroundColor: '#fff', marginBottom: 10 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  name: { fontSize: 20, fontWeight: 'bold', color: '#1a1a1a' },
  university: { color: '#666', marginTop: 4 },
  rating: { color: '#f59e0b', fontWeight: 'bold', marginTop: 6, fontSize: 15 },
  phoneBtn: { backgroundColor: '#007BFF', paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8, marginTop: 12 },
  phoneText: { color: '#fff', fontWeight: 'bold' },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', margin: 15, color: '#1a1a1a' },
  empty: { textAlign: 'center', color: '#999', marginBottom: 15 },
  productCard: { width: 150, backgroundColor: '#fff', borderRadius: 10, marginRight: 12, overflow: 'hidden', elevation: 2 },
  productImg: { width: '100%', height: 110 },
  productName: { padding: 6, fontWeight: 'bold', fontSize: 13 },
  productPrice: { paddingHorizontal: 6, color: '#16a34a', fontWeight: 'bold' },
  soldTag: { margin: 6, color: '#fff', backgroundColor: 'red', textAlign: 'center', borderRadius: 4, padding: 2 },
  reviewCard: { backgroundColor: '#fff', marginHorizontal: 15, marginBottom: 10, borderRadius: 10, padding: 14, elevation: 1 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  reviewerName: { fontWeight: 'bold', color: '#1a1a1a' },
  reviewRating: { fontSize: 13 },
  reviewComment: { color: '#444', fontSize: 14 },
});
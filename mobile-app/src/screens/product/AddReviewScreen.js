import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, ScrollView, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  collection, addDoc, serverTimestamp,
  query, where, getDocs, doc, getDoc
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../services/firebase';

export default function AddReviewScreen({ route, navigation }) {
  const { sellerId, productId } = route.params;
  const currentUserId = getAuth().currentUser?.uid;

  const [sellerRating, setSellerRating] = useState(0);
  const [productRating, setProductRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [reviewerName, setReviewerName] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        const profileSnap = await getDoc(doc(db, 'userProfiles', currentUserId));
        if (profileSnap.exists()) {
          setReviewerName(profileSnap.data().fullName || 'مجهول');
        }

        const q = query(
          collection(db, 'reviews'),
          where('reviewerId', '==', currentUserId),
          where('productId', '==', productId)
        );
        const snap = await getDocs(q);
        if (!snap.empty) setAlreadyReviewed(true);
      } catch (err) {
        console.log(err);
      } finally {
        setChecking(false);
      }
    };
    init();
  }, []);

  const submit = async () => {
    if (sellerRating === 0) return Alert.alert("خطأ", "قيّم البائع أولاً");
    if (productRating === 0) return Alert.alert("خطأ", "قيّم المنتج أولاً");

    setLoading(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        reviewerId: currentUserId,
        reviewerName,
        targetId: sellerId,
        sellerId,
        productId,
        sellerRating,
        productRating,
        comment,
        createdAt: serverTimestamp()
      });
      Alert.alert("✅ نجاح", "تم إرسال تقييمك بنجاح");
      navigation.goBack();
    } catch (err) {
      console.log(err);
      Alert.alert("خطأ", "حدث خطأ أثناء الإرسال");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (alreadyReviewed) {
    return (
      <View style={styles.center}>
        <Ionicons name="checkmark-circle" size={60} color="#16a34a" />
        <Text style={styles.alreadyText}>لقد قمت بتقييم هذا المنتج مسبقاً</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>رجوع</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.sectionTitle}>⭐ تقييم البائع</Text>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map(s => (
          <TouchableOpacity key={s} onPress={() => setSellerRating(s)}>
            <Ionicons
              name={s <= sellerRating ? 'star' : 'star-outline'}
              size={38}
              color="#FFD700"
            />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}> تقييم المنتج</Text>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map(s => (
          <TouchableOpacity key={s} onPress={() => setProductRating(s)}>
            <Ionicons
              name={s <= productRating ? 'star' : 'star-outline'}
              size={38}
              color="#FFD700"
            />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>💬 تعليق (اختياري)</Text>
      <TextInput
        placeholder="اكتب رأيك في المنتج هنا..."
        value={comment}
        onChangeText={setComment}
        style={styles.input}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      <TouchableOpacity onPress={submit} style={styles.btn} disabled={loading}>
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.btnText}>إرسال التقييم</Text>
        }
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  stars: { flexDirection: 'row', gap: 10, marginBottom: 5 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 10,
    padding: 12, fontSize: 15, minHeight: 100, marginTop: 5
  },
  btn: {
    backgroundColor: '#007BFF', padding: 15, borderRadius: 10,
    alignItems: 'center', marginTop: 25
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 15 },
  alreadyText: { fontSize: 16, color: '#444', marginTop: 10 },
  backBtn: {
    backgroundColor: '#007BFF', paddingVertical: 10,
    paddingHorizontal: 30, borderRadius: 8, marginTop: 10
  },
});
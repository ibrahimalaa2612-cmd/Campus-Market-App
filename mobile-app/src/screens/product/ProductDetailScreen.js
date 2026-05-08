import { useEffect, useState } from "react";
import {
  ActivityIndicator, Image, ScrollView,
  Text, TouchableOpacity, View, Linking
} from "react-native";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../services/firebase";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../styles/productDetailStyles";

export default function ProductDetailScreen({ route, navigation }) {
  const { id } = route.params;

  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showPhone, setShowPhone] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const currentUserId = auth.currentUser?.uid;
  const DEFAULT_IMAGE = "https://i.postimg.cc/FKMdfByG/download.jpg";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snap = await getDoc(doc(db, "products", id));
        if (!snap.exists()) return;
        const data = snap.data();
        setProduct(data);

        if (data.sellerId) {
          const sellerSnap = await getDoc(doc(db, "userProfiles", data.sellerId));
          if (sellerSnap.exists()) setSeller(sellerSnap.data());
        }

        const reviewsSnap = await getDocs(
          query(collection(db, "reviews"), where("productId", "==", id))
        );
        const reviewsData = reviewsSnap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(r => r.comment && r.comment.trim() !== '');
        setReviews(reviewsData);

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.loading}>
        <Text>Product not found</Text>
      </View>
    );
  }

  const images =
    product.images?.length > 0
      ? product.images
      : product.image ? [product.image] : [];

  const avgProductRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (r.productRating || 0), 0) / reviews.length).toFixed(1)
    : null;

  return (
    <ScrollView style={styles.container}>

      {/* ====== الصور ====== */}
      <View style={styles.imageBox}>
        <Image
          source={{ uri: images[currentImage] || DEFAULT_IMAGE }}
          style={styles.mainImage}
        />
        {images.length > 1 && (
          <>
            <TouchableOpacity
              style={[styles.arrow, styles.left]}
              onPress={() => setCurrentImage(p => p === 0 ? images.length - 1 : p - 1)}
            >
              <Text style={styles.arrowText}>‹</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.arrow, styles.right]}
              onPress={() => setCurrentImage(p => p === images.length - 1 ? 0 : p + 1)}
            >
              <Text style={styles.arrowText}>›</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* ====== معلومات المنتج ====== */}
      <View style={styles.box}>
        <Text style={styles.price}>{product.price} EGP</Text>
        <Text style={styles.title}>{product.name}</Text>
        {avgProductRating && (
          <Text style={{ color: '#f59e0b', fontWeight: 'bold', marginTop: 4 }}>
            ⭐ {avgProductRating} / 5
          </Text>
        )}
        <Text style={styles.meta}>🏫 {seller?.university || "—"}</Text>
        <Text style={styles.meta}>
          📅 {product.createdAt?.toDate?.().toDateString?.() || ""}
        </Text>
        <View style={styles.tags}>
          <Text style={styles.tag}>{product.category}</Text>
          <Text style={styles.tag}>{product.condition}</Text>
        </View>
      </View>

      {/* ====== الوصف ====== */}
      <View style={styles.box}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{product.description}</Text>
      </View>

      {/* ====== البائع ====== */}
      <View style={[styles.box, styles.sellerBox]}>
        <TouchableOpacity
          onPress={() => navigation.navigate('SellerProfile', { sellerId: product.sellerId })}
          style={{ alignItems: 'center', width: '100%' }}
        >
          <Image
            source={{ uri: seller?.imageUrl || DEFAULT_IMAGE }}
            style={styles.sellerImg}
          />
          <Text style={styles.sellerName}>{seller?.fullName}</Text>
          <Text style={{ color: '#007BFF', marginTop: 4, marginBottom: 8 }}>
            عرض صفحة البائع ←
          </Text>
        </TouchableOpacity>

        <Text style={styles.sellerMeta}>Member</Text>

        {!product.sold ? (
          <TouchableOpacity
            style={styles.phoneBtn}
            onPress={() => {
              if (showPhone && seller?.phone) Linking.openURL(`tel:${seller.phone}`);
              else setShowPhone(true);
            }}
          >
            <Text style={styles.phoneText}>
              {showPhone ? seller?.phone : "Show Phone Number"}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.sold}>SOLD</Text>
        )}

        {currentUserId !== product.sellerId && (
          <TouchableOpacity
            style={{
              backgroundColor: '#007BFF', padding: 15, borderRadius: 10,
              marginTop: 15, width: '100%', alignItems: 'center'
            }}
            onPress={() => navigation.navigate('AddReview', {
              sellerId: product.sellerId,
              productId: id
            })}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
              تقييم البائع والمنتج
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ====== تعليقات المنتج ====== */}
      {reviews.length > 0 && (
        <View style={styles.box}>
          <Text style={styles.sectionTitle}>
            💬 تعليقات المشترين ({reviews.length})
          </Text>
          {reviews.map(review => (
            <View key={review.id} style={{
              borderTopWidth: 1, borderTopColor: '#f0f0f0',
              paddingTop: 12, marginTop: 12
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={{ fontWeight: 'bold', color: '#1a1a1a' }}>
                  {review.reviewerName || 'مجهول'}
                </Text>
                <Text style={{ color: '#f59e0b' }}>
                  {'⭐'.repeat(review.productRating || 0)}
                </Text>
              </View>
              <Text style={{ color: '#444', fontSize: 14 }}>{review.comment}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}
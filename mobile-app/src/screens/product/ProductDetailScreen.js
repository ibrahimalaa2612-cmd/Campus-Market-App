import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";

import styles from "../../styles/productDetailStyles";

export default function ProductDetailScreen({ route }) {
  const { id } = route.params;

  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [showPhone, setShowPhone] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(true);

  const DEFAULT_IMAGE = "https://i.postimg.cc/FKMdfByG/download.jpg";

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const snap = await getDoc(doc(db, "products", id));

        if (!snap.exists()) return;

        const data = snap.data();
        setProduct(data);

        if (data.sellerId) {
          const sellerSnap = await getDoc(
            doc(db, "userProfiles", data.sellerId),
          );

          if (sellerSnap.exists()) {
            setSeller(sellerSnap.data());
          }
        }
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
      : product.image
        ? [product.image]
        : [];

  const nextImage = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <ScrollView style={styles.container}>
      {/* ================= IMAGE SLIDER ================= */}
      <View style={styles.imageBox}>
        <Image
          source={{
            uri: images[currentImage] || DEFAULT_IMAGE,
          }}
          style={styles.mainImage}
        />

        {images.length > 1 && (
          <>
            <TouchableOpacity
              style={[styles.arrow, styles.left]}
              onPress={prevImage}
            >
              <Text style={styles.arrowText}>‹</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.arrow, styles.right]}
              onPress={nextImage}
            >
              <Text style={styles.arrowText}>›</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* ================= INFO ================= */}
      <View style={styles.box}>
        <Text style={styles.price}>{product.price} EGP</Text>

        <Text style={styles.title}>{product.name}</Text>

        <Text style={styles.meta}>🏫 {seller?.university || "—"}</Text>

        <Text style={styles.meta}>
          📅 {product.createdAt?.toDate?.().toDateString?.() || ""}
        </Text>

        <View style={styles.tags}>
          <Text style={styles.tag}>{product.category}</Text>
          <Text style={styles.tag}>{product.condition}</Text>
        </View>
      </View>

      {/* ================= DESCRIPTION ================= */}
      <View style={styles.box}>
        <Text style={styles.sectionTitle}>Description</Text>

        <Text style={styles.description}>{product.description}</Text>
      </View>

      {/* ================= SELLER ================= */}
      <View style={[styles.box, styles.sellerBox]}>
        <Image
          source={{
            uri: seller?.imageUrl || DEFAULT_IMAGE,
          }}
          style={styles.sellerImg}
        />

        <Text style={styles.sellerName}>{seller?.fullName}</Text>

        <Text style={styles.sellerMeta}>Member</Text>

        {!product.sold ? (
          <TouchableOpacity
            style={styles.phoneBtn}
            onPress={() => setShowPhone(!showPhone)}
          >
            <Text style={styles.phoneText}>
              {showPhone ? seller?.phone : "Show Phone Number"}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.sold}>SOLD</Text>
        )}
      </View>
    </ScrollView>
  );
}

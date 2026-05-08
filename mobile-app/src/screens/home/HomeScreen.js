import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../services/firebase";
import { Ionicons } from '@expo/vector-icons';
import BottomNavbar from "../../components/BottomNavbar";
import styles from "../../styles/homeStyles";

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("كل التصنيفات");
  const [sortBy, setSortBy] = useState("الأحدث");
  const [refreshing, setRefreshing] = useState(false);
  const [productRatings, setProductRatings] = useState({});
  const [sellerRatings, setSellerRatings] = useState({});

  const DEFAULT_IMAGE = "https://i.postimg.cc/FKMdfByG/download.jpg";

  const categories = [
    "كل التصنيفات", "كتب و مراجع", "كتب دراسية", "كورسات و تدريب", 
    "أدوات مدرسية", "أجهزة إلكترونية", "موبايلات و تابلت", "لابتوبات و كمبيوتر", 
    "إكسسوارات إلكترونية", "مكونات كمبيوتر", "شاشات و أجهزة عرض", "ملابس و إكسسوارات", 
    "أدوات منزلية", "ألعاب فيديو", "رياضة و لياقة", "سيارات و موتوسيكلات", "خدمات", "أخرى",
  ];

  const sortOptions = ["الأحدث", "الأقدم", "تقييم المنتج", "تقييم البائع"];

  const fetchProducts = async () => {
    try {
      const snapshot = await getDocs(collection(db, "products"));
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(items);
      fetchRatings(items);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchRatings = async (items) => {
    const pRatings = {};
    const sRatings = {};
    const uniqueSellers = [...new Set(items.map(i => i.sellerId))];

    for (const item of items) {
      try {
        const q = query(collection(db, 'reviews'), where('targetId', '==', item.id));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const total = snap.docs.reduce((acc, doc) => acc + (doc.data().rating || 0), 0);
          pRatings[item.id] = (total / snap.size).toFixed(1);
        } else {
          pRatings[item.id] = "0.0";
        }
      } catch (err) {
        pRatings[item.id] = "0.0";
      }
    }

    for (const sId of uniqueSellers) {
      if (!sId) continue;
      try {
        const q = query(collection(db, 'reviews'), where('targetId', '==', sId));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const total = snap.docs.reduce((acc, doc) => acc + (doc.data().rating || 0), 0);
          sRatings[sId] = (total / snap.size).toFixed(1);
        } else {
          sRatings[sId] = "0.0";
        }
      } catch (err) {
        sRatings[sId] = "0.0";
      }
    }

    setProductRatings(pRatings);
    setSellerRatings(sRatings);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchProducts();
    } catch (err) {
      console.log(err);
    } finally {
      setRefreshing(false);
    }
  };

  const getTime = (timestamp) => {
    return timestamp?.toDate ? timestamp.toDate().getTime() : 0;
  };

  const filteredProducts = useMemo(() => {
    let items = products.filter((p) => p.status === "approved" && !p.sold);

    if (search.trim()) {
      items = items.filter((p) =>
        p.name?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (category && category !== "كل التصنيفات") {
      items = items.filter((p) => p.category === category);
    }

    items.sort((a, b) => {
      if (sortBy === "الأحدث") {
        return getTime(b.createdAt) - getTime(a.createdAt);
      } else if (sortBy === "الأقدم") {
        return getTime(a.createdAt) - getTime(b.createdAt);
      } else if (sortBy === "تقييم المنتج") {
        const ratingA = parseFloat(productRatings[a.id]) || 0;
        const ratingB = parseFloat(productRatings[b.id]) || 0;
        return ratingB - ratingA;
      } else if (sortBy === "تقييم البائع") {
        const ratingA = parseFloat(sellerRatings[a.sellerId]) || 0;
        const ratingB = parseFloat(sellerRatings[b.sellerId]) || 0;
        return ratingB - ratingA;
      }
      return 0;
    });

    return items;
  }, [products, search, category, sortBy, productRatings, sellerRatings]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "—";
    try {
      return timestamp.toDate().toDateString();
    } catch {
      return "—";
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("ProductDetail", {
          id: item.id,
        })
      }
    >
      <Image
        source={{
          uri: item.image || DEFAULT_IMAGE,
        }}
        style={styles.image}
      />

      <View style={styles.cardBody}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.price}>{item.price} EGP</Text>
        <Text style={styles.meta}>🏫 {item.university || "Unknown University"}</Text>
        <Text style={styles.meta}>📅 {formatDate(item.createdAt)}</Text>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={{ fontSize: 12, marginLeft: 4 }}>{productRatings[item.id] || "0.0"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Latest Products</Text>
        <Text style={styles.subtitle}>Discover what students are selling</Text>
        <TextInput
          placeholder="Search..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.filterWrapper}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setCategory(item)}
              style={[
                styles.categoryBtn,
                category === item && styles.categoryBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  category === item && styles.categoryTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={{ paddingHorizontal: 10, paddingBottom: 10 }}>
        <FlatList
          horizontal
          data={sortOptions}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSortBy(item)}
              style={[
                styles.categoryBtn,
                sortBy === item && styles.categoryBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  sortBy === item && styles.categoryTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{
          padding: 15,
          paddingBottom: 90,
        }}
        ListEmptyComponent={
          <Text style={styles.empty}>No products found </Text>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <BottomNavbar navigation={navigation} />
    </View>
  );
}

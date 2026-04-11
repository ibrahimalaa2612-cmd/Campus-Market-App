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

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/firebase";

import BottomNavbar from "../../components/BottomNavbar";
import styles from "../../styles/homeStyles";

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("كل التصنيفات");

  const [refreshing, setRefreshing] = useState(false);

  const DEFAULT_IMAGE = "https://i.postimg.cc/FKMdfByG/download.jpg";

  const categories = [
    "كل التصنيفات",
    "كتب و مراجع",
    "كتب دراسية",
    "كورسات و تدريب",
    "أدوات مدرسية",
    "أجهزة إلكترونية",
    "موبايلات و تابلت",
    "لابتوبات و كمبيوتر",
    "إكسسوارات إلكترونية",
    "مكونات كمبيوتر",
    "شاشات و أجهزة عرض",
    "ملابس و إكسسوارات",
    "أدوات منزلية",
    "ألعاب فيديو",
    "رياضة و لياقة",
    "سيارات و موتوسيكلات",
    "خدمات",
    "أخرى",
  ];

  /* ================= FETCH ================= */
  const fetchProducts = async () => {
    try {
      const snapshot = await getDocs(collection(db, "products"));

      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(items);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ================= REFRESH ================= */
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

  /* ================= FILTER ================= */
  const filteredProducts = useMemo(() => {
    let items = products.filter((p) => p.status === "approved");

    if (search.trim()) {
      items = items.filter((p) =>
        p.name?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (category && category !== "كل التصنيفات") {
      items = items.filter((p) => p.category === category);
    }

    return items;
  }, [products, search, category]);

  /* ================= DATE ================= */
  const formatDate = (timestamp) => {
    if (!timestamp) return "—";

    try {
      return timestamp.toDate().toDateString();
    } catch {
      return "—";
    }
  };

  /* ================= CARD ================= */
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

        <Text style={styles.meta}>
          🏫 {item.university || "Unknown University"}
        </Text>

        <Text style={styles.meta}>📅 {formatDate(item.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
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

      {/* FILTERS */}
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

      {/* PRODUCTS */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{
          padding: 15,
          paddingBottom: 90,
        }}
        ListEmptyComponent={
          <Text style={styles.empty}>No products found 😢</Text>
        }
        /* 🔥 PULL TO REFRESH */
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {/* NAVBAR */}
      <BottomNavbar navigation={navigation} />
    </View>
  );
}

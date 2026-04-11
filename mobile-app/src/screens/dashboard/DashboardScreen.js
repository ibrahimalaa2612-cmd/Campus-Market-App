import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../services/firebase";
import styles from "../../styles/dashboardStyles";

import { SafeAreaView } from "react-native-safe-area-context";

export default function DashboardScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("pending");
  const [search, setSearch] = useState("");

  const DEFAULT_IMAGE = "https://i.postimg.cc/FKMdfByG/download.jpg";

  /* ================= FETCH ================= */
  const fetchProducts = async () => {
    setLoading(true);

    try {
      const snap = await getDocs(collection(db, "products"));

      const items = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        status: d.data().status || "pending",
      }));

      setProducts(items);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ================= ACTIONS ================= */
  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, "products", id), { status });
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, "products", id));
    fetchProducts();
  };

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
    return products
      .filter((p) => (activeTab === "all" ? true : p.status === activeTab))
      .filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()));
  }, [products, activeTab, search]);

  /* ================= CARD ================= */
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.image || DEFAULT_IMAGE }}
        style={styles.image}
      />

      <View style={styles.body}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.price}>{item.price} EGP</Text>

        <Text style={[styles.status, styles[item.status]]}>{item.status}</Text>

        {/* ACTIONS */}
        <View style={styles.actions}>
          {item.status === "pending" && (
            <>
              <TouchableOpacity
                style={[styles.btn, styles.green]}
                onPress={() => updateStatus(item.id, "approved")}
              >
                <Text style={styles.btnText}>Accept</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, styles.red]}
                onPress={() => updateStatus(item.id, "rejected")}
              >
                <Text style={styles.btnText}>Reject</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={[styles.btn, styles.gray]}
            onPress={() => deleteProduct(item.id)}
          >
            <Text style={styles.btnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <Text style={styles.header}>Admin Dashboard</Text>

      {/* TABS */}
      <View style={styles.tabs}>
        {["pending", "approved", "rejected", "all"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* SEARCH */}
      <TextInput
        placeholder="Search product..."
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      {/* LIST */}
      {loading ? (
        <ActivityIndicator size="large" color="#16a34a" />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.empty}>No products found</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

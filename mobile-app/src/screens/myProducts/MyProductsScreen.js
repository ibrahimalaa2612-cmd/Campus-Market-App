import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
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

import { useAuth } from "../../context/AuthContext";
import { db } from "../../services/firebase";

import styles from "../../styles/MyProductsStyles";

const DEFAULT_IMAGE = "https://i.postimg.cc/FKMdfByG/download.jpg";

export default function MyProducts() {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
  });

  /* ================= FETCH ================= */
  const fetchProducts = async () => {
    setLoading(true);

    try {
      const snap = await getDocs(collection(db, "products"));

      const items = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter(
          (p) =>
            p.sellerId === user.uid &&
            (p.status === "approved" || p.status === "rejected"),
        );

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

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "products", id));
    fetchProducts();
  };

  /* ================= SOLD ================= */
  const handleSold = async (id) => {
    await updateDoc(doc(db, "products", id), { sold: true });
    fetchProducts();
  };

  /* ================= OPEN MODAL ================= */
  const openModal = (item) => {
    setSelected(item);
    setForm({
      name: item.name,
      price: item.price.toString(),
      description: item.description,
    });
    setModalVisible(true);
  };

  const handleUpdate = async () => {
    await updateDoc(doc(db, "products", selected.id), {
      name: form.name,
      price: Number(form.price),
      description: form.description,
      status: "pending",
    });

    setModalVisible(false);
    fetchProducts();
  };

  /* ================= CARD ================= */
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.sold && <Text style={styles.badge}>SOLD</Text>}

      <Image
        source={{ uri: item.image || DEFAULT_IMAGE }}
        style={styles.image}
      />

      <View style={styles.body}>
        <Text style={styles.title}>{item.name}</Text>

        <Text style={styles.price}>{item.price} EGP</Text>

        <Text style={styles.meta}>{item.category}</Text>
        <Text style={styles.meta}>{item.condition}</Text>

        <View style={styles.actions}>
          {!item.sold && (
            <>
              <TouchableOpacity
                style={[styles.btn, styles.green]}
                onPress={() => handleSold(item.id)}
              >
                <Text style={styles.btnText}>Sold</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, styles.blue]}
                onPress={() => openModal(item)}
              >
                <Text style={styles.btnText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, styles.red]}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Products</Text>

      {loading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      )}

      {/* ================= MODAL ================= */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Edit Product</Text>

            <TextInput
              value={form.name}
              onChangeText={(t) => setForm({ ...form, name: t })}
              style={styles.input}
              placeholder="Name"
            />

            <TextInput
              value={form.price}
              onChangeText={(t) => setForm({ ...form, price: t })}
              style={styles.input}
              placeholder="Price"
            />

            <TextInput
              value={form.description}
              onChangeText={(t) => setForm({ ...form, description: t })}
              style={[styles.input, styles.textarea]}
              placeholder="Description"
              multiline
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.btn, styles.green]}
                onPress={handleUpdate}
              >
                <Text style={styles.btnText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, styles.red]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

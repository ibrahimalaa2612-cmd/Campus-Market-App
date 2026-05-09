import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCart } from "../../context/CartContext";

const DEFAULT_IMAGE = "https://i.postimg.cc/FKMdfByG/download.jpg";

export default function CartScreen({ navigation }) {
  const { cart, cartLoading, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems } =
    useCart();

  if (cartLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  if (cart.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons name="cart-outline" size={64} color="#d1d5db" />
        <Text style={styles.emptyText}>السلة فارغة</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => navigation.navigate("ProductDetail", { id: item.id })}>
        <Image
          source={{ uri: item.image || DEFAULT_IMAGE }}
          style={styles.image}
          onError={(e) => (e.target.src = DEFAULT_IMAGE)}
        />
      </TouchableOpacity>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.price}>{item.price} EGP</Text>
        <Text style={styles.seller}>{item.sellerName}</Text>

        <View style={styles.qtyRow}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <Ionicons name="remove" size={16} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.qty}>{item.quantity}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.deleteBtn} onPress={() => removeFromCart(item.id)}>
        <Ionicons name="trash-outline" size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 160 }}
      />

      {/* ── Summary ── */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>عدد المنتجات</Text>
          <Text style={styles.summaryValue}>{totalItems}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>الإجمالي</Text>
          <Text style={styles.summaryTotal}>{totalPrice} EGP</Text>
        </View>
        <TouchableOpacity style={styles.clearBtn} onPress={clearCart}>
          <Ionicons name="trash" size={16} color="#fff" />
          <Text style={styles.clearText}>مسح السلة</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6fb" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  emptyText: { fontSize: 16, color: "#9ca3af" },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 12,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  image: { width: 80, height: 80, borderRadius: 10, backgroundColor: "#f3f4f6" },
  info: { flex: 1, marginHorizontal: 12 },
  name: { fontSize: 14, fontWeight: "600", color: "#111827", marginBottom: 4 },
  price: { fontSize: 15, fontWeight: "700", color: "#16a34a", marginBottom: 2 },
  seller: { fontSize: 12, color: "#6b7280", marginBottom: 8 },

  qtyRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  qtyBtn: {
    backgroundColor: "#16a34a",
    borderRadius: 6,
    padding: 4,
  },
  qty: { fontSize: 15, fontWeight: "700", color: "#111827", minWidth: 20, textAlign: "center" },

  deleteBtn: { padding: 8 },

  summary: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  summaryLabel: { fontSize: 14, color: "#6b7280" },
  summaryValue: { fontSize: 14, fontWeight: "600", color: "#111827" },
  summaryTotal: { fontSize: 18, fontWeight: "700", color: "#16a34a" },
  clearBtn: {
    flexDirection: "row",
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  clearText: { color: "#fff", fontWeight: "600", fontSize: 14 },
});
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useAuth } from "../context/AuthContext";

export default function BottomNavbar() {
  const navigation = useNavigation();
  const { role, logout } = useAuth();

  const [openMenu, setOpenMenu] = useState(false);

  const isAdmin = role === "admin";

  const handleLogout = async () => {
    try {
      await logout();

      setOpenMenu(false);
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (err) {
      Alert.alert("Error", "Logout failed");
    }
  };

  return (
    <>
      {/* DROPUP MENU */}
      {openMenu && (
        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setOpenMenu(false);
              navigation.navigate("Profile");
            }}
          >
            <Ionicons name="person" size={18} color="#111" />
            <Text style={styles.menuText}>Profile</Text>
          </TouchableOpacity>

          {isAdmin && (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setOpenMenu(false);
                navigation.navigate("Dashboard");
              }}
            >
              <Ionicons name="grid" size={18} color="#111" />
              <Text style={styles.menuText}>Dashboard</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Ionicons name="log-out" size={18} color="red" />
            <Text style={[styles.menuText, { color: "red" }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* NAVBAR */}
      <View style={styles.navbar}>
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="home" size={24} color="#16a34a" />
          <Text style={styles.text}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate("Sell")}
        >
          <Ionicons name="add-circle" size={28} color="#16a34a" />
          <Text style={styles.text}>Sell</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate("MyProducts")}
        >
          <Ionicons name="list" size={24} color="#16a34a" />
          <Text style={styles.text}>My Ads</Text>
        </TouchableOpacity>

        {/* SETTINGS */}
        <TouchableOpacity
          style={styles.item}
          onPress={() => setOpenMenu(!openMenu)}
        >
          <Ionicons name="settings" size={24} color="#16a34a" />
          <Text style={styles.text}>Settings</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 70,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",

    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },

  item: {
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    fontSize: 11,
    color: "#374151",
    marginTop: 2,
  },

  /* DROPUP MENU */
  menu: {
    position: "absolute",
    bottom: 80,
    right: 10,

    width: 160,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 12,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
  },

  menuText: {
    fontSize: 13,
    color: "#111",
  },
});

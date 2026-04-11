import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export default function BottomNavbar({ navigation }) {
  return (
    <View style={styles.navbar}>
      {/* HOME */}
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate("Home")}
      >
        <Ionicons name="home" size={24} color="#16a34a" />
        <Text style={styles.text}>Home</Text>
      </TouchableOpacity>

      {/* SELL */}
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate("Sell")}
      >
        <Ionicons name="add-circle" size={26} color="#16a34a" />
        <Text style={styles.text}>Sell</Text>
      </TouchableOpacity>

      {/* MY ADS */}
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate("MyProducts")}
      >
        <Ionicons name="list" size={24} color="#16a34a" />
        <Text style={styles.text}>My Ads</Text>
      </TouchableOpacity>

      {/* PROFILE */}
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate("Profile")}
      >
        <Ionicons name="person" size={24} color="#16a34a" />
        <Text style={styles.text}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",

    height: 65,
    backgroundColor: "#fff",

    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",

    position: "absolute",
    bottom: 0,
    width: "100%",
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
};

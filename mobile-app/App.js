import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

/* 🔐 AUTH CONTEXT */
import { AuthProvider } from "./src/context/AuthContext";

/* AUTH SCREENS */
import LoginScreen from "./src/screens/auth/LoginScreen";
import RegisterScreen from "./src/screens/auth/RegisterScreen";

/* MAIN SCREENS */
import DashboardScreen from "./src/screens/dashboard/DashboardScreen";
import HomeScreen from "./src/screens/home/HomeScreen";
import MyProductsScreen from "./src/screens/myProducts/MyProductsScreen";
import ProductDetailScreen from "./src/screens/product/ProductDetailScreen";
import ProfileScreen from "./src/screens/profile/ProfileScreen";
import SellScreen from "./src/screens/sell/SellScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#fff",
            },
            headerShadowVisible: false,
          }}
        >
          {/* ================= AUTH ================= */}
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />

          {/* ================= MAIN APP ================= */}
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Sell"
            component={SellScreen}
            options={{
              title: "Sell Product",
              headerBackTitleVisible: false,
            }}
          />

          <Stack.Screen
            name="ProductDetail"
            component={ProductDetailScreen}
            options={{
              title: "Product Details",
              headerBackTitleVisible: false,
            }}
          />

          <Stack.Screen
            name="MyProducts"
            component={MyProductsScreen}
            options={{
              title: "My Ads",
              headerBackTitleVisible: false,
            }}
          />

          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              title: "Profile",
              headerBackTitleVisible: false,
            }}
          />

          {/* ================= ADMIN ONLY ================= */}
          <Stack.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{
              headerShown: false,
              presentation: "modal", // شكل أنضف للـ admin panel
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

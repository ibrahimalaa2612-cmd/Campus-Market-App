import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider } from "./src/context/AuthContext";
import { CartProvider } from "./src/context/CartContext";
import LoginScreen from "./src/screens/auth/LoginScreen";
import RegisterScreen from "./src/screens/auth/RegisterScreen";
import SellerProfileScreen from "./src/screens/profile/SellerProfileScreen";
import DashboardScreen from "./src/screens/dashboard/DashboardScreen";
import HomeScreen from "./src/screens/home/HomeScreen";
import MyProductsScreen from "./src/screens/myProducts/MyProductsScreen";
import ProductDetailScreen from "./src/screens/product/ProductDetailScreen";
import AddReviewScreen from "./src/screens/product/AddReviewScreen";
import ProfileScreen from "./src/screens/profile/ProfileScreen";
import SellScreen from "./src/screens/sell/SellScreen";
import ChatBotScreen from "./src/screens/chat/ChatBotScreen";
import CartScreen from "./src/screens/cart/CartScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerTitleAlign: "center",
              headerStyle: { backgroundColor: "#fff" },
              headerShadowVisible: false,
            }}
          >
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Sell" component={SellScreen} options={{ title: "Sell Product", headerBackTitleVisible: false }} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: "Product Details", headerBackTitleVisible: false }} />
            <Stack.Screen name="AddReview" component={AddReviewScreen} options={{ title: "إضافة تقييم", headerBackTitleVisible: false }} />
            <Stack.Screen name="MyProducts" component={MyProductsScreen} options={{ title: "My Ads", headerBackTitleVisible: false }} />
            <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: "Profile", headerBackTitleVisible: false }} />
            <Stack.Screen name="SellerProfile" component={SellerProfileScreen} options={{ title: "Seller Profile", headerBackTitleVisible: false }} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false, presentation: "modal" }} />
            <Stack.Screen name="ChatBot" component={ChatBotScreen} options={{ title: "المساعد الذكي", headerBackTitleVisible: false }} />
            <Stack.Screen name="Cart" component={CartScreen} options={{ title: "سلة التسوق", headerBackTitleVisible: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </CartProvider>
    </AuthProvider>
  );
}
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { NavigationContainer } from "@react-navigation/native"
import { useAuth } from "../constants/AuthContext"
//import Home from "../app/Home.tsx"
//import AdminDashboard from "../screens/AdminDashboard.tsx"
import Login from "../app/login.tsx"

const Stack = createNativeStackNavigator()

export default function Navigation() {
  const { user, role } = useAuth()

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <Stack.Screen name="Login" component={Login} />
        ) : role === "admin" ? (
         {/* <Stack.Screen name="AdminDashboard" component={AdminDashboard} />*/}
        ) : (
          {/*<Stack.Screen name="Home" component={Home} />*/}
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
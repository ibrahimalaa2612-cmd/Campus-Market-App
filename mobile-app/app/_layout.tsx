import { useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig'; 
import { useColorScheme } from '@/hooks/use-color-scheme';
import 'react-native-reanimated';
import { AuthProvider } from '../constants/AuthContext'; // سطر 9 الجديد

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, (user: any) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });
    return subscriber;
  }, []);

  useEffect(() => {
    if (initializing) return;
    const currentSegment = segments[0] as string;
    const inAuthGroup = currentSegment === 'login' || currentSegment === 'Register' || currentSegment === 'forgot-password';

    if (!user && !inAuthGroup) {
      router.replace('/login');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, initializing, segments]);

  if (initializing) return null;

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="forgot-password" options={{ presentation: 'modal' }} />
          <Stack.Screen name="change-password" />
          <Stack.Screen name="Register" />
          <Stack.Screen name="product-details/[id]" options={{ headerShown: true, title: 'تفاصيل المنتج' }} />
          <Stack.Screen name="cart" options={{ headerShown: true, title: 'سلة المشتريات' }} />
          <Stack.Screen name="checkout" options={{ headerShown: true, title: 'إتمام الدفع' }} />
          {/* سطر الداشبورد الجديد جوه الـ Stack */}
          <Stack.Screen name="dashboard" options={{ headerShown: true, title: 'لوحة التحكم' }} />
          <Stack.Screen name="admin-orders" options={{ headerShown: true, title: 'طلبات العملاء' }} />
          </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
  }

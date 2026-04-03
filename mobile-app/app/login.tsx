import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      Alert.alert("تنبيه", "الرجاء إدخال الإيميل أولاً.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      Alert.alert("تنبيه", "صيغة الإيميل غير صحيحة، تأكد إنك كاتبه بشكل صحيح.");
      return;
    }

    if (!password) {
      Alert.alert("تنبيه", "الرجاء إدخال كلمة المرور.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
      const user = userCredential.user;

      const adminDoc = await getDoc(doc(db, "admins", user.email));
      
      if (adminDoc.exists() && adminDoc.data().role === "admin") {
        Alert.alert("نجاح", "تم تسجيل الدخول كمسؤول");
        router.push('/admin/dashboard'); 
      } else {
        router.push('/'); 
      }

    } catch (error) {
      switch (error.code) {
        case 'auth/user-not-found':
          Alert.alert("خطأ في الإيميل", "هذا الإيميل غير مسجل لدينا، تأكد منه أو قم بإنشاء حساب.");
          break;
        case 'auth/wrong-password':
          Alert.alert("خطأ في كلمة المرور", "كلمة المرور التي أدخلتها غير صحيحة، حاول مرة أخرى.");
          break;
        case 'auth/invalid-email':
          Alert.alert("خطأ", "صيغة البريد الإلكتروني غير صحيحة.");
          break;
        case 'auth/invalid-credential':
          Alert.alert("بيانات خاطئة", "الإيميل أو كلمة المرور غير صحيحة.");
          break;
        case 'auth/too-many-requests':
          Alert.alert("تنبيه", "تم حظر الحساب مؤقتاً بسبب محاولات كثيرة خاطئة، حاول لاحقاً.");
          break;
        default:
          Alert.alert("فشل الدخول", "حدث خطأ غير متوقع، تأكد من اتصالك بالإنترنت.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginCard}>
        <Text style={styles.title}>Campus Market</Text>
        
        <TextInput 
          style={styles.input}
          placeholder="الإيميل الجامعي"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput 
          style={styles.input}
          placeholder="كلمة السر"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={[styles.button, loading && { opacity: 0.7 }]} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>دخول</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => router.push('/Register')}>
          <Text style={{ color: '#3498db' }}>ليس لديك حساب؟ إنشاء حساب جديد</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ marginTop: 15 }} onPress={() => router.push('/forgot-password')}>
          <Text style={{ color: '#7f8c8d' }}>نسيت كلمة المرور؟</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6', alignItems: 'center', justifyContent: 'center' },
  loginCard: { backgroundColor: 'white', padding: 30, borderRadius: 15, width: '90%', elevation: 5, alignItems: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#2c3e50', marginBottom: 30 },
  input: { width: '100%', height: 50, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, textAlign: 'right' },
  button: { backgroundColor: '#3498db', width: '100%', height: 50, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: '600' },
});
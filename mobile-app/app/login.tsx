import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("تنبيه", "يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      Alert.alert("فشل الدخول", "تأكد من صحة البيانات أو وجود حساب");
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
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("تنبيه", "يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }
    if (password.length < 6) {
      Alert.alert("تنبيه", "كلمة المرور يجب أن لا تقل عن 6 أحرف");
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      Alert.alert("فشل التسجيل", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginCard}>
        <Text style={styles.title}>إنشاء حساب جديد</Text>
        
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
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>تسجيل</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => router.back()}>
          <Text style={{ color: '#3498db' }}>لديك حساب بالفعل؟ تسجيل الدخول</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6', alignItems: 'center', justifyContent: 'center' },
  loginCard: { backgroundColor: 'white', padding: 30, borderRadius: 15, width: '90%', elevation: 5, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50', marginBottom: 30 },
  input: { width: '100%', height: 50, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, textAlign: 'right' },
  button: { backgroundColor: '#2ecc71', width: '100%', height: 50, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: '600' },
});
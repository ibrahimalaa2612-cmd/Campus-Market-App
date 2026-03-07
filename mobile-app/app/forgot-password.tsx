import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useRouter } from 'expo-router';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("تنبيه", "يرجى إدخال البريد الإلكتروني أولاً");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("تم الإرسال", "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني");
      router.back();
    } catch (error: any) {
      Alert.alert("خطأ", "تأكد من صحة البريد الإلكتروني أو وجود حساب مرتبط به");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>نسيت كلمة المرور؟</Text>
      <Text style={styles.subtitle}>أدخل إيميلك الجامعي وسنرسل لك رابطاً لاستعادة حسابك</Text>
      
      <TextInput 
        style={styles.input}
        placeholder="الإيميل الجامعي"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>إرسال الرابط</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
        <Text style={{ color: '#3498db' }}>العودة للدخول</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { textAlign: 'center', color: '#666', marginBottom: 30 },
  input: { width: '100%', height: 50, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 15, marginBottom: 20, textAlign: 'right' },
  button: { backgroundColor: '#3498db', width: '100%', height: 50, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});
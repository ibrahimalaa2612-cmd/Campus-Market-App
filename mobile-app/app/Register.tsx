import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { auth, db } from '../firebaseConfig'; // المسار الصحيح حسب صورتك
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from 'expo-router'; // لأنك شغال Expo Router

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    // 1. Validation بسيط
    if (!email || !password || !name) {
      Alert.alert("خطأ", "املا البيانات كلها يا بطل");
      return;
    }

    try {
      // 2. إنشاء الحساب
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 3. إضافة الـ Document في Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName: name,
        email: email,
        createdAt: new Date(),
        platform: "mobile" // عشان تعرف إنه سجل من الموبايل
      });

      Alert.alert("مبروك", "الحساب اتعمل وجاهز!");
      router.replace('/login'); // يرجعه لصفحة اللوجن بعد النجاح
    } catch (error: any) {
      Alert.alert("فشل التسجيل", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>إنشاء حساب جديد</Text>
      <TextInput placeholder="الاسم" style={styles.input} onChangeText={setName} />
      <TextInput placeholder="الإيميل الجامعي" style={styles.input} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput placeholder="كلمة السر" style={styles.input} onChangeText={setPassword} secureTextEntry />
      
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>سجل الآن</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 15, textAlign: 'right' },
  button: { backgroundColor: '#42b72a', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});
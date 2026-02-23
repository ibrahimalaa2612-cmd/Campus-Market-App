import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; // استدعاء الموجه الخاص بـ Expo

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); // تعريف الـ router داخل المكون

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
        />

        <TextInput 
          style={styles.input}
          placeholder="كلمة السر"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>دخول</Text>
        </TouchableOpacity>

        {/* زرار إنشاء حساب جديد للتبديل بين الصفحات */}
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#2ecc71', marginTop: 20 }]} 
          onPress={() => router.push('/Register')} // التوجه لملف Register.tsx
        >
          <Text style={styles.buttonText}>إنشاء حساب جديد</Text>
        </TouchableOpacity>

        <Text style={styles.errorMsg}>خطأ في الإيميل أو كلمة السر</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginCard: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    width: '90%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    textAlign: 'right',
  },
  button: {
    backgroundColor: '#3498db',
    width: '100%',
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  errorMsg: {
    color: '#e74c3c',
    marginTop: 15,
    fontSize: 14,
  },
});
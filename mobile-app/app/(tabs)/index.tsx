import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

export default function Home() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Campus Market</Text>
      <Text style={styles.subtitle}>أهلاً بك في الصفحة الرئيسية! 🎉</Text>
      
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>تسجيل الخروج</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2c3e50', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#7f8c8d', marginBottom: 40 },
  button: { backgroundColor: '#e74c3c', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 8 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' }
});
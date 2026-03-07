import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { updatePassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useRouter } from 'expo-router';

export default function ChangePasswordScreen() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      Alert.alert("خطأ", "كلمة المرور يجب أن لا تقل عن 6 أحرف");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("خطأ", "كلمات المرور غير متطابقة");
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await updatePassword(user, newPassword);
        Alert.alert("نجاح", "تم تغيير كلمة المرور بنجاح");
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      Alert.alert("خطأ أمني", "يجب عليك تسجيل الدخول مرة أخرى لتنفيذ هذا الإجراء");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>تغيير كلمة المرور</Text>
      
      <TextInput 
        style={styles.input}
        placeholder="كلمة المرور الجديدة"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <TextInput 
        style={styles.input}
        placeholder="تأكيد كلمة المرور"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleChangePassword} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>تحديث كلمة المرور</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
        <Text style={{ color: '#e74c3c' }}>إلغاء</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30 },
  input: { width: '100%', height: 50, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 15, marginBottom: 20, textAlign: 'right' },
  button: { backgroundColor: '#2ecc71', width: '100%', height: 50, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});
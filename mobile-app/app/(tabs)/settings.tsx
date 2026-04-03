import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useRouter } from 'expo-router';
import { useAuth } from '../../constants/AuthContext';


export default function SettingsScreen() {
  const router = useRouter();
  const userEmail = auth.currentUser?.email || 'طالب جامعي';
  const { role } = useAuth();
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userEmail.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.emailText}>{userEmail}</Text>
      </View>

      <View style={styles.menu}>
        <Text style={styles.menuTitle}>إعدادات الحساب</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/change-password')}>
          <Text style={styles.menuItemText}>إعادة تعيين كلمة السر</Text>
        </TouchableOpacity>

        {/* Start Admin Button Addition */}
        {role === 'admin' && (
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/dashboard')}>
            <Text style={styles.menuItemText}>لوحة التحكم</Text>
          </TouchableOpacity>
        )}
        {/* End Admin Button Addition */}

        <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
          <Text style={styles.logoutText}>تسجيل الخروج</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6', padding: 20, paddingTop: 60 },
  profileSection: { alignItems: 'center', marginBottom: 40 },
  avatar: { width: 90, height: 90, backgroundColor: '#3498db', borderRadius: 45, justifyContent: 'center', alignItems: 'center', marginBottom: 15, elevation: 3 },
  avatarText: { fontSize: 36, color: '#fff', fontWeight: 'bold' },
  emailText: { fontSize: 18, color: '#2c3e50', fontWeight: 'bold' },
  menu: { backgroundColor: '#fff', borderRadius: 15, padding: 15, elevation: 2 },
  menuTitle: { fontSize: 18, fontWeight: 'bold', color: '#7f8c8d', marginBottom: 15, textAlign: 'right' },
  menuItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  menuItemText: { fontSize: 16, color: '#2c3e50', textAlign: 'right' },
  logoutItem: { borderBottomWidth: 0, marginTop: 5 },
  logoutText: { fontSize: 16, color: '#e74c3c', fontWeight: 'bold', textAlign: 'right' }
});
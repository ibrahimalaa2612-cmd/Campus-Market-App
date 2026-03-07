import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { auth } from '../../firebaseConfig';

export default function Home() {
  const userEmail = auth.currentUser?.email || 'طالب';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>مرحباً بك،</Text>
        <Text style={styles.subtitle}>{userEmail}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Campus Market</Text>
        <Text style={styles.cardText}>المكان الأفضل لبيع وشراء كل ما تحتاجه في الجامعة بسهولة وأمان.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>أحدث العروض</Text>
        <View style={styles.placeholderBox}>
          <Text style={styles.placeholderText}>لا توجد عروض حالياً</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6', padding: 20, paddingTop: 60 },
  header: { marginBottom: 30, alignItems: 'flex-end' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2c3e50' },
  subtitle: { fontSize: 16, color: '#7f8c8d', marginTop: 5 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 15, elevation: 3, marginBottom: 30 },
  cardTitle: { fontSize: 22, fontWeight: 'bold', color: '#3498db', marginBottom: 10, textAlign: 'right' },
  cardText: { fontSize: 15, color: '#555', lineHeight: 22, textAlign: 'right' },
  section: { flex: 1 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#2c3e50', marginBottom: 15, textAlign: 'right' },
  placeholderBox: { height: 150, backgroundColor: '#eaecee', borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: '#bdc3c7', fontSize: 16 }
});
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function CheckoutScreen() {
  const [method, setMethod] = useState('');
  const [phone, setPhone] = useState('');
  const router = useRouter();

  const handleFinish = () => {
    if (method === 'cash' && !phone) {
      Alert.alert('خطأ', 'يرجى إدخال رقم الهاتف');
      return;
    }
    Alert.alert('نجاح', 'تم استلام طلبك بنجاح');
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>اختر طريقة الدفع</Text>
      
      <TouchableOpacity 
        style={[styles.option, method === 'cash' && styles.selected]} 
        onPress={() => setMethod('cash')}
      >
        <Text style={styles.optionText}>الدفع عند الاستلام</Text>
      </TouchableOpacity>

      {method === 'cash' && (
        <TextInput
          style={styles.input}
          placeholder="أدخل رقم تليفونك"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
      )}

      <TouchableOpacity 
        style={styles.option} 
        onPress={() => Alert.alert('قريباً', 'ستتوفر هذه الخدمة قريباً')}
      >
        <Text style={styles.optionText}>فيزا / كارت بنكي</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
        <Text style={styles.finishText}>إتمام الطلب</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  option: { padding: 20, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, marginBottom: 15 },
  selected: { borderColor: '#3498db', backgroundColor: '#ebf5fb' },
  optionText: { fontSize: 18, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 10, marginBottom: 15, textAlign: 'right' },
  finishButton: { backgroundColor: '#2ecc71', padding: 15, borderRadius: 10, marginTop: 20 },
  finishText: { color: '#fff', textAlign: 'center', fontSize: 18, fontWeight: 'bold' }
});
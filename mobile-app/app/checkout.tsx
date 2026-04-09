import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert , ActivityIndicator} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
export default function CheckoutScreen() {
  const [method, setMethod] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const loadCart = async () => {
      const data = await AsyncStorage.getItem('cart');
      if (data) setCartItems(JSON.parse(data));
    };
    loadCart();
  }, []);

  const handleFinish = async () => {
    // 1. التحقق من اختيار وسيلة الدفع
    if (!method) {
      Alert.alert('خطأ', 'إختر طريقة دفع');
      return;
    }

    // 2. التحقق من رقم الهاتف لو الدفع كاش
    if (method === 'cash') {
      if (!phone) {
        Alert.alert('خطأ', 'أدخل رقم الهاتف');
        return;
      }
      // التحقق إن الرقم بيبدأ بـ 01 وطوله 11
      if (!phone.startsWith('01') || phone.length !== 11) {
        Alert.alert('خطأ', 'رقم الهاتف غير صحيح، يجب أن يبدأ بـ 01 ويتكون من 11 رقم');
        return;
      }
    }

    setLoading(true);
    try {
      const total = cartItems.reduce((sum, item: any) => sum + Number(item.price), 0);

      await addDoc(collection(db, 'orders'), {
        userId: auth.currentUser?.uid,
        userEmail: auth.currentUser?.email,
        items: cartItems,
        totalPrice: total,
        paymentMethod: method,
        phone: method === 'cash' ? phone : 'N/A',
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      await AsyncStorage.removeItem('cart');
      Alert.alert('تم بنجاح', 'تم تسجيل طلبك بنجاح');
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('خطأ', 'فشل في إرسال الطلب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>إجمالي المنتجات: {cartItems.length}</Text>
      <TouchableOpacity style={[styles.option, method === 'cash' && styles.selected]} onPress={() => setMethod('cash')}>
        <Text style={styles.optionText}>الدفع عند الاستلام</Text>
      </TouchableOpacity>
      {method === 'cash' && (
        <TextInput 
          style={styles.input} 
          placeholder="رقم الهاتف" 
          keyboardType="phone-pad" 
          value={phone} 
          onChangeText={setPhone} 
        />
      )}
      <TouchableOpacity style={styles.finishButton} onPress={handleFinish} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.finishText}>تأكيد الأوردر</Text>}
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
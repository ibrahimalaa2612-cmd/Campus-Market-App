import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';

export default function Home() {
  const router = useRouter();
  const userEmail = auth.currentUser?.email || 'طالب';
  
  // States للبحث والتصنيفات
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');

  // قائمة التصنيفات الموحدة
  const categories = ['الكل', 'أجهزه إلكترونيه', 'كتب ومراجع', 'أدوات منزليه صغيره','مستلزمات رياضيه','معدات كمبيوتر', 'أدوات مدرسيه', 'ملابس وإكسسوارات','خدمات', 'أخرى'];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'products'), where('status', '==', 'approved'));
      const querySnapshot = await getDocs(q);
      const productsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsList);
    } catch (error) {
      console.log("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // منطق الفلترة (بحث + تصنيف)
  const filteredProducts = products.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'الكل' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderProduct = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.productCard} 
      onPress={() => router.push({
        pathname: '/product-details/[id]',
        params: { id: item.id }
      })}
    >
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.productImage} />
      ) : (
        <View style={styles.noImageBox}>
          <Text style={styles.noImageText}>بدون صورة</Text>
        </View>
      )}
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price} ج.م</Text>
        {item.description && (
          <Text style={styles.productDesc} numberOfLines={1}>
            {item.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* الهيدر */}
      <View style={styles.header}>
        <Text style={styles.title}>مرحباً بك،</Text>
        <Text style={styles.subtitle}>{userEmail}</Text>
      </View>

      {/* شريط البحث */}
      <TextInput
        style={styles.searchBar}
        placeholder="ابحث عن منتج بالاسم..."
        placeholderTextColor="#95a5a6"
        value={search}
        onChangeText={setSearch}
      />

      {/* قائمة التصنيفات الأفقية */}
      <View style={{ marginBottom: 20 }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => setSelectedCategory(item)}
              style={[styles.catBtn, selectedCategory === item && styles.activeCatBtn]}
            >
              <Text style={[styles.catText, selectedCategory === item && styles.activeCatText]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <Text style={styles.sectionTitle}>أحدث المنتجات</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#3498db" style={{ marginTop: 50 }} />
      ) : filteredProducts.length === 0 ? (
        <View style={styles.placeholderBox}>
          <Text style={styles.placeholderText}>لا توجد نتائج تطابق بحثك</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          onRefresh={fetchProducts}
          refreshing={loading}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6', padding: 20, paddingTop: 60 },
  header: { marginBottom: 20, alignItems: 'flex-end' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2c3e50' },
  subtitle: { fontSize: 16, color: '#7f8c8d', marginTop: 5 },
  
  // تنسيق شريط البحث
  searchBar: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
    textAlign: 'right',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
    color: '#2c3e50',
    elevation: 2,
  },

  // تنسيق أزرار التصنيفات
  catBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 1,
  },
  activeCatBtn: {
    backgroundColor: '#2c3e50',
    borderColor: '#2c3e50',
  },
  catText: {
    color: '#7f8c8d',
    fontWeight: '600',
  },
  activeCatText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#2c3e50', marginBottom: 15, textAlign: 'right' },
  productCard: { backgroundColor: '#fff', borderRadius: 15, marginBottom: 15, overflow: 'hidden', elevation: 3, flexDirection: 'row', alignItems: 'center', padding: 10 },
  productImage: { width: 90, height: 90, borderRadius: 10 },
  noImageBox: { width: 90, height: 90, borderRadius: 10, backgroundColor: '#ecf0f1', justifyContent: 'center', alignItems: 'center' },
  noImageText: { color: '#bdc3c7', fontSize: 12 },
  productInfo: { flex: 1, alignItems: 'flex-end', paddingRight: 15 },
  productName: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginBottom: 5 },
  productPrice: { fontSize: 16, color: '#2ecc71', fontWeight: 'bold' },
  productDesc: { fontSize: 13, color: '#95a5a6', marginTop: 4, textAlign: 'right' },
  placeholderBox: { height: 150, backgroundColor: '#eaecee', borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: '#bdc3c7', fontSize: 16 }
});
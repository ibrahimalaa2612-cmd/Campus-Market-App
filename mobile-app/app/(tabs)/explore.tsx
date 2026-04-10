import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, FlatList, TouchableOpacity, View, Image, ActivityIndicator, Text } from 'react-native';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { useRouter } from 'expo-router';

// إعدادات الفايربيز مباشرة لحل مشكلة المسارات
const firebaseConfig = {
  apiKey: "AIzaSyBDL-E_GCH7eRGfF_MdQ3cSuQA5wgPt8Ds",
  authDomain: "campus-market-d381e.firebaseapp.com",
  projectId: "campus-market-d381e",
  storageBucket: "campus-market-d381e.appspot.com",
  messagingSenderId: "967405445457",
  appId: "1:967405445457:web:5d2d7321ae6a6c26a53370",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function ExploreScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const router = useRouter();

  const categories = ['الكل', 'أجهزة إلكترونية', 'كتب ومراجع', 'أدوات هندسية', 'أدوات طبية', 'ملابس وإكسسوارات', 'أخرى'];

  useEffect(() => {
    const q = query(collection(db, 'products'), where('status', '==', 'approved'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredProducts = products.filter((item: any) => {
    const matchesSearch = item.title?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'الكل' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#1D3D47', dark: '#0A1A1F' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#1DB954"
          name="magnifyingglass"
          style={styles.headerImage}
        />
      }>
      
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>Explore</ThemedText>
      </ThemedView>

      <TextInput
        style={styles.searchBar}
        placeholder="ابحث عن منتج..."
        placeholderTextColor="#888"
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.categoryBtn, selectedCategory === item && styles.categoryBtnActive]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text style={[styles.categoryText, selectedCategory === item && styles.categoryTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1DB954" style={{ marginTop: 20 }} />
      ) : (
        <View style={styles.grid}>
          {filteredProducts.map((item: any) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.card}
              onPress={() => router.push({ pathname: "/product-details", params: { id: item.id } })}
            >
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <ThemedText style={styles.productTitle} numberOfLines={1}>{item.title}</ThemedText>
              <ThemedText style={styles.productPrice}>{item.price} ج.م</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#1DB954',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  searchBar: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 20,
    textAlign: 'right'
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1e1e1e',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  categoryBtnActive: {
    backgroundColor: '#1DB954',
    borderColor: '#1DB954',
  },
  categoryText: {
    color: '#ccc',
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#fff',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  productTitle: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff'
  },
  productPrice: {
    color: '#1DB954',
    marginTop: 5,
    fontWeight: 'bold',
  },
});
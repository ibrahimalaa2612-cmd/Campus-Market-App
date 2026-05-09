import { createContext, useContext, useEffect, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCart([]);
      setCartLoading(false);
      return;
    }

    setCartLoading(true);
    const cartRef = doc(db, "carts", user.uid);

    const unsub = onSnapshot(
      cartRef,
      (snap) => {
        if (snap.exists()) {
          setCart(snap.data().items || []);
        } else {
          setCart([]);
        }
        setCartLoading(false);
      },
      (err) => {
        console.error("Cart sync error:", err);
        setCartLoading(false);
      }
    );

    return () => unsub();
  }, [user]);

  const persistCart = async (newCart) => {
    if (!user) return;
    const cartRef = doc(db, "carts", user.uid);
    await setDoc(cartRef, { items: newCart }, { merge: true });
  };

  const addToCart = async (product) => {
    const cleanProduct = {
      id: String(product.id || ""),
      name: String(product.name || "منتج"),
      price: Number(product.price || 0),
      image: String(product.images?.[0] || product.image || ""),
      quantity: 1,
      sellerName: String(product.sellerName || "Unknown"),
      category: String(product.category || ""),
      condition: String(product.condition || ""),
    };

    const existing = cart.find((item) => item.id === cleanProduct.id);
    let newCart;
    if (existing) {
      newCart = cart.map((item) =>
        item.id === cleanProduct.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cart, cleanProduct];
    }

    setCart(newCart);
    await persistCart(newCart);
  };

  const removeFromCart = async (productId) => {
    const newCart = cart.filter((item) => item.id !== productId);
    setCart(newCart);
    await persistCart(newCart);
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    const newCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
    setCart(newCart);
    await persistCart(newCart);
  };

  const clearCart = async () => {
    setCart([]);
    await persistCart([]);
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, cartLoading, addToCart, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
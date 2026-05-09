import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const DEFAULT_IMAGE = "https://i.postimg.cc/FKMdfByG/download.jpg";

export const addProductReview = async ({ productId, userId, userName, userImage, rating, comment }) => {
  const ref = collection(db, "productReviews");

  const existing = await getDocs(
    query(ref, where("productId", "==", productId), where("userId", "==", userId))
  );
  if (!existing.empty) throw new Error("لقد قمت بتقييم هذا المنتج من قبل");

  const userProfile = await getDoc(doc(db, "userProfiles", userId));
  const profileImage = userProfile?.data()?.imageUrl || userImage || DEFAULT_IMAGE;

  await addDoc(ref, {
    productId,
    userId,
    userName,
    userImage: profileImage,
    rating,
    comment,
    createdAt: serverTimestamp(),
  });
};

export const getProductReviews = async (productId) => {
  const q = query(
    collection(db, "productReviews"),
    where("productId", "==", productId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const addSellerReview = async ({ sellerId, userId, userName, userImage, rating }) => {
  const ref = collection(db, "sellerReviews");

  const existing = await getDocs(
    query(ref, where("sellerId", "==", sellerId), where("userId", "==", userId))
  );
  if (!existing.empty) throw new Error("لقد قمت بتقييم هذا البائع من قبل");

  const userProfile = await getDoc(doc(db, "userProfiles", userId));
  const profileImage = userProfile?.data()?.imageUrl || userImage || DEFAULT_IMAGE;

  await addDoc(ref, {
    sellerId,
    userId,
    userName,
    userImage: profileImage,
    rating,
    createdAt: serverTimestamp(),
  });

  await recalcSellerRating(sellerId);
};

export const getSellerReviews = async (sellerId) => {
  const q = query(
    collection(db, "sellerReviews"),
    where("sellerId", "==", sellerId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

const recalcSellerRating = async (sellerId) => {
  const reviews = await getSellerReviews(sellerId);
  if (!reviews.length) return;
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const sellerRef = doc(db, "userProfiles", sellerId);
  const sellerSnap = await getDoc(sellerRef);
  if (sellerSnap.exists()) {
    await updateDoc(sellerRef, {
      avgRating: parseFloat(avg.toFixed(1)),
      reviewCount: reviews.length,
    });
  }
};
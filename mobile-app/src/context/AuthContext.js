import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../services/firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [role, setRole] = useState("user"); // ⭐ NEW
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const docRef = doc(db, "userProfiles", currentUser.uid);
          const snap = await getDoc(docRef);

          if (snap.exists()) {
            const data = snap.data();

            setUserProfile(data);
            setRole(data.role || "user"); // ⭐ IMPORTANT
          } else {
            setUserProfile(null);
            setRole("user");
          }
        } catch (err) {
          console.log("Profile fetch error:", err);
          setRole("user");
        }
      } else {
        setUserProfile(null);
        setRole("user");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
    setRole("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        role, // ⭐ NEW
        loading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

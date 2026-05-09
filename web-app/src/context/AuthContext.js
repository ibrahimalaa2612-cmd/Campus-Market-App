import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setRole(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      const userRef = doc(db, "userProfiles", currentUser.uid);

      const timeout = setTimeout(() => {
        setRole("user");
        setLoading(false);
      }, 3000);

      const unsubProfile = onSnapshot(
        userRef,
        (snap) => {
          clearTimeout(timeout);
          if (snap.exists()) {
            setRole(snap.data().role || "user");
          } else {
            setRole("user");
          }
          setLoading(false);
        },
        (error) => {
          clearTimeout(timeout);
          console.error("Error fetching role:", error);
          setRole("user");
          setLoading(false);
        }
      );

      return () => {
        clearTimeout(timeout);
        unsubProfile();
      };
    });

    return () => unsubAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
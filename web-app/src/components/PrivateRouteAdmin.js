
/*
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const PrivateRouteAdmin = ({ children }) => {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        const docRef = doc(db, "userProfiles", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const role = docSnap.data().role;
          setIsAdmin(role === "admin");
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, [user]);

  if (loading || isAdmin === null) return <p>Loading...</p>;

  return isAdmin ? children : <Navigate to="/" />;
};

export default PrivateRouteAdmin;
*/
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const PrivateRouteAdmin = ({ children }) => {
  const { user, loading } = useAuth();

  const adminEmail = "admin@gmail.com"; 

  if (loading) return <p>Loading...</p>;

  
  if (!user || user.email !== adminEmail) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRouteAdmin;
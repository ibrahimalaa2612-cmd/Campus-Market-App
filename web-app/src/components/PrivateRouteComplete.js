import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function PrivateRouteComplete({ children }) {
  const { user, loading, initialized } = useAuth();
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      if (!user) {
        setProfileComplete(false);
        setProfileLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "userProfiles", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.fullName && data.university && data.faculty && data.studentId) {
            setProfileComplete(true);
          } else {
            setProfileComplete(false);
          }
        } else {
          setProfileComplete(false);
        }
      } catch (err) {
        console.error("Error checking profile:", err);
        setProfileComplete(false);
      } finally {
        setProfileLoading(false);
      }
    };

    if (initialized) {
      checkProfile();
    }
  }, [user, initialized]);

  if (loading || !initialized || profileLoading) {
    return <div className="loading">جاري التحقق من تسجيل الدخول وملفك الشخصي...</div>;
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!profileComplete) return <Navigate to="/complete" replace />;

  return children;
}
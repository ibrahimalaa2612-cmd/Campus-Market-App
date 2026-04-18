import { onAuthStateChanged, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert
} from "react-native";
import { auth, db } from "../../services/firebase";
import styles from "../../styles/authStyles";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) navigation.replace("Home");
    });
    return unsub;
  }, []);

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      return setError("يرجى إدخال البريد الإلكتروني وكلمة المرور");
    }

    try {
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      const adminDoc = await getDoc(doc(db, "admins", user.email));

      navigation.replace("Home");
    } catch (err) {
      setError("بيانات الدخول غير صحيحة");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("تنبيه", "يرجى إدخال البريد الإلكتروني في الحقل أولاً لإرسال الرابط");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("نجاح", "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.");
    } catch (err) {
      Alert.alert("خطأ", "تأكد من كتابة البريد الإلكتروني بشكل صحيح وأنه مسجل لدينا.");
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert("تنبيه", "تسجيل الدخول بجوجل في الموبايل يحتاج إلى إعداد مكتبة expo-auth-session");
  };

  const handleFacebookLogin = () => {
    Alert.alert("تنبيه", "تسجيل الدخول بفيسبوك في الموبايل يحتاج إلى إعداد مكتبة expo-auth-session");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>تسجيل الدخول</Text>

        <TextInput
          placeholder="البريد الإلكتروني"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="كلمة المرور"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>دخول</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleResetPassword} style={{ marginTop: 15, alignItems: "center" }}>
          <Text style={{ color: "#3498db", fontSize: 14, fontWeight: "bold" }}>نسيت كلمة السر؟</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 15 }}>
          <Text style={styles.textMuted}>ليس لديك حساب؟ </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.link}>إنشاء حساب</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 25 }}>
          <TouchableOpacity 
            style={[styles.primaryBtn, { backgroundColor: "#db4437", marginBottom: 10 }]} 
            onPress={handleGoogleLogin}
          >
            <Text style={styles.btnText}>الدخول باستخدام Google</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.primaryBtn, { backgroundColor: "#4267B2" }]} 
            onPress={handleFacebookLogin}
          >
            <Text style={styles.btnText}>الدخول باستخدام Facebook</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

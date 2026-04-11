import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
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

        <Text style={styles.textMuted}>ليس لديك حساب؟</Text>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.link}>إنشاء حساب</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

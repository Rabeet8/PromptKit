import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/firebase";

export default function AuthScreen() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        router.replace("/screens/Home");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        router.replace("/screens/UserInfo");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PROMPT KIT</Text>

      <View style={styles.segmentWrapper}>
        <TouchableOpacity
          onPress={() => setMode("login")}
          style={[
            styles.segment,
            mode === "login" && styles.segmentActive,
          ]}
        >
          <Text
            style={[
              styles.segmentText,
              mode === "login" && styles.segmentTextActive,
            ]}
          >
            Log In
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setMode("signup")}
          style={[
            styles.segment,
            mode === "signup" && styles.segmentActive,
          ]}
        >
          <Text
            style={[
              styles.segmentText,
              mode === "signup" && styles.segmentTextActive,
            ]}
          >
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Email address</Text>
        <TextInput
          placeholder="user@example.com"
          placeholderTextColor="#B7B7B7"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          secureTextEntry
          placeholder="••••••••••••"
          placeholderTextColor="#B7B7B7"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        {mode === "login" && (
          <TouchableOpacity style={styles.forgotBtn} onPress={() => router.push("/screens/ResetPassword")}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        )}

       <TouchableOpacity
  style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
  onPress={handleAuth}
  disabled={loading}
>
  <Text style={styles.primaryBtnText}>
    {loading ? "Loading..." : mode === "login" ? "Log In" : "Sign Up"}
  </Text>
</TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: "#FAF7F2",
  },

  title: {
    marginTop: 50,
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: 1.5,
    textAlign: "center",
    color: "#2D2A26",
  },

  /* Segmented Control */
  segmentWrapper: {
    flexDirection: "row",
    marginTop: 35,
    marginBottom: 20,
    backgroundColor: "#F1EFEA",   // Inactive background
    borderRadius: 12,
    padding: 4,
  },

  segment: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
  },

  segmentActive: {
    backgroundColor: "#E6DED4",  // Active background
  },

  segmentText: {
    textAlign: "center",
    fontSize: 16,
    color: "#8C877F",  // Inactive text
  },

  segmentTextActive: {
    fontWeight: "600",
    color: "#2D2A26",  // Active text
  },

  /* Card */
  card: {
    marginTop: 15,
    backgroundColor: "#FAF7F2",
    padding: 25,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },

  label: {
    fontSize: 14,
    color: "#2D2A26",
    marginBottom: 6,
    marginTop: 10,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D5D5D5",
    padding: 12,
    borderRadius: 10,
    fontSize: 15,
    color: "#2D2A26",
  },

  forgotBtn: {
    marginTop: 8,
    alignSelf: "flex-end",
  },

  forgotText: {
    color: "#9A9A9A",
    fontSize: 13,
  },

  primaryBtn: {
    backgroundColor: "#2D2A26",
    marginTop: 20,
    padding: 14,
    borderRadius: 12,
  },

  primaryBtnDisabled: {
    backgroundColor: "#CCC",
  },

  primaryBtnText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },

  orText: {
    textAlign: "center",
    marginVertical: 20,
    color: "#9A9A9A",
  },

  socialWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  socialBtn: {
    flex: 1,
    backgroundColor: "#E9E9E9",
    padding: 12,
    marginHorizontal: 6,
    borderRadius: 10,
  },

  socialText: {
    textAlign: "center",
    color: "#2D2A26",
    fontWeight: "500",
  },
});

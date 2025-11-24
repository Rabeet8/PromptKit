import { auth } from "@/config/firebase";
import { useRouter } from "expo-router";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AuthScreen() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* HEADER */}
        <View style={styles.headerBlock}>
          <Text style={styles.title}>PromptKit</Text>
          <Text style={styles.subtitle}>Your AI developer toolkit — simplified.</Text>
        </View>

        {/* SEGMENT SWITCH */}
        <View style={styles.segmentWrapper}>
          <Pressable
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
          </Pressable>

          <Pressable
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
          </Pressable>
        </View>

        {/* CARD */}
        <View style={styles.card}>

          {/* EMAIL FIELD */}
          <Text style={styles.label}>Email address</Text>
          <View style={styles.inputWrapper}>
            <Mail size={20} color="#8C877F" />
            <TextInput
              placeholder="user@example.com"
              placeholderTextColor="#B7B7B7"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
            />
          </View>

          {/* PASSWORD FIELD */}
          <Text style={styles.label}>Password</Text>

          <View style={styles.inputWrapper}>
            <Lock size={20} color="#8C877F" />

            <TextInput
              placeholder="•••••••••••"
              placeholderTextColor="#B7B7B7"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              style={styles.input}
            />

            <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={12}>
              {showPassword ? (
                <EyeOff size={20} color="#8C877F" />
              ) : (
                <Eye size={20} color="#8C877F" />
              )}
            </Pressable>
          </View>

          {/* FORGOT PASSWORD */}
          {mode === "login" && (
            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() => router.push("/screens/ResetPassword")}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          )}

          {/* PRIMARY BUTTON */}
          <Pressable
            onPress={handleAuth}
            disabled={loading}
            style={({ pressed }) => [
              styles.primaryBtn,
              loading && styles.primaryBtnDisabled,
              { transform: [{ scale: pressed ? 0.97 : 1 }] },
            ]}
          >
            <Text style={styles.primaryBtnText}>
              {loading ? "Loading..." : mode === "login" ? "Log In" : "Sign Up"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#FAF7F2",
  },

  scrollContent: {
    padding: 28,
    paddingBottom: 80,
  },

  /* HEADER */
  headerBlock: {
    marginTop: 60,
    marginBottom: 25,
    alignItems: "center",
  },

  title: {
    fontSize: 36,
    fontFamily: "Poppins_700Bold",
    color: "#2D2A26",
  },

  subtitle: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    color: "#7A746D",
    marginTop: 4,
    letterSpacing: 0.2,
  },

  /* SEGMENT */
  segmentWrapper: {
    flexDirection: "row",
    backgroundColor: "#EEE8E0",
    borderRadius: 16,
    padding: 5,
    marginBottom: 28,
  },

  segment: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
  },

  segmentActive: {
    backgroundColor: "#2D2A26",
  },

  segmentText: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
    color: "#8C877F",
  },

  segmentTextActive: {
    color: "#FFFFFF",
    fontFamily: "Poppins_600SemiBold",
  },

  /* CARD */
  card: {
    backgroundColor: "#FFFFFF",
    padding: 28,
    borderRadius: 22,

    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },

    elevation: 3,
  },

  label: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: "#2D2A26",
    marginTop: 14,
    marginBottom: 6,
  },

  /* INPUT FIELD */
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F6F2",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E6E2DD",
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 10,
    marginBottom: 10,

    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  input: {
    flex: 1,
    fontSize: 15.5,
    fontFamily: "Poppins_500Medium",
    color: "#2D2A26",
    paddingRight: 6,
  },

  forgotBtn: {
    marginTop: 4,
    alignSelf: "flex-end",
  },

  forgotText: {
    fontSize: 13,
    fontFamily: "Poppins_500Medium",
    color: "#7A746D",
  },

  /* BUTTON */
  primaryBtn: {
    backgroundColor: "#2D2A26",
    marginTop: 26,
    paddingVertical: 16,
    borderRadius: 14,

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  primaryBtnDisabled: {
    opacity: 0.6,
  },

  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
    letterSpacing: 0.3,
  },
});

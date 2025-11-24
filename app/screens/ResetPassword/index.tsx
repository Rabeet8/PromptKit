import { auth } from "@/config/firebase";
import { useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { Mail } from "lucide-react-native";
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
  View,
} from "react-native";

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReset = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Success", "Password reset link has been sent to your email.");
      router.back();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }

    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* HEADER */}
        <View style={styles.headerBlock}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter your email to receive a reset link.
          </Text>
        </View>

        {/* CARD */}
        <View style={styles.card}>
          <Text style={styles.label}>Email address</Text>

          <View style={styles.inputWrapper}>
            <Mail size={20} color="#8C877F" />
            <TextInput
              placeholder="user@example.com"
              placeholderTextColor="#B7B7B7"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
          </View>

          {/* SEND BUTTON */}
          <Pressable
            onPress={handleReset}
            disabled={loading}
            style={({ pressed }) => [
              styles.primaryBtn,
              loading && styles.primaryBtnDisabled,
              { transform: [{ scale: pressed ? 0.97 : 1 }] },
            ]}
          >
            <Text style={styles.primaryBtnText}>
              {loading ? "Sending..." : "Send Reset Email"}
            </Text>
          </Pressable>

          {/* BACK */}
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}> Back to Login</Text>
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
    paddingTop: 70,
    paddingBottom: 60,
  },

  /* HEADER */
  headerBlock: {
    alignItems: "center",
    marginBottom: 30,
  },

  title: {
    fontSize: 30,
    fontFamily: "Poppins_700Bold",
    color: "#2D2A26",
  },

  subtitle: {
    fontSize: 14,
    color: "#7A746D",
    marginTop: 4,
    textAlign: "center",
    fontFamily: "Poppins_500Medium",
  },

  /* CARD */
  card: {
    backgroundColor: "#FFFFFF",
    padding: 26,
    borderRadius: 20,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },

  label: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: "#2D2A26",
    marginBottom: 8,
  },

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
  },

  /* BUTTON */
  primaryBtn: {
    backgroundColor: "#2D2A26",
    marginTop: 22,
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

  /* BACK BUTTON */
  backBtn: {
    marginTop: 18,
    alignItems: "center",
  },

  backText: {
    fontSize: 15,
    color: "#2D2A26",
    fontFamily: "Poppins_500Medium",
    textDecorationLine: "underline",
  },
});

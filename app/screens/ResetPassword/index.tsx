import CustomAlert from "@/components/CustomAlert";
import { auth } from "@/config/firebase";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { sendPasswordResetEmail } from "firebase/auth";
import { ArrowLeft, Mail } from "lucide-react-native";
import { useState } from "react";
import {
  Dimensions,
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
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

const { width, height } = Dimensions.get("window");

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Custom Alert State
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"error" | "success" | "info">("info");

  const showAlert = (title: string, message: string, type: "error" | "success" | "info" = "info") => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  const handleReset = async () => {
    if (!email) {
      showAlert("Error", "Please enter your email address.", "error");
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      showAlert("Success", "Password reset link has been sent to your email.", "success");
    } catch (error: any) {
      showAlert("Error", error.message, "error");
    }

    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="light" backgroundColor="#2B2A28" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.topSection}>
          <Svg
            height={height * 0.4}
            width={width}
            viewBox={`0 0 ${width} ${height * 0.4}`}
            style={styles.curve}
          >
            <Path
              d={`M0,0 L${width},0 L${width},${height * 0.32} Q${width * 0.75},${height * 0.38} ${width / 2},${height * 0.35} Q${width * 0.25},${height * 0.32} 0,${height * 0.38} Z`}
              fill="#2B2A28"
            />
          </Svg>

          {/* BACK BUTTON */}
          <TouchableOpacity
            style={styles.backBtnWrapper}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#FAF7F2" />
          </TouchableOpacity>

          {/* TITLE */}
          <Text style={styles.title}>Reset Password</Text>
        </View>

        {/* FORM SECTION */}
        <ScrollView
          style={styles.formSection}
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.description}>
            Enter your email regarding your account and we will send you a link to reset your password.
          </Text>
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputWrapper}>
            <Mail size={20} color="#2B2A28" />
            <TextInput
              placeholder="hannadowie@gmail.com"
              placeholderTextColor="#8C877F"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
            />
          </View>

          <Pressable
            onPress={handleReset}
            disabled={loading}
            style={({ pressed }) => [
              styles.sendBtn,
              loading && styles.disabledBtn,
              { transform: [{ scale: pressed ? 0.98 : 1 }] },
            ]}
          >
            <Text style={styles.sendBtnText}>
              {loading ? "Sending..." : "Send Reset Link"}
            </Text>
          </Pressable>

        </ScrollView>
      </KeyboardAvoidingView>

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        type={alertType}
        onClose={() => setAlertVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF7F2",
  },

  topSection: {
    position: "relative",
    height: height * 0.4,
  },

  curve: {
    position: "absolute",
    top: 0,
    left: 0,
  },

  backBtnWrapper: {
    position: "absolute",
    top: 50, // Adjusted for better safe area placement
    left: 24,
    padding: 10,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 50,
  },

  title: {
    position: "absolute",
    bottom: height * 0.08,
    left: 0,
    right: 0,
    fontSize: 34, // Slightly larger
    fontFamily: "Poppins_700Bold",
    color: "#FAF7F2",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  /* FORM SECTION */
  formSection: {
    flexGrow: 0,
    flexShrink: 1,
    backgroundColor: "#FAF7F2",
  },

  formContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },

  description: {
    fontSize: 15,
    fontFamily: "Poppins_500Medium",
    color: "#7A746D",
    marginBottom: 40,
    marginTop: 10,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 10,
  },

  label: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: "#2B2A28",
    marginBottom: 10,
    marginLeft: 4,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF", // White background for pop
    borderRadius: 18, // Slightly softer corners
    paddingHorizontal: 20,
    paddingVertical: 18, // Taller touch target
    borderWidth: 2,
    borderColor: "#2B2A28",
    gap: 14,

    // Subtle shadow lift
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
    color: "#2B2A28",
  },

  sendBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2B2A28",
    borderRadius: 18,
    paddingVertical: 20, // Taller button
    marginTop: 32,

    // Enhanced shadow
    shadowColor: "#2B2A28",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },

  disabledBtn: {
    opacity: 0.7,
  },

  sendBtnText: {
    fontSize: 17,
    fontFamily: "Poppins_600SemiBold",
    color: "#FAF7F2",
    letterSpacing: 0.5,
  },
});


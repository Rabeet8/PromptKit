import CustomAlert from "@/components/CustomAlert";
import { auth } from "@/config/firebase";
import {
  getAuthErrorMessage,
  validateEmail,
  validatePassword,
} from "@/utils/authValidation";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Eye, EyeOff, Lock, UserPlus } from "lucide-react-native";
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

export default function AuthScreen() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Custom Alert State
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"error" | "success" | "info">("info");

  const router = useRouter();

  const showAlert = (title: string, message: string, type: "error" | "success" | "info" = "info") => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  const handleAuth = async () => {
    if (!email || !password) {
      showAlert("Error", "Please fill in all fields.", "error");
      return;
    }

    if (!validateEmail(email)) {
      showAlert("Error", "Please enter a valid email address.", "error");
      return;
    }

    if (!validatePassword(password)) {
      showAlert("Error", "Password must be at least 6 characters long.", "error");
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
      const friendlyMessage = getAuthErrorMessage(error.code);
      showAlert("Error", friendlyMessage, "error");
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
        {/* CURVED TOP SECTION */}
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

          {/* SIGN UP LINK */}
          <TouchableOpacity
            style={styles.signUpBtn}
            onPress={() => setMode(mode === "login" ? "signup" : "login")}
          >
            <UserPlus size={20} color="#FAF7F2" strokeWidth={2} />
            <Text style={styles.signUpText}>
              {mode === "login" ? "Sign Up" : "Sign In"}
            </Text>
          </TouchableOpacity>

          {/* TITLE */}
          <Text style={styles.title}>
            {mode === "login" ? "Sign In" : "Sign Up"}
          </Text>
        </View>

        {/* FORM SECTION */}
        <ScrollView
          style={styles.formSection}
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* EMAIL INPUT */}
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
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

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="************"
              placeholderTextColor="#8C877F"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              style={styles.input}
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              {showPassword ? (
                <EyeOff size={20} color="#2B2A28" strokeWidth={2} />
              ) : (
                <Eye size={20} color="#2B2A28" strokeWidth={2} />
              )}
            </Pressable>
          </View>

          <Pressable
            onPress={handleAuth}
            disabled={loading}
            style={({ pressed }) => [
              styles.signInBtn,
              { transform: [{ scale: pressed ? 0.98 : 1 }] },
            ]}
          >
            <Lock size={20} color="#2B2A28" strokeWidth={2.5} />
            <Text style={styles.signInText}>
              {loading
                ? "Loading..."
                : mode === "login"
                  ? "Sign In"
                  : "Create Account"}
            </Text>
          </Pressable>

          {mode === "login" && (
            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() => router.push("/screens/ResetPassword")}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.forgotBtn}
            onPress={() => router.push("/screens/Onboarding")}
          >
            <Text style={styles.forgotText}>Go to Onboarding</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Custom Alert */}
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

  signUpBtn: {
    position: "absolute",
    top: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(250, 247, 242, 0.3)",
    zIndex: 10,
    gap: 6,
  },

  signUpText: {
    fontSize: 15,
    fontFamily: "Poppins_600SemiBold",
    color: "#FAF7F2",
  },

  title: {
    position: "absolute",
    bottom: height * 0.08,
    left: 0,
    right: 0,
    fontSize: 42,
    fontFamily: "Poppins_700Bold",
    color: "#FAF7F2",
    textAlign: "center",
  },

  formSection: {
    flexGrow: 0,
    flexShrink: 1,
    backgroundColor: "#FAF7F2",
  },

  formContent: {
    paddingHorizontal: 28,
    paddingBottom: 10,
    marginTop: -10,
  },

  label: {
    fontSize: 13,
    fontFamily: "Poppins_500Medium",
    color: "#7A746D",
    marginBottom: 8,
    marginTop: 12,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: "#2B2A28",
  },

  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
    color: "#2B2A28",
  },

  eyeButton: {
    padding: 4,
  },

  signInBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#2B2A28",
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 32,
    gap: 10,
  },

  signInText: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#2B2A28",
    letterSpacing: 0.5,
  },

  forgotBtn: {
    alignSelf: "center",
    marginTop: 24,
  },

  forgotText: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    color: "#7A746D",
  },
});

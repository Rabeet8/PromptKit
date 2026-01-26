import { auth, database } from "@/config/firebase";
import { useAuth } from "@/contexts/AuthContext";

import {
  BadgeDollarSign,
  Blocks,
  ListChecks,
  LogOut,
  ScanText,
  UserRound,
  Wand2
} from "lucide-react-native";

import CustomAlert from "@/components/CustomAlert";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import {
  Animated,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [firstName, setFirstName] = useState<string>("Genius");
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"error" | "success" | "info">("info");

  const showAlert = (title: string, message: string, type: "error" | "success" | "info" = "info") => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  };

  useEffect(() => {
    const fetchUserName = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const snapshot = await get(ref(database, `users/${user.uid}`));
        if (snapshot.exists()) {
          const data = snapshot.val();
          if (data.firstName) {
            setFirstName(data.firstName);
          }
        }
      } catch (error: any) {
        // Suppress permission errors likely due to restricted rules
        if (error.message && error.message.includes("Permission denied")) {
          // Silent fail
        } else {
          console.warn("Failed to fetch user name:", error);
        }
      }
    };

    fetchUserName();

    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error: any) {
      showAlert("Error", error.message, "error");
    }
  };

  const FeatureCard = ({ icon, label, route, colors, gradient }: any) => (
    <Pressable
      onPress={() => router.push(route)}
      style={({ pressed }) => [
        styles.card,
        {
          transform: [{ scale: pressed ? 0.96 : 1 }],
        },
      ]}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        <View style={[styles.iconCircle, { backgroundColor: colors.iconBg }]}>
          {icon}
        </View>
        <Text style={styles.cardText}>{label}</Text>
        <View style={styles.cardShine} />
      </LinearGradient>
    </Pressable>
  );



  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={["#FAF7F2", "#F5F0E8", "#FAF7F2"]}
        style={styles.gradientBackground}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Animated.View
            style={[
              styles.container,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <LinearGradient
                colors={["#FFFFFF", "#F8F8F8"]}
                style={styles.logoutGradient}
              >
                <LogOut size={22} color="#2D2A26" strokeWidth={2.5} />
              </LinearGradient>
            </TouchableOpacity>

            {/* Greeting Section */}
            <View style={styles.greetingContainer}>
              <View style={styles.greetingIconContainer}>
                <LinearGradient
                  colors={["#FF9F4A", "#FF6B35"]}
                  style={styles.greetingIconGradient}
                >
                  <Wand2 size={28} color="#FFFFFF" strokeWidth={2.5} />
                </LinearGradient>
              </View>
              <Text style={styles.greeting}>
                Hello {firstName}! 👋
              </Text>
              <Text style={styles.greetingSub}>
                Let's create something amazing together
              </Text>
            </View>

            {/* Feature Grid */}
            <View style={styles.grid}>
              <FeatureCard
                icon={<ScanText size={32} color="#1E3A8A" strokeWidth={2.3} />}
                label="Token Counter"
                route="/screens/TokenCalculator"
                colors={{ iconBg: "rgba(255, 255, 255, 0.9)" }}
                gradient={["#E9F0FF", "#D3E1FF"]}
              />

              <FeatureCard
                icon={<ListChecks size={32} color="#92400E" strokeWidth={2.3} />}
                label="Prompt Linter"
                route="/screens/PromptLinter"
                colors={{ iconBg: "rgba(255, 255, 255, 0.9)" }}
                gradient={["#F5EEE2", "#E9DFD1"]}
              />

              <FeatureCard
                icon={<Blocks size={32} color="#065F46" strokeWidth={2.3} />}
                label="Schema Generator"
                route="/screens/SchemaGenerator"
                colors={{ iconBg: "rgba(255, 255, 255, 0.9)" }}
                gradient={["#E3F8EC", "#CFF3DC"]}
              />

              <FeatureCard
                icon={
                  <BadgeDollarSign
                    size={32}
                    color="#92400E"
                    strokeWidth={2.3}
                  />
                }
                label="LLM Cost Calculator"
                route="/screens/LLMCostCalculator"
                colors={{ iconBg: "rgba(255, 255, 255, 0.9)" }}
                gradient={["#FFF4D8", "#F8E8BB"]}
              />

              <FeatureCard
                icon={<UserRound size={32} color="#991B1B" strokeWidth={2.3} />}
                label="My Profile"
                route="/screens/UserInfo"
                colors={{ iconBg: "rgba(255, 255, 255, 0.9)" }}
                gradient={["#FFE8E8", "#FFD6D6"]}
              />
            </View>


          </Animated.View>
        </ScrollView>
      </LinearGradient>

      <CustomAlert
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    padding: 28,
  },

  logoutBtn: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  logoutGradient: {
    padding: 12,
    borderRadius: 20,
  },

  greetingContainer: {
    marginTop: 40,
    marginBottom: 35,
  },
  greetingIconContainer: {
    marginBottom: 16,
  },
  greetingIconGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6B5CE7",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  greeting: {
    fontSize: 32,
    fontFamily: "Poppins_700Bold",
    color: "#2D2A26",
    marginBottom: 8,
    lineHeight: 40,
  },
  greetingSub: {
    fontSize: 18,
    fontFamily: "Poppins_500Medium",
    color: "#8B7E74",
    lineHeight: 26,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 18,
  },

  card: {
    width: "48%",
    height: 170,
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  cardGradient: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
    position: "relative",
  },
  cardShine: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },

  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  cardText: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#2D2A26",
    lineHeight: 22,
  },

  adContainer: {
    marginTop: 30,
    marginBottom: 20,
    alignItems: "center",
  },

  footerContainer: {
    marginTop: 30,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  footerGradient: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#6B5CE7",
    textAlign: "center",
  },
});

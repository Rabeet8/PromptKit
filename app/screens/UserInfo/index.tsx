import CustomAlert from "@/components/CustomAlert";
import { auth, database } from "@/config/firebase";
import { getAllServiceUsage } from "@/utils/usageTracker";
import { useRouter } from "expo-router";
import { deleteUser } from "firebase/auth";
import { get, ref, remove, set } from "firebase/database";
import { useCallback, useEffect, useState } from "react";
import {
  Animated,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { BadgeDollarSign, Calculator, FileJson, ListChecks } from "lucide-react-native";

import PrimaryButton from "@/components/Button.tsx";
import DescriptionInput from "@/components/DescriptionCard.tsx";
import Header from "@/components/Header";

export default function ProfileScreen() {
  const router = useRouter();
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(20))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
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
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [usageStats, setUsageStats] = useState<Record<string, number>>({});

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"error" | "success" | "info">("info");
  const [modalButtonText, setModalButtonText] = useState("OK");
  const [modalShowCancel, setModalShowCancel] = useState(false);
  const [modalOnConfirm, setModalOnConfirm] = useState<(() => void) | undefined>(undefined);
  const [modalConfirmColor, setModalConfirmColor] = useState("#2B2A28");

  const showAlert = (title: string, message: string, type: "error" | "success" | "info" = "info") => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setModalButtonText("OK");
    setModalShowCancel(false);
    setModalOnConfirm(undefined);
    setModalConfirmColor("#2B2A28");
    setModalVisible(true);
  };

  const showConfirmation = (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText: string = "Confirm",
    confirmColor: string = "#2B2A28"
  ) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType("error"); // Use error type for destructive actions usually, or add 'warning'
    setModalButtonText(confirmText);
    setModalShowCancel(true);
    setModalOnConfirm(() => onConfirm);
    setModalConfirmColor(confirmColor);
    setModalVisible(true);
  };

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [userType, setUserType] = useState("");
  const [experience, setExperience] = useState("");
  const [description, setDescription] = useState("");

  const userTypes = [
    "AI Developer",
    "ML Engineer",
    "Student",
    "Researcher",
    "Product Manager",
    "Hobbyist",
    "Other",
  ];
  const experienceLevels = ["Beginner", "Intermediate", "Advanced"];

  const loadProfile = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) {
      showAlert("Error", "User not authenticated.", "error");
      router.replace("/screens/Auth");
      return;
    }
    try {
      const snapshot = await get(ref(database, `users/${user.uid}`));
      if (snapshot.exists()) {
        const data = snapshot.val();
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setUserType(data.userType || "");
        setExperience(data.experience || "");
        setDescription(data.description || "");
      }

      const usage = await getAllServiceUsage();
      setUsageStats(usage);
      setUsageStats(usage);
    } catch (error: any) {
      showAlert("Error", "Failed to load profile: " + error.message, "error");
    }
  }, [router]);

  useEffect(() => {
    loadProfile().then(() => setInitialLoading(false));
  }, [loadProfile]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  }, [loadProfile]);

  const handleSave = async () => {
    if (!firstName || !lastName || !userType || !experience) {
      showAlert("Missing Data", "Please fill in all required fields.", "info");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      showAlert("Error", "User not authenticated.", "error");
      return;
    }

    setLoading(true);

    try {
      await set(ref(database, `users/${user.uid}`), {
        firstName,
        lastName,
        userType,
        experience,
        description,
        email: user.email,
      });

      showAlert("Success", "Changes are saved.", "success");

    } catch (error: any) {
      showAlert("Error", error.message, "error");
    }

    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    showConfirmation(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      async () => {
        setModalVisible(false); // Close confirmation modal immediately

        const user = auth.currentUser;
        if (!user) {
          showAlert("Error", "No user found.", "error");
          return;
        }

        setLoading(true);
        try {
          await remove(ref(database, `users/${user.uid}`));
          await deleteUser(user);
          router.replace("/screens/Auth");
        } catch (error: any) {
          console.error("Delete Account Error:", error);
          if (error.code === "auth/requires-recent-login") {
            showAlert(
              "Security Check",
              "Please log out and log in again to delete your account for security reasons.",
              "info"
            );
          } else {
            showAlert("Error", "Failed to delete account: " + error.message, "error");
          }
        } finally {
          setLoading(false);
        }
      },
      "Delete",
      "#DC2626"
    );
  };


  // Helper for Avatar Initials
  const getInitials = (first: string, last: string) => {
    const f = first ? first[0].toUpperCase() : "";
    const l = last ? last[0].toUpperCase() : "";
    return f + l || (auth.currentUser?.email?.[0].toUpperCase() || "?");
  };

  const StatCard = ({ icon, value, label, color, bg }: any) => (
    <View style={[styles.statCard, { backgroundColor: bg }]}>
      <View style={[styles.statIconCircle, { backgroundColor: "rgba(255,255,255,0.7)" }]}>
        {icon}
      </View>
      <View>
        <Text style={[styles.statValue, { color: color }]}>{value || 0}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );

  if (initialLoading) {
    return (
      <View style={styles.screen}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingHeader}>
            <View style={styles.skeletonCircle} />
            <View style={{ flex: 1 }}>
              <View style={[styles.skeletonLine, { width: '60%', marginBottom: 8 }]} />
              <View style={[styles.skeletonLine, { width: '40%', height: 12 }]} />
            </View>
          </View>
          <View style={styles.loadingContent}>
            <View style={[styles.skeletonBox, { height: 120, marginBottom: 16 }]} />
            <View style={[styles.skeletonBox, { height: 60, marginBottom: 16 }]} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Header title="My Profile" onBack={() => router.back()} />

      <Animated.ScrollView
        style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 10 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2D2A26"]}
            tintColor="#2D2A26"
          />
        }
      >
        <View style={styles.profileHeader}>
          <LinearGradient
            colors={["#FF9F4A", "#FF6B35"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarContainer}
          >
            <Text style={styles.avatarText}>{getInitials(firstName, lastName)}</Text>
          </LinearGradient>
          <View style={styles.profileInfo}>
            <Text style={styles.profileEmail}>{auth.currentUser?.email}</Text>
            <Text style={styles.profileRole}>{userType || "User"}</Text>
          </View>
        </View>
        <Text style={styles.sectionTitle}>Your Activity</Text>
        <View style={styles.statsGrid}>
          <StatCard
            value={usageStats.tokenCalculator}
            label="Tokens Calc"
            color="#4F46E5"
            bg="#EEF2FF"
            icon={<Calculator size={20} color="#4F46E5" />}
          />
          <StatCard
            value={usageStats.promptLinter}
            label="Prompts Linted"
            color="#D97706"
            bg="#FFFBEB"
            icon={<ListChecks size={20} color="#D97706" />}
          />
          <StatCard
            value={usageStats.schemaGenerator}
            label="Schemas Gen"
            color="#059669"
            bg="#ECFDF5"
            icon={<FileJson size={20} color="#059669" />}
          />
          <StatCard
            value={usageStats.llmCostCalculator}
            label="Cost Est"
            color="#DC2626"
            bg="#FEF2F2"
            icon={<BadgeDollarSign size={20} color="#DC2626" />}
          />
        </View>
        {/* STATS GRID END */}

        {/* PERSONAL DETAILS FORM START */}
        <Text style={styles.sectionTitle}>Personal Details</Text>

        <View style={styles.formContainer}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>First Name</Text>
              <TextInput
                placeholder="John"
                placeholderTextColor="#9CA3AF"
                value={firstName}
                onChangeText={setFirstName}
                style={styles.input}
              />
            </View>
            <View style={{ width: 16 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>Last Name</Text>
              <TextInput
                placeholder="Doe"
                placeholderTextColor="#9CA3AF"
                value={lastName}
                onChangeText={setLastName}
                style={styles.input}
              />
            </View>
          </View>

          {/* USER TYPE */}
          <Text style={styles.inputLabel}>User Type</Text>
          <View style={styles.pillContainer}>
            {userTypes.map((type, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.pill, userType === type && styles.pillActive]}
                onPress={() => setUserType(type)}
              >
                <Text
                  style={[
                    styles.pillText,
                    userType === type && styles.pillTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* EXPERIENCE */}
          <Text style={styles.inputLabel}>Experience Level</Text>
          <View style={styles.pillContainer}>
            {experienceLevels.map((lvl, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.pill, experience === lvl && styles.pillActive]}
                onPress={() => setExperience(lvl)}
              >
                <Text
                  style={[
                    styles.pillText,
                    experience === lvl && styles.pillTextActive,
                  ]}
                >
                  {lvl}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* DESCRIPTION */}
          <Text style={styles.inputLabel}>Purpose</Text>
          <DescriptionInput
            value={description}
            onChangeText={setDescription}
            placeholder="Tell us how you use PromptKit..."
          />
        </View>

        <View style={{ marginTop: 24, gap: 12 }}>
          <PrimaryButton
            label={loading ? "Saving Profile..." : "Save Changes"}
            onPress={handleSave}
            disabled={loading}
          />

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteAccount}
            disabled={loading}
          >
            <Text style={styles.deleteButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>

      <CustomAlert
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
        onClose={modalOnConfirm || (() => setModalVisible(false))}
        buttonText={modalButtonText}
        showCancelButton={modalShowCancel}
        onCancel={() => setModalVisible(false)}
        confirmButtonColor={modalConfirmColor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FAF7F2",
    paddingHorizontal: 24,
  },

  // Profile Header
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 10,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: "#FF6B35",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
  },
  avatarText: {
    fontSize: 28,
    fontFamily: "Poppins_700Bold",
    color: "#FFFFFF",
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileEmail: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#1F2937",
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    color: "#6B7280",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },

  // Titles
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    color: "#111827",
    marginBottom: 16,
    letterSpacing: 0.5,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    width: '48%', // roughly half - gap
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
  statIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 13,
    fontFamily: "Poppins_500Medium",
    color: "#6B7280",
  },

  // Form
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    color: "#374151",
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontFamily: "Poppins_500Medium",
    color: "#1F2937",
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },

  pillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  pill: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  pillActive: {
    backgroundColor: "#1F2937",
    borderColor: "#1F2937",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4, // Android shadow
  },
  pillText: {
    fontSize: 13,
    fontFamily: "Poppins_500Medium",
    color: "#4B5563",
  },
  pillTextActive: {
    color: "#FFFFFF",
  },

  deleteButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#FEE2E2', // light red background
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  deleteButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#DC2626', // red text
  },

  // Skeleton
  loadingContainer: { flex: 1, justifyContent: "center", paddingHorizontal: 20 },
  loadingHeader: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 40, paddingTop: 60 },
  skeletonCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#E7E2DC" },
  skeletonLine: { height: 16, backgroundColor: "#E7E2DC", borderRadius: 8 },
  loadingContent: { marginTop: 20 },
  skeletonBox: { backgroundColor: "#E7E2DC", borderRadius: 16 },
  loadingTextContainer: { alignItems: "center", marginTop: 60 },
  loadingText: { fontSize: 18, fontFamily: "Poppins_600SemiBold", color: "#2D2A26", marginBottom: 16 },
});


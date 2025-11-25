import { auth, database } from "@/config/firebase";
import { getAllServiceUsage } from "@/utils/usageTracker";
import { useRouter } from "expo-router";
import { get, ref, set } from "firebase/database";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import PrimaryButton from "@/components/Button.tsx";
import DescriptionInput from "@/components/DescriptionCard.tsx";
import Header from "@/components/Header";

export default function ProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [usageStats, setUsageStats] = useState<Record<string, number>>({});

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
      Alert.alert("Error", "User not authenticated.");
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
    } catch (error: any) {
      Alert.alert("Error", "Failed to load profile: " + error.message);
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
    Alert.alert("Error", "Please fill in all required fields.");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    Alert.alert("Error", "User not authenticated.");
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

    Alert.alert("Success", "Profile updated successfully.");

    router.replace("/screens/Home");

  } catch (error: any) {
    Alert.alert("Error", error.message);
  }

  setLoading(false);
};


  if (initialLoading) {
    return (
      <View style={styles.screen}>
        <Text style={{ fontFamily: "Poppins_500Medium" }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        style={{ flex: 1 }}
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
        <Header title="My Profile" onBack={() => router.back()} />

        {/* FIRST NAME */}
        <Text style={styles.label}>First Name</Text>
        <View style={styles.inputField}>
          <TextInput
            placeholder="John"
            placeholderTextColor="#A8A29E"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
          />
        </View>

        {/* LAST NAME */}
        <Text style={styles.label}>Last Name</Text>
        <View style={styles.inputField}>
          <TextInput
            placeholder="Doe"
            placeholderTextColor="#A8A29E"
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
          />
        </View>

        {/* USER TYPE */}
        <Text style={styles.label}>User Type</Text>
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

        {/* EXPERIENCE LEVEL */}
        <Text style={styles.label}>Experience Level</Text>
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

        {/* PURPOSE */}
        <Text style={styles.label}>Purpose of Using PromptKit</Text>

        <DescriptionInput
          value={description}
          onChangeText={setDescription}
          placeholder="Enter details about your purpose..."
        />

        {/* USAGE STATS */}
        <Text style={styles.label}>Service Usage Statistics</Text>
        <View style={styles.usageContainer}>
          {[
            ["Token Calculator", usageStats.tokenCalculator],
            ["Prompt Linter", usageStats.promptLinter],
            ["Schema Generator", usageStats.schemaGenerator],
            ["LLM Cost Calculator", usageStats.llmCostCalculator],
          ].map(([label, value], index) => (
            <View key={index} style={styles.usageRow}>
              <Text style={styles.usageLabel}>{label}:</Text>
              <Text style={styles.usageValue}>{value || 0} times</Text>
            </View>
          ))}
        </View>

        <PrimaryButton
          label={loading ? "Saving..." : "Save Profile"}
          onPress={handleSave}
          disabled={loading}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FAF7F2",
    paddingHorizontal: 26,
  },

  label: {
    fontSize: 15,
    fontFamily: "Poppins_600SemiBold",
    color: "#2D2A26",
    marginTop: 16,
    marginBottom: 8,
  },

  inputField: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#E7E2DC",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  input: {
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
    color: "#2D2A26",
  },

  pillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10,
  },

  pill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#EFEDE8",
    borderRadius: 20,
  },

  pillActive: {
    backgroundColor: "#2D2A26",
  },

  pillText: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    color: "#2D2A26",
  },

  pillTextActive: {
    color: "#FFFFFF",
  },

  usageContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E7E2DC",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  usageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F0EC",
  },

  usageLabel: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    color: "#2D2A26",
  },

  usageValue: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: "#007AFF",
  },
});

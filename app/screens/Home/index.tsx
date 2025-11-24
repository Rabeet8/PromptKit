import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/config/firebase";
import { AdMobBannerAd } from "@/components/AdMobBanner";

export default function HomeScreen() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? "User logged in" : "User logged out");
      if (!user) {
        console.log("No user, redirecting to auth...");
        router.replace("/screens/Auth");
      }
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    console.log("Logout button pressed!");
    try {
      console.log("Logging out...");
      await signOut(auth);
      console.log("Sign out successful, navigating to auth...");
      router.replace("/screens/Auth");
    } catch (error: any) {
      console.error("Logout error:", error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#2D2A26" />
        </TouchableOpacity>

      {/* Greeting */}
      <Text style={styles.greeting}>
        Hello Genius,{"\n"}How can I help you today?
      </Text>

      {/* Feature Grid */}
      <View style={styles.grid}>

        {/* Token Counter */}
        <TouchableOpacity
          style={[styles.card, styles.blue]}
          onPress={() => router.push("/screens/TokenCalculator")}
        >
          <Ionicons name="calculator-outline" size={32} color="#2D2A26" />
          <Text style={styles.cardText}>Token Counter</Text>
        </TouchableOpacity>

        {/* Prompt Linter */}
        <TouchableOpacity
          style={[styles.card, styles.beige]}
          onPress={() => router.push("/screens/PromptLinter")}
        >
          <MaterialCommunityIcons
            name="text-box-check-outline"
            size={32}
            color="#2D2A26"
          />
          <Text style={styles.cardText}>Prompt Linter</Text>
        </TouchableOpacity>

        {/* Schema Generator */}
        <TouchableOpacity
          style={[styles.card, styles.green]}
          onPress={() => router.push("/screens/SchemaGenerator")}
        >
          <MaterialCommunityIcons name="code-json" size={32} color="#2D2A26" />
          <Text style={styles.cardText}>Schema Generator</Text>
        </TouchableOpacity>

        {/* Cost Calculator */}
        <TouchableOpacity
          style={[styles.card, styles.yellow]}
          onPress={() => router.push("/screens/LLMCostCalculator")}
        >
          <Ionicons name="pricetag-outline" size={32} color="#2D2A26" />
          <Text style={styles.cardText}>LLM Cost Calculator</Text>
        </TouchableOpacity>

        {/* Profile */}
        <TouchableOpacity
          style={[styles.card, styles.red]}
          onPress={() => router.push("/screens/UserInfo")}
        >
          <Ionicons name="person-outline" size={32} color="#2D2A26" />
          <Text style={styles.cardText}>My Profile</Text>
        </TouchableOpacity>

      </View>

      {/* AdSense Ad */}
      <View style={styles.adContainer}>
        <AdMobBannerAd size="banner" />
      </View>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FAF7F2",
  },
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: "#FAF7F2", // cream background
  },

  logoutBtn: {
    position: "absolute",
    top: 20,
    right: 20,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    zIndex: 10,
  },

  greeting: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2D2A26",
    marginTop: 30,
    marginBottom: 25,
    lineHeight: 34,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 22,
    marginTop: 10,
  },

  card: {
    width: "48%",
    height: 160,
    borderRadius: 24,
    padding: 18,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  cardText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2D2A26",
  },

  /* Softer pastel colors to match cream theme */
  blue: {
    backgroundColor: "#E4ECF8", // Soft cloud blue
  },
  beige: {
    backgroundColor: "#EFE7DD", // Warm neutral beige
  },
  green: {
    backgroundColor: "#E2F1E8", // Pastel mint-green
  },
  yellow: {
    backgroundColor: "#F7EDC4", // Soft butter yellow
  },
  red: {
    backgroundColor: "#F8E4E4", // Soft rose
  },

  adContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

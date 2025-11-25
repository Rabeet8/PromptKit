import Dev2Image from "@/assets/images/Huzaifa.jpg";
import Dev1Image from "@/assets/images/Rabeet.jpg";
import DeveloperCard from "@/components/DeveloperCard";

import { AdMobBannerAd } from "@/components/AdMobBanner";
import { auth } from "@/config/firebase";
import { DeveloperInfo } from "@/types";

import {
  BadgeDollarSign,
  Blocks,
  ListChecks,
  LogOut,
  ScanText,
  UserRound
} from "lucide-react-native";

import { useRouter } from "expo-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.replace("/screens/Auth");
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/screens/Auth");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const FeatureCard = ({ icon, label, route, colors }: any) => (
    <Pressable
      onPress={() => router.push(route)}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.bg,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
      ]}
    >
      <View style={[styles.iconCircle, { backgroundColor: colors.iconBg }]}>
        {icon}
      </View>
      <Text style={styles.cardText}>{label}</Text>
    </Pressable>
  );

  const developers: DeveloperInfo[] = [
    {
      id: 1,
      name: "Syed Rabeet",
      title: "Software Engineer",
      image: Dev1Image,
      socials: {
        github: "https://github.com/Rabeet8",
        linkedin: "https://www.linkedin.com/in/syedrabeet/",
      },
    },
    {
      id: 2,
      name: "Huzaifa Ghori",
      title: "Software Engineer",
      image: Dev2Image,
      socials: {
        github: "https://github.com/Huzaifa1910/",
        linkedin: "https://www.linkedin.com/in/huzaifa-ghori-2087771b3/",
      },
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          
          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <LogOut size={22} color="#2D2A26" strokeWidth={2.5} />
          </TouchableOpacity>

          {/* Greeting */}
          <Text style={styles.greeting}>
            Hello Genius,{"\n"}
            <Text style={styles.greetingSub}>How can I help you today?</Text>
          </Text>

          {/* Feature Grid */}
          <View style={styles.grid}>
           <FeatureCard
  icon={<ScanText size={32} color="#2D2A26" strokeWidth={2.3} />}
  label="Token Counter"
  route="/screens/TokenCalculator"
  colors={{ bg: "#E9F0FF", iconBg: "#D3E1FF" }}
/>

<FeatureCard
  icon={<ListChecks size={32} color="#2D2A26" strokeWidth={2.3} />}
  label="Prompt Linter"
  route="/screens/PromptLinter"
  colors={{ bg: "#F5EEE2", iconBg: "#E9DFD1" }}
/>

<FeatureCard
  icon={<Blocks size={32} color="#2D2A26" strokeWidth={2.3} />}
  label="Schema Generator"
  route="/screens/SchemaGenerator"
  colors={{ bg: "#E3F8EC", iconBg: "#CFF3DC" }}
/>

            <FeatureCard
              icon={
                <BadgeDollarSign
                  size={32}
                  color="#2D2A26"
                  strokeWidth={2.3}
                />
              }
              label="LLM Cost Calculator"
              route="/screens/LLMCostCalculator"
              colors={{ bg: "#FFF4D8", iconBg: "#F8E8BB" }}
            />

            <FeatureCard
              icon={<UserRound size={32} color="#2D2A26" strokeWidth={2.3} />}
              label="My Profile"
              route="/screens/UserInfo"
              colors={{ bg: "#FFE8E8", iconBg: "#FFD6D6" }}
            />
          </View>

          {/* Ad Section */}
          <View style={styles.adContainer}>
            <AdMobBannerAd size="banner" />
          </View>

          {/* Developer Section */}
          <View style={{ marginTop: 30 }}>
            <Text style={styles.devHeader}>Developed By</Text>

            {developers.map((dev) => (
              <DeveloperCard
                key={dev.id}
                developer={dev}
                onPress={(id) => console.log("Pressed Developer ID:", id)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FAF7F2",
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
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    zIndex: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  greeting: {
    fontSize: 30,
    fontFamily: "Poppins_700Bold",
    color: "#2D2A26",
    marginTop: 40,
    marginBottom: 25,
    lineHeight: 38,
  },
  greetingSub: {
    fontSize: 24,
    fontFamily: "Poppins_500Medium",
    color: "#8B7E74",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 22,
  },

  card: {
    width: "48%",
    height: 160,
    borderRadius: 26,
    padding: 18,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },

  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  cardText: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#2D2A26",
  },

  adContainer: {
    marginTop: 22,
    alignItems: "center",
  },

  devHeader: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
    marginBottom: 16,
    color: "#2D2A26",
  },
});

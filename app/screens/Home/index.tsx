import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
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

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: "#FAF7F2", // cream background
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
});

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import PrimaryButton from "@/components/Button.tsx";
import DescriptionInput from "@/components/DescriptionCard.tsx";
import Header from "@/components/Header";

import { LintAPI } from "@/api/lint";
import * as Clipboard from "expo-clipboard";
import { Platform, ToastAndroid } from "react-native";

export default function PromptLinterScreen() {
  const router = useRouter();

  const [prompt, setPrompt] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [issues, setIssues] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState("");
  const [improvedPrompt, setImprovedPrompt] = useState("");


  // 🔥 Handle API Call
 const handleLint = async () => {
  if (!prompt.trim()) return;

  try {
    setLoading(true);

    const res = await LintAPI.lintPrompt({
      prompt: prompt,
      model: "gpt-4o-mini",   // ✅ THIS IS SENT
    });

    console.log(res,'resssss')
    setScore(res.score);
    setIssues(res.issues || []);
    setImprovedPrompt(res.improved_prompt || "");
    setAnalysis(res.analysis || "");

  } finally {
    setLoading(false);
  }
};

const handleCopyImprovedPrompt = async () => {
  if (!improvedPrompt) return;

  await Clipboard.setStringAsync(improvedPrompt);

  if (Platform.OS === "android") {
    ToastAndroid.show("Prompt copied!", ToastAndroid.SHORT);
  } else {
    alert("Prompt copied!");
  }
};


  return (
    <View style={styles.screen}>
      <Header
        title="Prompt Linter"
        onBack={() => router.back()}
        onSettingsPress={() => {}}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90, paddingTop: 20 }}
      >
  
       {/* INPUT */}
        <Text style={styles.label}>Enter Prompt</Text>

        <DescriptionInput
          value={prompt}
          onChangeText={setPrompt}
          placeholder="Enter your prompt to analyze"
        />

        <PrimaryButton
          label={loading ? "Analyzing..." : "Analyze Prompt"}
          onPress={handleLint}
        />

        {/* RESULTS */}
        {score !== null && (
          <>
            {/* SCORE */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Score</Text>
              <Text style={styles.scoreValue}>{score}/100</Text>
            </View>

            {/* ISSUES */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Issues</Text>
              {issues.map((item, index) => (
                <Text key={index} style={styles.listItem}>
                  • {item}
                </Text>
              ))}
            </View>

            {/* IMPROVED PROMPT */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Improved Prompt</Text>
               <TouchableOpacity onPress={handleCopyImprovedPrompt}>
  <Ionicons name="copy-outline" size={20} color="#2D2A26" />
</TouchableOpacity>

              </View>
              <Text style={styles.bodyText}>{improvedPrompt}</Text>
            </View>

            {/* ANALYSIS */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Analysis</Text>
              <Text style={styles.bodyText}>{analysis}</Text>
            </View>
          </>
        )}
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
    fontSize: 14,
    fontWeight: "600",
    color: "#2D2A26",
    marginTop: 14,
    marginBottom: 6,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 16,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D2A26",
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: "800",
    color: "#2D2A26",
  },
  listItem: {
    fontSize: 15,
    color: "#2D2A26",
    marginBottom: 4,
  },
  bodyText: {
    fontSize: 14,
    color: "#2D2A26",
    lineHeight: 20,
  },
});

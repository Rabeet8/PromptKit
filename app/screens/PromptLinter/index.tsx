import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

import { AlertTriangle, ClipboardCopy, FileText, Sparkles } from "lucide-react-native";

import PrimaryButton from "@/components/Button.tsx";
import DescriptionInput from "@/components/DescriptionCard.tsx";
import Header from "@/components/Header";

import { LintAPI } from "@/api/lint";
import { AdMobBannerAd } from "@/components/AdMobBanner";
import {
  logInferenceError,
  logInferenceStart,
  logInferenceSuccess,
} from "@/utils/inferenceLogger";
import { trackServiceUsage } from "@/utils/usageTracker";

export default function PromptLinterScreen() {
  const router = useRouter();

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [issues, setIssues] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState("");
  const [improvedPrompt, setImprovedPrompt] = useState("");

  const handleLint = async () => {
    if (!prompt.trim()) return;

    const requestData = { prompt, model: "gpt-4o-mini" };
    const startTime = logInferenceStart("promptLinter", requestData);

    try {
      setLoading(true);
      const res = await LintAPI.lintPrompt(requestData);

      setScore(res.score);
      setIssues(res.issues || []);
      setImprovedPrompt(res.improved_prompt || "");
      setAnalysis(res.analysis || "");

      await trackServiceUsage("promptLinter");
      await logInferenceSuccess("promptLinter", requestData, res, startTime);
    } catch (error) {
      await logInferenceError("promptLinter", requestData, error, startTime);
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

  const ResultCard = ({
    title,
    icon,
    children,
    rightAction,
  }: {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    rightAction?: React.ReactNode;
  }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          {icon}
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        {rightAction}
      </View>
      {children}
    </View>
  );

  return (
    <View style={styles.screen}>
      <Header title="Prompt Linter" onBack={() => router.back()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 25 }}
      >
        {/* INPUT */}
        <Text style={styles.label}>Enter Prompt</Text>

        <DescriptionInput
          value={prompt}
          onChangeText={setPrompt}
          placeholder="Paste your prompt here and I’ll analyze it like a pro..."
        />

        <PrimaryButton
          label={loading ? "Analyzing..." : "Analyze Prompt"}
          onPress={handleLint}
          disabled={loading}
        />

        {/* RESULTS */}
        {score !== null && (
          <>
            {/* SCORE */}
            <ResultCard
              title="Score"
              icon={<Sparkles size={20} color="#2D2A26" />}
            >
              <Text style={styles.scoreValue}>{score}/100</Text>

              {/* tiny helper text */}
              <Text style={styles.scoreHint}>
                {score >= 80
                  ? "Solid prompt 👌"
                  : score >= 50
                  ? "Needs some tweaks"
                  : "Weak prompt — improve it"}
              </Text>
            </ResultCard>

            {/* ISSUES */}
            <ResultCard
              title="Issues"
              icon={<AlertTriangle size={20} color="#2D2A26" />}
            >
              {issues.length === 0 ? (
                <Text style={styles.bodyText}>No major issues found 🎉</Text>
              ) : (
                issues.map((item, index) => (
                  <View key={index} style={styles.issueRow}>
                    <Text style={styles.issueDot}>•</Text>
                    <Text style={styles.issueText}>{item}</Text>
                  </View>
                ))
              )}
            </ResultCard>

            {/* IMPROVED PROMPT */}
            <ResultCard
              title="Improved Prompt"
              icon={<FileText size={20} color="#2D2A26" />}
              rightAction={
                <TouchableOpacity onPress={handleCopyImprovedPrompt}>
                  <ClipboardCopy size={20} color="#2D2A26" strokeWidth={2} />
                </TouchableOpacity>
              }
            >
              <Text style={styles.bodyText}>{improvedPrompt}</Text>
            </ResultCard>

            {/* ANALYSIS */}
            <ResultCard title="Analysis" icon={<Sparkles size={20} color="#2D2A26" />}>
              <Text style={styles.bodyText}>{analysis}</Text>
            </ResultCard>
          </>
        )}
      </ScrollView>

      {/* Ad */}
      <View style={styles.adContainer}>
        <AdMobBannerAd size="banner" />
      </View>
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
    marginBottom: 12,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 18,
    marginTop: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  cardTitle: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#2D2A26",
  },

  scoreValue: {
    fontSize: 34,
    fontFamily: "Poppins_700Bold",
    color: "#2D2A26",
    marginTop: 2,
  },

  scoreHint: {
    fontSize: 13.5,
    fontFamily: "Poppins_500Medium",
    color: "#7A736C",
    marginTop: 4,
  },

  issueRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginBottom: 6,
  },

  issueDot: {
    fontSize: 16,
    lineHeight: 20,
    color: "#2D2A26",
    fontFamily: "Poppins_700Bold",
  },

  issueText: {
    flex: 1,
    fontSize: 14.5,
    fontFamily: "Poppins_400Regular",
    color: "#2D2A26",
    lineHeight: 20,
  },

  bodyText: {
    fontSize: 14.5,
    fontFamily: "Poppins_400Regular",
    color: "#2D2A26",
    lineHeight: 21,
  },

  adContainer: {
    marginTop: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});

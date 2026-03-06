import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { AlertTriangle, ClipboardCopy, FileText, Sparkles } from "lucide-react-native";

import CustomAlert from "@/components/CustomAlert";

import PrimaryButton from "@/components/Button.tsx";
import DescriptionInput from "@/components/DescriptionCard.tsx";
import Header from "@/components/Header";

import { LintAPI } from "@/api/lint";
import { useSubscription } from "@/contexts/SubscriptionContext";
import {
  logInferenceError,
  logInferenceStart,
  logInferenceSuccess,
} from "@/utils/inferenceLogger";

export default function PromptLinterScreen() {
  const router = useRouter();
  const { checkAccess, incrementUsage } = useSubscription();
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(20))[0];

  React.useEffect(() => {
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

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [issues, setIssues] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState("");

  const [improvedPrompt, setImprovedPrompt] = useState("");

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

  const handleLint = async () => {
    if (!prompt.trim()) return;

    // Reset old results
    setScore(null);
    setIssues([]);
    setImprovedPrompt("");
    setAnalysis("");

    const requestData = { prompt, model: "gpt-4o-mini" };
    const startTime = logInferenceStart("promptLinter", requestData);

    if (!checkAccess("promptLinter")) return;

    try {
      setLoading(true);
      const res = await LintAPI.lintPrompt(requestData);

      if (res.error || res.score === undefined || res.score === null || res.analysis?.toLowerCase().includes("error")) {
        throw new Error(res.error || res.analysis || "Invalid response");
      }

      setScore(res.score);
      setIssues(res.issues || []);
      setImprovedPrompt(res.improved_prompt || "");
      setAnalysis(res.analysis || "");

      setAnalysis(res.analysis || "");

      await incrementUsage("promptLinter");
      await logInferenceSuccess("promptLinter", requestData, res, startTime);
    } catch (error: any) {
      const errorMessage = "This feature is not available at the moment, please contact the team.";
      showAlert("Analysis Failed", errorMessage, "error");
      await logInferenceError("promptLinter", requestData, error, startTime);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyImprovedPrompt = async () => {
    if (!improvedPrompt) return;
    await Clipboard.setStringAsync(improvedPrompt);
    showAlert("Copied!", "Improved prompt copied to clipboard.", "success");
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

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 25 }}
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
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
              icon={<Sparkles size={22} color="#8B5CF6" />}
            >
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
                <Text style={[
                  styles.scoreValue,
                  { color: score >= 80 ? "#10B981" : score >= 50 ? "#F59E0B" : "#EF4444" }
                ]}>
                  {score}
                </Text>
                <Text style={styles.scoreMax}>/100</Text>
              </View>

              <Text style={styles.scoreHint}>
                {score >= 80
                  ? "Solid prompt! Ready to generate."
                  : score >= 50
                    ? "Good start, but needs some refinement."
                    : "Weak prompt. Consider adding more details."}
              </Text>
            </ResultCard>

            {/* ISSUES */}
            <ResultCard
              title="Issues"
              icon={<AlertTriangle size={22} color="#F59E0B" />}
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
              icon={<FileText size={22} color="#10B981" />}
              rightAction={
                <TouchableOpacity onPress={handleCopyImprovedPrompt} style={styles.copyButton}>
                  <ClipboardCopy size={18} color="#4B5563" strokeWidth={2} />
                </TouchableOpacity>
              }
            >
              <Text style={styles.monospaceText}>{improvedPrompt}</Text>
            </ResultCard>

            {/* ANALYSIS */}
            <ResultCard title="Analysis" icon={<Sparkles size={22} color="#3B82F6" />}>
              <Text style={styles.bodyText}>{analysis}</Text>
            </ResultCard>
          </>
        )}
      </Animated.ScrollView>

      <CustomAlert
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
        onClose={() => setModalVisible(false)}
      />
    </View >
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
    padding: 24,
    borderRadius: 24,
    marginTop: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  cardTitle: {
    fontSize: 17,
    fontFamily: "Poppins_600SemiBold",
    color: "#1F2937",
  },

  scoreValue: {
    fontSize: 42,
    fontFamily: "Poppins_700Bold",
    marginTop: 4,
  },

  scoreMax: {
    fontSize: 18,
    fontFamily: "Poppins_500Medium",
    color: "#9CA3AF",
    marginBottom: 6,
  },

  scoreHint: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    color: "#6B7280",
    marginTop: 8,
  },

  issueRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 8,
  },

  issueDot: {
    fontSize: 18,
    lineHeight: 22,
    color: "#EF4444",
    fontFamily: "Poppins_700Bold",
  },

  issueText: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Poppins_400Regular",
    color: "#374151",
    lineHeight: 22,
  },

  bodyText: {
    fontSize: 15,
    fontFamily: "Poppins_400Regular",
    color: "#374151",
    lineHeight: 24,
  },

  monospaceText: {
    fontSize: 14,
    fontFamily: "monospace",
    color: "#374151",
    lineHeight: 22,
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },

  copyButton: {
    padding: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  }
});

import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Calculator } from "lucide-react-native";

import PrimaryButton from "@/components/Button.tsx";
import DescriptionInput from "@/components/DescriptionCard.tsx";
import Header from "@/components/Header";
import ModelDropdown from "@/components/modelDropdown";

import { TokenizeAPI } from "@/api/tokenize";
import { AdMobBannerAd } from "@/components/AdMobBanner";
import {
    logInferenceError,
    logInferenceStart,
    logInferenceSuccess,
} from "@/utils/inferenceLogger";
import { trackServiceUsage } from "@/utils/usageTracker";

export default function TokenCalculatorScreen() {
  const router = useRouter();

  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [description, setDescription] = useState("");

  const [tokenCount, setTokenCount] = useState<number | null>(null);
  const [characterCount, setCharacterCount] = useState<number | null>(null);
  const [approx, setApprox] = useState<boolean | null>(null);

  const [loading, setLoading] = useState(false);

  const models = [
    "GPT-4o",
    "GPT-4o Mini",
    "GPT-4 Turbo",
    "GPT-3.5 Turbo",
    "Gemini 1.5 Flash",
    "Claude 3 Haiku",
    "Claude 3 Opus",
    "Llama 3 70B",
    "Llama 3 8B",
  ];

  // 🔥 TOKENIZE HANDLER
  const handleTokenize = async () => {
    if (!selectedModel) return alert("Please select a model.");
    if (!description.trim()) return alert("Please enter text to tokenize.");

    const requestData = { model: selectedModel, text: description };
    console.log("📤 Tokenize Request:", requestData);
    
    const startTime = logInferenceStart("tokenCalculator", requestData);

    try {
      setLoading(true);
      const res = await TokenizeAPI.tokenize(requestData);
      
      // 🔍 LOG THE API RESULT
      console.log("✅ Tokenize API Result:", {
        tokens: res.tokens,
        characters: res.characters,
        approx: res.approx,
        fullResponse: res
      });

      setTokenCount(res.tokens);
      setCharacterCount(res.characters);
      setApprox(res.approx);

      await trackServiceUsage("tokenCalculator");
      await logInferenceSuccess("tokenCalculator", requestData, res, startTime);
    } catch (err) {
      console.error("❌ Tokenize API Error:", err);
      await logInferenceError("tokenCalculator", requestData, err, startTime);
    } finally {
      setLoading(false);
    }
  };

  const ResultCard = ({
    icon,
    title,
    children,
  }: {
    icon?: React.ReactNode;
    title: string;
    children: React.ReactNode;
  }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          {icon}
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
      </View>

      {children}
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Token Calculator" onBack={() => router.back()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 20 }}
      >
        {/* MODEL SELECTOR */}
        <ModelDropdown
          label="Model"
          value={selectedModel || "Choose your model"}
          isOpen={dropdownOpen}
          options={models}
          onToggle={() => setDropdownOpen(!dropdownOpen)}
          onSelect={(m) => {
            setSelectedModel(m);
            setDropdownOpen(false);
          }}
        />

        {/* PROMPT INPUT */}
        <DescriptionInput
          label="Prompt"
          value={description}
          onChangeText={setDescription}
          placeholder="Write or paste your text to tokenize..."
        />

        {/* BUTTON */}
        <PrimaryButton
          label={loading ? "Tokenizing..." : "Tokenize"}
          onPress={handleTokenize}
          disabled={loading}
        />

        {/* RESULTS */}
        {tokenCount !== null && (
          <ResultCard
            title="Tokenization Result"
            icon={<Calculator size={20} color="#2D2A26" strokeWidth={2} />}
          >
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Total Tokens</Text>
              <Text style={styles.resultValue}>{tokenCount}</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Characters</Text>
              <Text style={styles.resultValue}>{characterCount}</Text>
            </View>

          </ResultCard>
        )}
      </ScrollView>

      <View style={styles.adContainer}>
        <AdMobBannerAd size="banner" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF7F2",
    paddingHorizontal: 26,
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
    marginBottom: 14,
  },

  cardTitle: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#2D2A26",
  },

  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },

  resultLabel: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    color: "#6A655F",
  },

  resultValue: {
    fontSize: 15,
    fontFamily: "Poppins_600SemiBold",
    color: "#2D2A26",
  },

  adContainer: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

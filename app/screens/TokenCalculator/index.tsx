import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import PrimaryButton from "@/components/Button.tsx";
import DescriptionInput from "@/components/DescriptionCard.tsx";
import Header from "@/components/Header";
import ModelDropdown from "@/components/modelDropdown";

import { TokenizeAPI } from "@/api/tokenize";
import { trackServiceUsage } from "@/utils/usageTracker";

export default function TokenCalculatorScreen() {
  const router = useRouter();

  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [description, setDescription] = useState("");

  // INPUT VARIABLES
  const [inputTokens, setInputTokens] = useState("0");
  const [outputTokens, setOutputTokens] = useState("0");
  const [callsPerDay, setCallsPerDay] = useState("100");
  const [cacheRate, setCacheRate] = useState(25);

  // COST RESULTS
  const [dailyCost, setDailyCost] = useState("—");
  const [monthlyCost, setMonthlyCost] = useState("—");
  const [yearlyCost, setYearlyCost] = useState("—");

  // TOKENIZE RESPONSE FIELDS
  const [tokenCount, setTokenCount] = useState<number | null>(null);
  const [characterCount, setCharacterCount] = useState<number | null>(null);
  const [approx, setApprox] = useState<boolean | null>(null);

  // LOADING
  const [loading, setLoading] = useState(false);

  // Static models for now (you can replace with API later)
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

  // 🔥 TOKENIZE API CALL
  const handleTokenize = async () => {
    if (!selectedModel) {
      alert("Please select a model.");
      return;
    }

    if (!description.trim()) {
      alert("Please enter text to tokenize.");
      return;
    }

    try {
      setLoading(true);

      const res = await TokenizeAPI.tokenize({
        model: selectedModel,
        text: description,
      });

      // Example response:
      // { tokens: 188, characters: 976, approx: false }

      setTokenCount(res.tokens);
      setCharacterCount(res.characters);
      setApprox(res.approx);

      // Also update input token field for cost calculation
      setInputTokens(String(res.tokens));

      // Track usage
      await trackServiceUsage("tokenCalculator");
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <Header
        title="Token Calculator"
        onBack={() => router.back()}
        onSettingsPress={() => {}}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 10 }}
      >
        {/* MODEL DROPDOWN */}
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

        {/* DESCRIPTION */}
        <DescriptionInput
          label="Prompt"
          value={description}
          onChangeText={setDescription}
          placeholder="Enter prompt to tokenize..."
        />

        {/* TOKENIZE BUTTON */}
        <PrimaryButton
          label={loading ? "Tokenizing..." : "Tokenize"}
          onPress={handleTokenize}
        />

        {/* DISPLAY TOKENIZE RESULTS */}
        {tokenCount !== null && (
          <View style={styles.resultBox}>
            <Text style={styles.resultLabel}>Tokenization Result</Text>

            <Text style={styles.resultText}>Tokens: {tokenCount}</Text>
            <Text style={styles.resultText}>Characters: {characterCount}</Text>
          
          </View>
        )}

        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF7F2",
    padding: 26,
  },
  resultBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    borderColor: "#E5DED5",
    borderWidth: 1,
  },
  resultLabel: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 10,
    color: "#2D2A26",
  },
  resultText: {
    fontSize: 14,
    color: "#4A4642",
    marginTop: 4,
  },
});

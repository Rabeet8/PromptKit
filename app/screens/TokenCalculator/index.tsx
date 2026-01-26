import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

import CustomAlert from "@/components/CustomAlert";
import { Calculator } from "lucide-react-native";

import PrimaryButton from "@/components/Button.tsx";
import DescriptionInput from "@/components/DescriptionCard.tsx";
import Header from "@/components/Header";
import ModelDropdown from "@/components/modelDropdown";

import { ModelsAPI } from "@/api/models";
import { TokenizeAPI } from "@/api/tokenize";
import {
  logInferenceError,
  logInferenceStart,
  logInferenceSuccess,
} from "@/utils/inferenceLogger";
import { trackServiceUsage } from "@/utils/usageTracker";

export default function TokenCalculatorScreen() {
  const router = useRouter();
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

  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [description, setDescription] = useState("");

  const [tokenCount, setTokenCount] = useState<number | null>(null);
  const [characterCount, setCharacterCount] = useState<number | null>(null);
  const [approx, setApprox] = useState<boolean | null>(null);



  const [loading, setLoading] = useState(false);

  // Custom Alert State
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

  const [models, setModels] = useState<string[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);

  React.useEffect(() => {
    const loadModels = async () => {
      try {
        setLoadingModels(true);
        const res = await ModelsAPI.getModels();
        setModels(res.models || []);
      } catch (err) {
        console.log("Failed to fetch models:", err);
      } finally {
        setLoadingModels(false);
      }
    };
    loadModels();
  }, []);

  const handleTokenize = async () => {
    if (!selectedModel) return showAlert("Input Required", "Please select a model.", "info");
    if (!description.trim()) return showAlert("Input Required", "Please enter text to tokenize.", "info");

    const requestData = { model: selectedModel, text: description };

    const startTime = logInferenceStart("tokenCalculator", requestData);

    try {
      setLoading(true);
      const res = await TokenizeAPI.tokenize(requestData);

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
    } catch (err: any) {
      const errorMessage = err.message || "An error occurred during tokenization.";
      console.error("❌ Tokenize API Error:", err);
      showAlert("Tokenization Failed", errorMessage, "error");
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

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 20 }}
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
      >
        {/* MODEL SELECTOR */}
        <ModelDropdown
          label="Model"
          value={selectedModel || "Choose your model"}
          isOpen={dropdownOpen}
          options={models}
          loading={loadingModels}
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
            icon={<Calculator size={22} color="#4F46E5" strokeWidth={2} />}
          >
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Total Tokens</Text>
              <Text style={styles.resultValue}>{tokenCount}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Characters</Text>
              <Text style={styles.resultValue}>{characterCount}</Text>
            </View>

          </ResultCard>
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
  container: {
    flex: 1,
    backgroundColor: "#FAF7F2",
    paddingHorizontal: 26,
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
    marginBottom: 18,
    alignItems: "center",
  },

  cardTitle: {
    fontSize: 17,
    fontFamily: "Poppins_600SemiBold",
    color: "#1F2937",
  },

  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    alignItems: 'center',
  },

  resultLabel: {
    fontSize: 15,
    fontFamily: "Poppins_500Medium",
    color: "#6B7280",
  },

  resultValue: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    color: "#111827",
  },

  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 8,
  },
});

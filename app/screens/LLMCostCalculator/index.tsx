import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

import { CostAPI } from "@/api/cost";
import { ModelsAPI } from "@/api/models";

import CustomAlert from "@/components/CustomAlert";

import PrimaryButton from "@/components/Button.tsx";
import CacheSlider from "@/components/CacheSlider";
import CostCard from "@/components/CostCard";
import Header from "@/components/Header";
import InputCard from "@/components/InputCard";
import InputRow from "@/components/InputRows";
import ModelDropdown from "@/components/modelDropdown";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { logInferenceError, logInferenceStart, logInferenceSuccess } from "@/utils/inferenceLogger";

export default function CostCalculatorScreen() {
  const router = useRouter();
  const { checkAccess, incrementUsage } = useSubscription();
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(20))[0];

  useEffect(() => {
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

  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const [loadingModels, setLoadingModels] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [inputTokens, setInputTokens] = useState("1500");
  const [outputTokens, setOutputTokens] = useState("500");
  const [callsPerDay, setCallsPerDay] = useState("100");
  const [cacheRate, setCacheRate] = useState(25);

  const [daily, setDaily] = useState("—");
  const [monthly, setMonthly] = useState("—");
  const [monthlyCache, setMonthlyCache] = useState("—"); // NEW third result

  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
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

  const calculateCost = async () => {
    console.log('cossst')
    if (!selectedModel) {
      showAlert("Input Required", "Please select a model.", "info");
      return;
    }

    const requestData = {
      model: selectedModel,
      input_tokens: Number(inputTokens),
      output_tokens: Number(outputTokens),
      calls_per_day: Number(callsPerDay),
      cache_rate: cacheRate / 100, // convert % → decimal (e.g., 25% → 0.25)
    };

    const startTime = logInferenceStart("llmCostCalculator", requestData);

    // 🔒 Check subscription limit
    if (!checkAccess()) return;

    try {
      setLoading(true);

      const res = await CostAPI.calculateCost(requestData);
      console.log(res, 'LLMM')
      // Update UI values
      setDaily(res.daily_cost.toString());
      setMonthly(res.monthly_cost.toString());
      setMonthlyCache(res.monthly_cost_with_cache.toString());

      // Track usage
      await incrementUsage("llmCostCalculator");

      // Log successful inference
      await logInferenceSuccess("llmCostCalculator", requestData, res, startTime);

    } catch (err: any) {
      console.log("Cost API Error:", err);
      showAlert("Calculation Failed", err.message || "An error occurred.", "error");
      // Log failed inference
      await logInferenceError("llmCostCalculator", requestData, err, startTime);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="LLM Cost Estimator"
        onBack={() => router.back()}
        onSettingsPress={() => { }}
      />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 10 }}
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
      >
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

        <Text style={styles.sectionLabel}>INPUT VARIABLES</Text>

        <InputRow
          left={{
            label: "Input Tokens",
            value: inputTokens,
            onChange: setInputTokens,
            placeholder: "1500",
            keyboardType: "numeric",
          }}
          right={{
            label: "Output Tokens",
            value: outputTokens,
            onChange: setOutputTokens,
            placeholder: "500",
            keyboardType: "numeric",
          }}
        />

        <InputCard
          label="API Calls per Day"
          value={callsPerDay}
          onChange={setCallsPerDay}
          placeholder="100"
          keyboardType="numeric"
        />

        <CacheSlider
          label="Cache Hit Rate"
          value={cacheRate}
          onChange={setCacheRate}
        />

        <Text style={styles.sectionLabel}>ESTIMATED COST</Text>

        <CostCard title="Daily Cost" monthlyCost={daily} />
        <CostCard title="Monthly Cost" monthlyCost={monthly} />
        <CostCard title="Monthly Cost (With Cache)" monthlyCost={monthlyCache} />

        <PrimaryButton
          label={loading ? "Calculating..." : "Calculate"}
          onPress={calculateCost}
        />
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
    padding: 26,
  },
  sectionLabel: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    letterSpacing: 0.5,
    color: "#6B7280",
    marginBottom: 12,
    marginTop: 24,
  },
});



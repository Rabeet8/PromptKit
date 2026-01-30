import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import CustomAlert from "@/components/CustomAlert";
import { ClipboardCopy, FileJson } from "lucide-react-native";

import PrimaryButton from "@/components/Button.tsx";
import DescriptionInput from "@/components/DescriptionCard.tsx";
import Header from "@/components/Header";

import { SchemaAPI } from "@/api/schema";

import { useSubscription } from "@/contexts/SubscriptionContext";
import {
  logInferenceError,
  logInferenceStart,
  logInferenceSuccess,
} from "@/utils/inferenceLogger";

export default function SchemaGenerator() {
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
  const [description, setDescription] = useState("");
  const [schema, setSchema] = useState("");

  const [validExample, setValidExample] = useState("");
  const [invalidExample, setInvalidExample] = useState("");
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

  const copy = async (text: string) => {
    if (!text) return;
    await Clipboard.setStringAsync(text);

    if (!text) return;
    await Clipboard.setStringAsync(text);
    showAlert("Copied!", "JSON copied to clipboard.", "success");
  };

  const handleGenerate = async () => {
    if (!description.trim()) return;

    const requestData = { description };

    const startTime = logInferenceStart("schemaGenerator", requestData);

    if (!checkAccess()) return;

    try {
      setLoading(true);
      const res = await SchemaAPI.generateSchema(requestData);

      setSchema(JSON.stringify(res.schema, null, 2));
      setValidExample(JSON.stringify(res.valid_example, null, 2));
      setInvalidExample(JSON.stringify(res.invalid_example, null, 2));

      setInvalidExample(JSON.stringify(res.invalid_example, null, 2));

      await incrementUsage("schemaGenerator");
      await logInferenceSuccess("schemaGenerator", requestData, res, startTime);
    } catch (err: any) {
      const errorMessage = err.message || "An error occurred during schema generation.";
      showAlert("Generation Failed", errorMessage, "error");
      await logInferenceError("schemaGenerator", requestData, err, startTime);
    } finally {
      setLoading(false);
    }
  };

  const renderCard = (title: string, text: string) => (
    <View style={styles.outputCard}>
      <View style={styles.outputHeader}>
        <View style={styles.outputTitleRow}>
          <FileJson size={20} color="#2D2A26" />
          <Text style={styles.outputTitle}>{title}</Text>
        </View>

        <TouchableOpacity onPress={() => copy(text)}>
          <ClipboardCopy size={20} color="#2D2A26" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.jsonContainer}
        nestedScrollEnabled
        horizontal={false}
      >
        <ScrollView horizontal>
          <Text style={styles.outputText}>{text}</Text>
        </ScrollView>
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.screen}>
      <Header title="Schema Generator" onBack={() => router.back()} />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90, paddingTop: 25 }}
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
      >
        {/* LABEL */}
        <Text style={styles.label}>Enter your text</Text>

        <DescriptionInput
          value={description}
          onChangeText={setDescription}
          placeholder="Describe your data structure and I will generate a JSON schema for you..."
        />

        <PrimaryButton
          label={loading ? "Generating..." : "Generate Schema"}
          onPress={handleGenerate}
          disabled={loading}
        />

        {/* OUTPUT CARDS */}
        {schema !== "" && (
          <>
            {renderCard("JSON Schema", schema)}
            {renderCard("Valid Example", validExample)}
            {renderCard("Invalid Example", invalidExample)}
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

  /* OUTPUT CARDS */
  outputCard: {
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

  outputHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  outputTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  outputTitle: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#1F2937",
  },

  jsonContainer: {
    maxHeight: 300,
    minHeight: 150,
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#1E293B", // Dark slate background
    borderWidth: 1,
    borderColor: "#334155",
  },

  outputText: {
    fontSize: 13,
    fontFamily: "monospace",
    color: "#E2E8F0", // Light text
    lineHeight: 20,
  },
});

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

import { ClipboardCopy, FileJson } from "lucide-react-native";

import PrimaryButton from "@/components/Button.tsx";
import DescriptionInput from "@/components/DescriptionCard.tsx";
import Header from "@/components/Header";

import { SchemaAPI } from "@/api/schema";
import { AdMobBannerAd } from "@/components/AdMobBanner";
import { trackServiceUsage } from "@/utils/usageTracker";

import {
  logInferenceError,
  logInferenceStart,
  logInferenceSuccess,
} from "@/utils/inferenceLogger";

export default function SchemaGenerator() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [schema, setSchema] = useState("");
  const [validExample, setValidExample] = useState("");
  const [invalidExample, setInvalidExample] = useState("");
  const [loading, setLoading] = useState(false);

  const copy = async (text: string) => {
    if (!text) return;
    await Clipboard.setStringAsync(text);

    if (Platform.OS === "android") {
      ToastAndroid.show("Copied!", ToastAndroid.SHORT);
    } else {
      alert("Copied!");
    }
  };

  const handleGenerate = async () => {
    if (!description.trim()) return;

    const requestData = { description };

    const startTime = logInferenceStart("schemaGenerator", requestData);

    try {
      setLoading(true);
      const res = await SchemaAPI.generateSchema(requestData);

      setSchema(JSON.stringify(res.schema, null, 2));
      setValidExample(JSON.stringify(res.valid_example, null, 2));
      setInvalidExample(JSON.stringify(res.invalid_example, null, 2));

      await trackServiceUsage("schemaGenerator");
      await logInferenceSuccess("schemaGenerator", requestData, res, startTime);
    } catch (err) {
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90, paddingTop: 25 }}
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

  /* OUTPUT CARDS */
  outputCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 18,
    marginTop: 26,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  outputHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  outputTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  outputTitle: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#2D2A26",
  },

  jsonContainer: {
    maxHeight: 230,
    minHeight: 230,
    borderWidth: 1,
    borderColor: "#E6E2DC",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#FBFAF8",
  },

  outputText: {
    fontSize: 13,
    fontFamily: "monospace",
    color: "#2D2A26",
    lineHeight: 20,
  },

  adContainer: {
    marginTop: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});

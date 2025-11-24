import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from "react-native";

import PrimaryButton from "@/components/Button.tsx";
import DescriptionInput from "@/components/DescriptionCard.tsx";
import Header from "@/components/Header";

import { SchemaAPI } from "@/api/schema";
import { trackServiceUsage } from "@/utils/usageTracker";

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

    try {
      setLoading(true);

      const res = await SchemaAPI.generateSchema({
        description: description,
      });

      setSchema(JSON.stringify(res.schema, null, 2));
      setValidExample(JSON.stringify(res.valid_example, null, 2));
      setInvalidExample(JSON.stringify(res.invalid_example, null, 2));

      // Track usage
      await trackServiceUsage("schemaGenerator");

    } catch (err) {
      console.log("Schema Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <Header title="Schema Generator" onBack={() => router.back()} onSettingsPress={() => {}} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 90, paddingTop: 20 }}>

        <Text style={styles.label}>Enter your text</Text>

        <DescriptionInput
          value={description}
          onChangeText={setDescription}
          placeholder="Enter your text to generate schema"
        />

        <PrimaryButton label={loading ? "Generating..." : "Generate Schema"} onPress={handleGenerate} />

        {schema !== "" && (
          <>
            {/* JSON SCHEMA */}
            <View style={styles.outputCard}>
              <View style={styles.outputHeader}>
                <Text style={styles.outputTitle}>JSON Schema</Text>
                <TouchableOpacity onPress={() => copy(schema)}>
                  <Ionicons name="copy-outline" size={22} color="#2D2A26" />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.jsonContainer}
                horizontal={false}
                nestedScrollEnabled
              >
                <ScrollView horizontal>
                  <Text style={styles.outputText}>{schema}</Text>
                </ScrollView>
              </ScrollView>
            </View>

            {/* VALID EXAMPLE */}
            <View style={styles.outputCard}>
              <View style={styles.outputHeader}>
                <Text style={styles.outputTitle}>Valid Example</Text>
                <TouchableOpacity onPress={() => copy(validExample)}>
                  <Ionicons name="copy-outline" size={22} color="#2D2A26" />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.jsonContainer}
                horizontal={false}
                nestedScrollEnabled
              >
                <ScrollView horizontal>
                  <Text style={styles.outputText}>{validExample}</Text>
                </ScrollView>
              </ScrollView>
            </View>

            {/* INVALID EXAMPLE */}
            <View style={styles.outputCard}>
              <View style={styles.outputHeader}>
                <Text style={styles.outputTitle}>Invalid Example</Text>
                <TouchableOpacity onPress={() => copy(invalidExample)}>
                  <Ionicons name="copy-outline" size={22} color="#2D2A26" />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.jsonContainer}
                horizontal={false}
                nestedScrollEnabled
              >
                <ScrollView horizontal>
                  <Text style={styles.outputText}>{invalidExample}</Text>
                </ScrollView>
              </ScrollView>
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
  },

  outputCard: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 16,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },

  outputHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  outputTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D2A26",
  },

  jsonContainer: {
    maxHeight: 220,
    minHeight: 220,
    borderWidth: 1,
    borderColor: "#E6E2DC",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#FAFAFA",
  },

  outputText: {
    fontFamily: "monospace",
    fontSize: 13,
    color: "#2D2A26",
    lineHeight: 18,
  },
});

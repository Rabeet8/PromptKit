import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import PrimaryButton from "@/components/Button.tsx";
import DescriptionInput from "@/components/DescriptionCard.tsx";
import Header from "@/components/Header";

export default function OnboardingScreen() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [userType, setUserType] = useState("");
  const [experience, setExperience] = useState("");
  const [purpose, setPurpose] = useState("");
    const [description, setDescription] = useState("");

  const userTypes = ["AI Developer", "ML Engineer", "Student", "Researcher", "Product Manager", "Hobbyist", "Other"];
  const experienceLevels = ["Beginner", "Intermediate", "Advanced"];

  const handleContinue = () => {
    if (!firstName || !lastName || !userType || !experience) return;

    // Save to backend or local storage later
    router.replace("/screens/Home");
  };

  return (
    <View style={styles.screen}>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120, paddingTop: 20 }}>
      <Header title="Let's Get Started" onBack={() => router.back()} onSettingsPress={() => {}} />

        {/* FIRST NAME */}
        <Text style={styles.label}>First Name</Text>
        <View style={styles.inputField}>
          <TextInput
            placeholder="John"
            placeholderTextColor="#A8A29E"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
          />
        </View>

        {/* LAST NAME */}
        <Text style={styles.label}>Last Name</Text>
        <View style={styles.inputField}>
          <TextInput
            placeholder="Doe"
            placeholderTextColor="#A8A29E"
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
          />
        </View>

        {/* USER TYPE */}
        <Text style={styles.label}>User Type</Text>
        <View style={styles.pillContainer}>
          {userTypes.map((type, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.pill, userType === type && styles.pillActive]}
              onPress={() => setUserType(type)}
            >
              <Text style={[styles.pillText, userType === type && styles.pillTextActive]}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* EXPERIENCE LEVEL */}
        <Text style={styles.label}>Experience Level</Text>
        <View style={styles.pillContainer}>
          {experienceLevels.map((lvl, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.pill, experience === lvl && styles.pillActive]}
              onPress={() => setExperience(lvl)}
            >
              <Text style={[styles.pillText, experience === lvl && styles.pillTextActive]}>{lvl}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* PURPOSE */}
        <Text style={styles.label}>Purpose of Using PromptKit</Text>

           <DescriptionInput
  // label="Description"
  value={description}
  onChangeText={setDescription}
  placeholder="Enter details about your purpose..."
/>

        <PrimaryButton label="Continue" onPress={handleContinue} />
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
    marginTop: 12,
    marginBottom: 8,
  },

  inputField: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ECE9E4",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  input: {
    fontSize: 15.5,
    color: "#2D2A26",
  },

  pillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10,
  },

  pill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#EFEDE8",
    borderRadius: 20,
  },

  pillActive: {
    backgroundColor: "#2D2A26",
  },

  pillText: {
    fontSize: 14,
    color: "#2D2A26",
  },

  pillTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  textAreaWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 18,
    minHeight: 140,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ECE9E4",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  textArea: {
    flex: 1,
    fontSize: 15.5,
    color: "#2D2A26",
    lineHeight: 22,
  },
});

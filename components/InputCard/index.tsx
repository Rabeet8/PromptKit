import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { InputCardProps } from "../../types";

const InputCard: React.FC<InputCardProps> = ({
  label,
  value,
  onChange,
  placeholder,
  keyboardType = "numeric",
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        keyboardType={keyboardType}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#B7B7B7"
      />
    </View>
  );
};

export default InputCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D2A26",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D5D5D5",
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#2D2A26",
  },
});

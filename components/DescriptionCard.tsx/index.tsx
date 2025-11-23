import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface Props {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const DescriptionInput: React.FC<Props> = ({
  label,
  value,
  onChangeText,
  placeholder = "Write description here...",
}) => {
  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A29E97"
        multiline
        scrollEnabled={true}
        textAlignVertical="top"
      />
    </View>
  );
};

export default DescriptionInput;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    color: "#000000ff",
    marginBottom: 8,
    letterSpacing: 0.5,
    fontWeight:'400'
  },
  input: {
    backgroundColor: "#FFFFFF",
    height: 130,            // 🔥 FIX — Now scroll works
    padding: 14,
    borderRadius: 12,
    fontSize: 14,
    color: "#2D2A26",
    borderWidth: 1,
    borderColor: "#E7E1D8",
  },
});

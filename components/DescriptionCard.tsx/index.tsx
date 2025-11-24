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

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#A8A39B"
          multiline
          scrollEnabled
          textAlignVertical="top"
        />
      </View>
    </View>
  );
};

export default DescriptionInput;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 22,
  },

  label: {
    fontSize: 15,
    fontFamily: "Poppins_500Medium",
    color: "#2D2A26",
    marginBottom: 10,
    letterSpacing: 0.3,
  },

  inputContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  input: {
    height: 150,
    padding: 14,
    fontSize: 15,
    fontFamily: "Poppins_400Regular",
    color: "#2D2A26",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E6DFD6",
  },
});

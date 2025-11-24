import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
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

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          keyboardType={keyboardType}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#A8A39B"
        />
      </View>
    </View>
  );
};

export default InputCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    marginTop: 18,
    marginBottom: 10,
  },

  label: {
    fontSize: 15,
    fontFamily: "Poppins_600SemiBold",
    color: "#2D2A26",
    marginBottom: 10,
    letterSpacing: 0.2,
  },

  inputWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E6DFD6",
    paddingHorizontal: 4,
    paddingVertical: 2,
  },

  input: {
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
    color: "#2D2A26",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
});

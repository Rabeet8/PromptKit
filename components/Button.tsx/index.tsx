import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { PrimaryButtonProps } from "../../types";

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  disabled = false,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        disabled && styles.btnDisabled,
        { transform: [{ scale: pressed ? 0.97 : 1 }] },
      ]}
    >
      <Text style={styles.btnText}>{label}</Text>
    </Pressable>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "#2D2A26",
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 26,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },

  btnDisabled: {
    opacity: 0.55,
  },

  btnText: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 17,
    fontFamily: "Poppins_600SemiBold",
    letterSpacing: 0.3,
  },
});

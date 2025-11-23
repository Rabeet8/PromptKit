import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { HeaderProps } from "../../types";

const Header: React.FC<HeaderProps> = ({ title, onBack, onSettingsPress }) => {
  return (
    <View style={styles.header}>
      {/* Back Button */}
      <TouchableOpacity onPress={onBack} hitSlop={10} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={26} color="#2D2A26" />
      </TouchableOpacity>

      {/* Center Title */}
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    marginTop: 40,
  },

  backBtn: {
    position: "absolute",
    left: 0,
    padding: 5,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2D2A26",
    textAlign: "center",
  },
});

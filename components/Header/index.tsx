import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { HeaderProps } from "../../types";

const Header: React.FC<HeaderProps> = ({ title, onBack }) => {
  return (
    <View style={styles.headerWrapper}>
      {/* Back Button */}
      <TouchableOpacity onPress={onBack} hitSlop={15} style={styles.backBtn}>
        <ArrowLeft size={26} color="#2D2A26" strokeWidth={2.4} />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerWrapper: {
    height: 58,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 42,
    marginBottom: 20,

    // subtle shadow for premium feel
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  backBtn: {
    position: "absolute",
    left: 0,
    padding: 6,
    borderRadius: 12,
  },

  title: {
    fontSize: 22,
    fontFamily: "Poppins_600SemiBold",
    color: "#2D2A26",
    textAlign: "center",
    letterSpacing: 0.3,
  },
});

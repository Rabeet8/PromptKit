import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { CostCardProps } from "../../types";

const CostCard: React.FC<CostCardProps> = ({
  title,
  monthlyCost,
  dailyCost = "—",
  yearlyCost = "—",
}) => {
  return (
    <View style={styles.cardWrapper}>
      <View style={styles.accentBar} />

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>

        <Text style={styles.mainValue}>${monthlyCost}</Text>
      </View>
    </View>
  );
};

export default CostCard;

const styles = StyleSheet.create({
  cardWrapper: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    marginTop: 12,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  accentBar: {
    width: 5,
    borderRadius: 8,
    backgroundColor: "#2D2A26",
    marginRight: 14,
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 15,
    fontFamily: "Poppins_600SemiBold",
    color: "#2D2A26",
    marginBottom: 6,
  },

  mainValue: {
    fontSize: 32,
    fontFamily: "Poppins_700Bold",
    color: "#2D2A26",
    marginBottom: 8,
    marginTop: 2,
  },

  subRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },

  subValue: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#7A736C",
  },
});

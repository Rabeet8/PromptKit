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
    <View style={styles.costCard}>
      <Text style={styles.costTitle}>{title}</Text>
      <Text style={styles.costValue}>$ {monthlyCost}</Text>

    </View>
  );
};

export default CostCard;

const styles = StyleSheet.create({
  costCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    marginTop: 8,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  costTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2D2A26",
  },
  costValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "#2D2A26",
    marginVertical: 10,
  },
  costSub: {
    fontSize: 14,
    color: "#8C877F",
  },
});

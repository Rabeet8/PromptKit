import React from "react";
import { View, StyleSheet } from "react-native";
import InputCard from "../InputCard";
import { InputRowProps } from "../../types";

const InputRow: React.FC<InputRowProps> = ({ left, right }) => {
  return (
    <View style={styles.row}>
      <View style={styles.half}>
        <InputCard {...left} />
      </View>
      <View style={styles.half}>
        <InputCard {...right} />
      </View>
    </View>
  );
};

export default InputRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  half: {
    width: "48%",
  },
});

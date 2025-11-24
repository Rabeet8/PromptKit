import React from "react";
import { StyleSheet, View } from "react-native";
import { InputRowProps } from "../../types";
import InputCard from "../InputCard";

const InputRow: React.FC<InputRowProps> = ({ left, right }) => {
  return (
    <View style={styles.row}>
      <View style={styles.column}>
        <InputCard {...left} />
      </View>

      <View style={styles.column}>
        <InputCard {...right} />
      </View>
    </View>
  );
};

export default InputRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 14, // modern spacing
    marginBottom: 10,
    width: "100%",
  },

  column: {
    flex: 1,
  },
});

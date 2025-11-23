import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { CacheSliderProps } from "../../types";

const CacheSlider: React.FC<CacheSliderProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>
        {label} ({value}%)
      </Text>

      <Slider
        style={{ width: "100%", height: 40 }}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        minimumTrackTintColor="#2D2A26"
        maximumTrackTintColor="#D5D5D5"
        thumbTintColor="#2D2A26"
        onValueChange={onChange}
      />
    </View>
  );
};

export default CacheSlider;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 16,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    marginTop: 20,

  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D2A26",
    marginBottom: 10,
  },
});

import Slider from "@react-native-community/slider";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
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
        {label} <Text style={styles.valueText}>({value}%)</Text>
      </Text>

      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        minimumTrackTintColor="#2D2A26"
        maximumTrackTintColor="#CFCAC3"
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
    padding: 20,
    borderRadius: 18,
    marginBottom: 20,
    marginTop: 16,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  label: {
    fontSize: 15,
    fontFamily: "Poppins_600SemiBold",
    color: "#2D2A26",
    marginBottom: 12,
  },

  valueText: {
    fontSize: 15,
    fontFamily: "Poppins_500Medium",
    color: "#7A736C",
  },

  slider: {
    width: "100%",
    height: 40,
  },
});

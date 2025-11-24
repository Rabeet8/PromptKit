import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ModelDropdownProps } from "../../types";

const ModelDropdown: React.FC<ModelDropdownProps> = ({
  label,
  value,
  options,
  isOpen,
  onToggle,
  onSelect,
  loading = false,
  maxMenuHeight = 180,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity style={styles.dropdown} onPress={onToggle} disabled={loading}>
        <Text style={[styles.dropdownText, loading && styles.disabledText]}>{loading ? "Loading..." : value}</Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color={loading ? "#8C877F" : "#2D2A26"}
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdownMenu}>
          <ScrollView
            style={{ maxHeight: maxMenuHeight }}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
          >
            {options.map((opt, i) => (
              <TouchableOpacity
                key={`${opt}-${i}`}
                style={styles.dropdownItem}
                onPress={() => onSelect(opt)}
              >
                <Text style={styles.dropdownItemText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default ModelDropdown;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 16,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D2A26",
    marginBottom: 10,
  },
  dropdown: {
    backgroundColor: "#F1EFEA",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 16,
    color: "#2D2A26",
  },
  disabledText: {
    color: "#8C877F",
  },
  dropdownMenu: {
    marginTop: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 6,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    maxHeight: 220,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#2D2A26",
  },
});
